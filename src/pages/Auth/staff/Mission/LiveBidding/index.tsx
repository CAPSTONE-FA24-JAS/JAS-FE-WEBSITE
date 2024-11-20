import { useEffect, useState, useRef } from 'react'
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
  const { disconnect, endTime, error, highestPrice, isConnected, joinLiveBidding, messages } = useBidding()
  const {
    joinLiveBiddingMethod4,
    endTime: endTimeMethod4,
    messages: messagesMethod4,
    error: errorMethod4,
    winnerCustomer,
    winnerPrice,
    reducePrice,
    isEndAuctionMethod4,
    setResultBidding,
    disconnect: disconnectMethod4
  } = useBiddingMethod4()
  const { id } = useParams<{ id: string }>()
  const { data, isError, isLoading } = useGetLotDetailByIdQuery(Number(id))
  const { data: playerInLot, isError: errorPlayer, isLoading: loadingPlayer } = useGetPlayerInLotQuery(Number(id))

  console.log('end time method 4', endTimeMethod4)

  // Get user ID from localStorage
  const user = localStorage.getItem('userLogin')
  const userID = user ? (JSON.parse(user) as Data).user?.id : NaN

  // Time calculation logic
  const calculateTimeLeft = () => {
    const difference = +new Date(endTime) - +new Date()
    return difference > 0 ? Math.floor(difference / 1000) : 0
  }

  const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft())
  const prevTimeLeft = useRef<number>(timeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      if (newTimeLeft !== prevTimeLeft.current) {
        setTimeLeft(newTimeLeft)
        prevTimeLeft.current = newTimeLeft
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`
  }

  // Join live bidding on component mount
  useEffect(() => {
    if (id) {
      if (data?.data?.lotType === 'Public_Auction') {
        joinLiveBidding(userID, id.toString())
      }
      if (data?.data?.lotType === 'Auction_Price_GraduallyReduced') {
        joinLiveBiddingMethod4(userID, id.toString())
      }
    }

    return () => {
      if (data?.data?.lotType === 'Public_Auction') {
        disconnect()
      } else {
        disconnectMethod4()
      }
    }
  }, [joinLiveBidding, disconnect, userID, id, data?.data?.lotType])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='space-y-4'>
      <div className='flex-col gap-4'>
        <div className='w-full'>
          <div className='text-lg font-bold text-center'>Time left: {formatTime(timeLeft)}</div>
          {data?.data ? (
            data.data.lotType === 'Fixed_Price' || data.data.lotType === 'Secret_Auction' ? (
              <LiveBidding bids={messages} itemLot={data.data} playerInLot={playerInLot?.data} />
            ) : data.data.lotType === 'Auction_Price_GraduallyReduced' ? (
              <LiveBidding
                bids={messagesMethod4}
                itemLot={data.data}
                currentPrice={reducePrice}
                isEndAuction={isEndAuctionMethod4}
                winnerCustomer={winnerCustomer}
                winnerPrice={winnerPrice}
              />
            ) : (
              <LiveBidding bids={messages} itemLot={data.data} />
            )
          ) : (
            <div>No lot data available</div>
          )}
        </div>

        {data?.data && (
          <div className={isConnected ? 'w-full' : 'w-full'}>{data?.data && <ProductDetail item={data?.data} />}</div>
        )}
      </div>
    </div>
  )
}

export default Index
