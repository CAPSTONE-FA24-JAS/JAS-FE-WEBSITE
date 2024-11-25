import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import ProductDetail from './ProductDetail'
import LiveBidding from './LiveBidding'
import { useBidding } from '../../../../../hooks/useBidding'
import { useGetLotDetailByIdQuery, useGetPlayerInLotQuery } from '../../../../../services/lot.services'
import type { Data } from '../../../../../types/Account.type'
import { useBiddingMethod4 } from '../../../../../hooks/useBiddingMethod4'

export interface Bid {
  bidTime: string
  currentPrice: number
  customerId: number
  lotId: number
}

const Index = () => {
  const { disconnect, endTime, isConnected, joinLiveBidding, messages, status } = useBidding()
  const {
    joinLiveBiddingMethod4,
    messages: messagesMethod4,
    winnerCustomer,
    winnerPrice,
    reducePrice,
    isEndAuctionMethod4,
    disconnect: disconnectMethod4,
    status: statusMethod4
  } = useBiddingMethod4()

  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useGetLotDetailByIdQuery(Number(id))
  const { data: playerInLot } = useGetPlayerInLotQuery(Number(id))

  // Get user ID from localStorage
  const user = localStorage.getItem('userLogin')
  const userID = useMemo(() => {
    return user ? (JSON.parse(user) as Data).user?.id : NaN
  }, [user])

  // Time calculation logic
  const calculateTimeLeft = useCallback(() => {
    if (!endTime) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

    const difference = +new Date(endTime) - +new Date()

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    }
  }, [endTime])

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [calculateTimeLeft])

  const formatTimeDisplay = useMemo(() => {
    const { days, hours, minutes, seconds } = timeLeft

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }, [timeLeft])

  // Join live bidding on component mount
  useEffect(() => {
    if (!id || !data?.data?.lotType) return

    const joinBidding = async () => {
      if (data.data.lotType === 'Public_Auction') {
        await joinLiveBidding(userID, id.toString())
      } else if (data.data.lotType === 'Auction_Price_GraduallyReduced') {
        await joinLiveBiddingMethod4(userID, id.toString())
      }
    }

    joinBidding()

    return () => {
      if (data.data.lotType === 'Public_Auction') {
        disconnect()
      } else {
        disconnectMethod4()
      }
    }
  }, [id, data?.data?.lotType, userID])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='space-y-4'>
      <div className='flex-col gap-4'>
        <div className='w-full'>
          <div className='text-lg font-bold text-center'>Time left: {formatTimeDisplay}</div>
          {data?.data ? (
            data.data.lotType === 'Fixed_Price' || data.data.lotType === 'Secret_Auction' ? (
              <LiveBidding
                bids={messages}
                itemLot={data.data}
                playerInLot={playerInLot?.data}
                status={data.data.status}
              />
            ) : data.data.lotType === 'Auction_Price_GraduallyReduced' ? (
              <LiveBidding
                bids={messagesMethod4}
                itemLot={data.data}
                currentPrice={reducePrice}
                isEndAuction={isEndAuctionMethod4}
                winnerCustomer={winnerCustomer}
                winnerPrice={winnerPrice}
                status={statusMethod4}
              />
            ) : (
              <LiveBidding bids={messages} itemLot={data.data} status={status} />
            )
          ) : (
            <div>No lot data available</div>
          )}
        </div>

        {data?.data && (
          <div className={isConnected ? 'w-full' : 'w-full'}>
            <ProductDetail item={data.data} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Index
