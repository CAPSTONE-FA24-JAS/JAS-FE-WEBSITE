import ProductDetail from './ProductDetail'
import LiveBidding from './LiveBidding'
import { useEffect, useState, useRef } from 'react'
import { useBidding } from '../../../../../hooks/useBidding'
import { Data } from '../../../../../types/Account.type'

export interface Bid {
  bidTime: string
  currentPrice: number
  customerId: number
  lotId: number
}

export interface AuctionItem {
  id: number
  name: string
  artist: string
  category: string
  description: string
  estimatedPrice: string
  currentBid: number
  bidIncrement: number
  images: string[]
}

const Index = () => {
  const { disconnect, endTime, error, highestPrice, isConnected, joinLiveBidding, messages, sendBid } = useBidding()

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

  const auctionItem: AuctionItem = {
    id: 4,
    name: "A Lady's Gold 'Santos Vendome' Wristwatch, Cartier",
    artist: 'Cartier',
    category: 'WATCHES',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    estimatedPrice: '$4,000 - $5,000',
    currentBid: 7000,
    bidIncrement: 250,
    images: [
      'https://via.assets.so/img.jpg?w=100&h=100&tc=blue&bg=gray',
      'https://via.assets.so/img.jpg?w=100&h=100&tc=blue&bg=green',
      'https://via.assets.so/img.jpg?w=100&h=100&tc=blue&bg=pink',
      'https://via.assets.so/img.jpg?w=100&h=100&tc=blue&bg=red'
    ]
  }

  useEffect(() => {
    joinLiveBidding(userID, 49)

    return () => {
      disconnect()
    }
  }, [joinLiveBidding, disconnect, userID])

  return (
    <>
      <div className='mt-2 text-lg font-bold text-center'>Time left: {formatTime(timeLeft)}</div>

      <div className='flex flex-col gap-4 md:flex-row'>
        <div className='md:w-2/3'>{isConnected && <LiveBidding bids={messages} />}</div>
        <div className='md:w-1/3'>
          <ProductDetail item={auctionItem} />
        </div>
      </div>
    </>
  )
}

export default Index
