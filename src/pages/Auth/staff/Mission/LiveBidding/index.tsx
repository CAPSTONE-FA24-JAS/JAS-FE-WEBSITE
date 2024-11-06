import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import ProductDetail from './ProductDetail'
import LiveBidding from './LiveBidding'
import { useBidding } from '../../../../../hooks/useBidding'
import { useGetLotDetailByIdQuery } from '../../../../../services/lot.services'
import type { Data } from '../../../../../types/Account.type'

export interface Bid {
  bidTime: string
  currentPrice: number
  customerId: number
  lotId: number
}

const Index = () => {
  const { disconnect, endTime, error, highestPrice, isConnected, joinLiveBidding, messages } = useBidding()
  const { id } = useParams<{ id: string }>()
  const { data, isError, isLoading } = useGetLotDetailByIdQuery(Number(id))

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
      joinLiveBidding(userID, id.toString(), data?.data?.lotType || '')
    }

    return () => {
      disconnect()
    }
  }, [joinLiveBidding, disconnect, userID, id, data?.data?.lotType])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='space-y-4'>
      <div className='flex-col gap-4'>
        {isConnected && data?.data && (
          <div className='w-full'>
            <div className='text-lg font-bold text-center'>Time left: {formatTime(timeLeft)}</div>
            <LiveBidding bids={messages} itemLot={data.data} />
          </div>
        )}

        {data?.data && (
          <div className={isConnected ? 'w-full' : 'w-full'}>{data?.data && <ProductDetail item={data?.data} />}</div>
        )}
      </div>
    </div>
  )
}

export default Index
