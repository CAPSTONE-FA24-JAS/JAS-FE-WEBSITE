import ProductDetail from './ProductDetail'
import LiveBidding from './LiveBidding'
import { useEffect, useState, useRef } from 'react'
import { useBidding } from '../../../../../hooks/useBidding'
import { Data } from '../../../../../types/Account.type'
import { useParams } from 'react-router-dom'
import { useGetLotDetailByIdQuery } from '../../../../../services/lot.services'

export interface Bid {
  bidTime: string
  currentPrice: number
  customerId: number
  lotId: number
}

const Index = () => {
  const { disconnect, endTime, error, highestPrice, isConnected, joinLiveBidding, messages, sendBid } = useBidding()
  const { id } = useParams<{ id: string }>()

  const { data, isError, isLoading } = useGetLotDetailByIdQuery(Number(id))

  const user = localStorage.getItem('userLogin')
  let userID = NaN
  if (user) {
    const userData = JSON.parse(user) as Data
    userID = userData ? userData.user.id : NaN
  }
  console.log('user', userID)

  const calculateTimeLeft = () => {
    const difference = +new Date(endTime) - +new Date()
    return difference > 0 ? Math.floor(difference / 1000) : 0
  }

  const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft())
  const prevTimeLeft = useRef<number>(timeLeft) // Reference to store previous timeLeft

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

  useEffect(() => {
    if (id) {
      joinLiveBidding(userID, id.toString(), data?.data?.lotType || '')
    }

    return () => {
      disconnect()
    }
  }, [joinLiveBidding, disconnect, userID])

  return (
    <>
      <div className='mt-2 text-lg font-bold text-center'>Time left: {formatTime(timeLeft)}</div>

      <div className='flex flex-col gap-4 md:flex-row'>
        {isConnected && (
          <div className='md:w-2/5'>{data?.data && <LiveBidding bids={messages} itemLot={data?.data} />}</div>
        )}

        <div className='md:w-3/5'>{data?.data && <ProductDetail item={data.data} />}</div>
      </div>
    </>
  )
}

export default Index
