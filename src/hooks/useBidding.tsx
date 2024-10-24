import { useState, useCallback, useRef, useEffect } from 'react'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:7251'

export interface Message {
  customerId: string
  currentPrice: number
  bidTime: string
  firstName: string
  lastName: string
}

interface UseBiddingResult {
  isConnected: boolean
  endTime: string
  highestPrice: number
  messages: Message[]
  error: string | null
  joinLiveBidding: (accountId: string | number, lotId: string | number) => Promise<void>
  sendBid: (price: number) => Promise<void>
  disconnect: () => Promise<void>
}

export function useBidding(): UseBiddingResult {
  const [isConnected, setIsConnected] = useState(false)
  const [highestPrice, setHighestPrice] = useState<number>(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [endTime, setEndTime] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const connectionRef = useRef<HubConnection | null>(null)

  const setupSignalRHandlers = useCallback((connection: HubConnection) => {
    // Xử lý sự kiện khi có người tham gia phòng đấu giá
    connection.on('JoinLot', (user: string, message: string) => {
      console.log(`${user}: ${message}`)
    })

    // Xử lý sự kiện khi có người đặt giá
    connection.on(
      'SendBiddingPriceForStaff',
      (customerId: string, price: number, bidTime: string, firstName: string, lastName: string) => {
        console.log(`New bid from ${customerId}: ${price} at ${bidTime} by ${firstName} ${lastName}`)
        setMessages((prev) => [
          ...prev,
          {
            customerId,
            currentPrice: price,
            bidTime,
            firstName,
            lastName
          }
        ])
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
      console.log(`All bids`, bids)
      setMessages(bids)
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

  const sendBid = useCallback(async (price: number) => {
    if (!connectionRef.current?.connectionId) {
      setError('No active connection')
      return
    }

    const body = {
      currentPrice: price,
      bidTime: new Date().toISOString(),
      connectionId: connectionRef.current.connectionId
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/BidPrices/PlaceBiding/place-bid`, body)

      if (!response.data.isSuccess) {
        throw new Error(response.data.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to place bid'
      setError(errorMessage)
      console.error('Error placing bid:', err)
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
    sendBid,
    disconnect
  }
}
