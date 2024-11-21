import { useState, useCallback, useRef, useEffect } from 'react'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import axios from 'axios'
import { baseUrlWithoutAPI } from '../utils/http'

const API_BASE_URL = baseUrlWithoutAPI

export interface Message {
  customerId: string
  currentPrice: number
  bidTime: string
  firstName: string
  lastName: string
  status: string
}

interface UseBiddingResult {
  isConnected: boolean
  endTime: string
  highestPrice: number
  messages: Message[]
  error: string | null
  joinLiveBidding: (accountId: string | number, lotId: string | number) => Promise<void>
  disconnect: () => Promise<void>
  status: string
}

export function useBidding(): UseBiddingResult {
  const [isConnected, setIsConnected] = useState(false)
  const [highestPrice, setHighestPrice] = useState<number>(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [endTime, setEndTime] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')

  const connectionRef = useRef<HubConnection | null>(null)

  const setupSignalRHandlers = useCallback((connection: HubConnection) => {
    // Xử lý sự kiện khi có người tham gia phòng đấu giá
    connection.on('JoinLot', (user: string, message: string) => {
      console.log(`${user}: ${message}`)
    })

    // Xử lý sự kiện khi có người đặt giá
    //  await _hubContext.Clients.Group(lotGroupName).SendAsync("SendBiddingPriceForStaff", customerId, customerName, request.CurrentPrice, request.BidTime);

    connection.on(
      'SendBiddingPriceForStaff',
      (customerId: string, firstName: string, lastName: string, price: string, bidtime: string) => {
        console.log(`Current price updated: ${price} at ${bidtime} by ${firstName} ${lastName}`)

        setMessages((prevMessages) => {
          const newBid = {
            currentPrice: Number(price),
            bidTime: bidtime,
            firstName: firstName,
            lastName: lastName,
            customerId: customerId,
            status: 'Processing'
          }
          // Nếu messages rỗng, trả về mảng chỉ có bid mới
          if (!prevMessages || prevMessages.length === 0) {
            return [newBid]
          }
          // Ngược lại thêm bid mới vào mảng hiện tại
          return [...prevMessages, newBid]
        })
      }
    )

    // Xử lý sự kiện khi đã xử lý lệnh bidding đó
    connection.on(
      'SendBiddingPriceForStaffAfterProcessingStream',
      (cusid: string, firstname: string, lastName: string, price: number, bidtime: string, status: string) => {
        console.log('SendBiddingPriceForStaffAfterProcessingStream')

        const newBid: Message = {
          currentPrice: Number(price),
          bidTime: bidtime,
          customerId: cusid,
          status: status,
          firstName: firstname,
          lastName: lastName
        }

        setMessages((prev) => {
          // Nếu không có bid nào trước đó, thêm bid này vào
          if (!prev || prev.length === 0) {
            return [newBid]
          }

          // Nếu đã có bid, cập nhật trạng thái của bid hiện tại
          return prev.map((message) =>
            message.customerId === cusid && message.status === 'Processing' && message.currentPrice === price
              ? { ...message, status: status }
              : message
          )
        })
      }
    )

    // Xử lý sự kiện cập nhật giá cao nhất
    connection.on('SendTopPrice', (price: number, bidTime: string) => {
      console.log(`Top price updated: ${price} at ${bidTime}`)
      setHighestPrice(price)
    })

    // Xử lý sự kiện cập nhật thời gian kết thúc
    connection.on('SendEndTimeLot', (lotId: number, newEndTime: string) => {
      console.log(`End time updated for lot ${lotId}: ${newEndTime}`)
      setEndTime(newEndTime)
    })

    //get all history bid

    connection.on('sendhistorybiddingoflotofstaff', (bids: Message[]) => {
      console.log(`sendhistorybiddingoflotofstaff All bids`, bids)
      setMessages(bids)
    })

    connection.on('StatusBid', (status: string) => {
      console.log('StatusBid', status)
      setStatus(status)
    })

    connection.on('UpdateStatusBid', (status: string) => {
      console.log('UpdateStatusBid', status)
      setStatus(status)
    })
  }, [])

  const joinLiveBidding = useCallback(async (accountId: string | number, lotId: string | number) => {
    try {
      if (connectionRef.current) {
        await connectionRef.current.stop()
      }

      const connection = new HubConnectionBuilder()
        .withUrl(`${API_BASE_URL}/auctionning`)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build()

      setupSignalRHandlers(connection)

      // Xử lý các sự kiện kết nối
      connection.onclose(() => {
        setIsConnected(false)
        setError('Connection closed')
      })

      connection.onreconnecting(() => {
        setIsConnected(false)
        setError('Attempting to reconnect...')
      })

      connection.onreconnected(() => {
        setIsConnected(true)
        setError(null)
      })

      await connection.start()
      console.log('SignalR Connection established')

      const connectionId = connection.connectionId
      if (!connectionId) {
        throw new Error('Failed to get connection ID')
      }

      // Gọi API để tham gia phòng đấu giá
      const response = await axios.post(`${API_BASE_URL}/api/BidPrices/JoinBid/join`, {
        accountId: Number(accountId),
        lotId: Number(lotId),
        connectionId
      })

      if (!response.data.isSuccess) {
        throw new Error(response.data.message)
      }

      connectionRef.current = connection
      setIsConnected(true)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to establish connection'
      setError(errorMessage)
      console.error('SignalR connection error:', err)
    }
  }, [])

  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      try {
        await connectionRef.current.stop()
        connectionRef.current = null
        setIsConnected(false)
        setMessages([])
        setHighestPrice(0)
        setEndTime('')
        setError(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect'
        setError(errorMessage)
        console.error('Error disconnecting:', err)
      }
    }
  }, [setupSignalRHandlers])

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    isConnected,
    endTime,
    highestPrice,
    messages,
    error,
    joinLiveBidding,
    disconnect,
    status
  }
}
