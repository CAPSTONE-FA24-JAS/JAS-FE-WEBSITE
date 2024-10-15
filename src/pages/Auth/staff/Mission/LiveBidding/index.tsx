import ProductDetail from './ProductDetail'
import LiveBidding from './LiveBidding'
import { useEffect, useState } from 'react'

export interface Bid {
  time: string
  name: string
  amount: number
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
  const endTime = new Date(new Date().getTime() + 5 * 60000).toISOString()

  const calculateTimeLeft = () => {
    const difference = +new Date(endTime) - +new Date()
    return difference > 0 ? Math.floor(difference / 1000) : 0 // Trả về số giây còn lại, nếu hết thì 0
  }

  const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, []) // nhét endtime vào đây nếu khi dùng api

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

  const bids: Bid[] = [
    { time: '9:00:05 AM', name: 'Nguyen Van N', amount: 9200 },
    { time: '8:05:45 AM', name: 'Nguyen Van P', amount: 9200 },
    { time: '8:25:10 AM', name: 'Nguyen Van K', amount: 9200 },
    { time: '9:48:33 AM', name: 'Nguyen Van T1', amount: 8700 },
    { time: '9:44:35 AM', name: 'Nguyen Van S', amount: 8500 },
    { time: '9:55:37 AM', name: 'Nguyen Van G1', amount: 8100 },
    { time: '8:51:33 AM', name: 'Nguyen Van M1', amount: 8000 },
    { time: '8:40:28 AM', name: 'Nguyen Van H1', amount: 7800 },
    { time: '10:44:12 AM', name: 'Nguyen Van U', amount: 7500 },
    { time: '10:15:55 AM', name: 'Nguyen Van O', amount: 7400 },
    { time: '11:01:25 AM', name: 'Nguyen Van F', amount: 7200 },
    { time: '9:14:50 AM', name: 'Nguyen Van F1', amount: 7100 },
    { time: '9:12:21 AM', name: 'Nguyen Van N1', amount: 6900 },
    { time: '9:44:16 AM', name: 'Nguyen Van V1', amount: 6800 },
    { time: '8:21:08 AM', name: 'Nguyen Van K1', amount: 6600 },
    { time: '9:31:15 AM', name: 'Nguyen Van V', amount: 6200 },
    { time: '8:11:23 AM', name: 'Nguyen Van E1', amount: 6200 },
    { time: '8:12:55 AM', name: 'Nguyen Van Q', amount: 5200 },
    { time: '10:05:56 AM', name: 'Nguyen Van I', amount: 5100 },
    { time: '9:11:02 AM', name: 'Nguyen Van Q1', amount: 5400 },
    { time: '8:22:16 AM', name: 'Nguyen Van A1', amount: 5300 },
    { time: '9:29:23 AM', name: 'Nguyen Van L1', amount: 5700 },
    { time: '8:09:55 AM', name: 'Nguyen Van R1', amount: 3600 },
    { time: '11:35:25 AM', name: 'Nguyen Van R', amount: 2300 },
    { time: '9:51:30 AM', name: 'Nguyen Van Z', amount: 2200 },
    { time: '10:15:48 AM', name: 'Nguyen Van O1', amount: 2000 },
    { time: '11:44:01 AM', name: 'Nguyen Van J', amount: 1500 },
    { time: '8:54:45 AM', name: 'Nguyen Van T', amount: 1400 },
    { time: '8:14:20 AM', name: 'Nguyen Van L', amount: 1300 },
    { time: '9:31:15 AM', name: 'Nguyen Van V', amount: 6200 },
    { time: '10:52:20 AM', name: 'Nguyen Van W', amount: 2800 },
    { time: '8:44:29 AM', name: 'Nguyen Van G', amount: 6400 },
    { time: '10:22:30 AM', name: 'Nguyen Van M', amount: 4500 },
    { time: '11:15:47 AM', name: 'Nguyen Van U1', amount: 4700 },
    { time: '9:12:15 AM', name: 'Nguyen Van D', amount: 4500 },
    { time: '9:12:15 AM', name: 'Nguyen Van D', amount: 4500 },
    { time: '10:20:45 AM', name: 'Nguyen Van E', amount: 3800 },
    { time: '8:47:12 AM', name: 'Nguyen Van C1', amount: 3800 },
    { time: '9:14:50 AM', name: 'Nguyen Van F1', amount: 3800 },
    { time: '10:17:15 AM', name: 'Nguyen Van I1', amount: 4300 },
    { time: '9:24:19 AM', name: 'Nguyen Van D1', amount: 2700 },
    { time: '9:00:05 AM', name: 'Nguyen Van N', amount: 9200 },
    { time: '8:05:45 AM', name: 'Nguyen Van P', amount: 9200 },
    { time: '9:31:15 AM', name: 'Nguyen Van V', amount: 6200 },
    { time: '8:44:36 AM', name: 'Nguyen Van A', amount: 7000 },
    { time: '8:44:34 AM', name: 'Nguyen Van B', amount: 1100 },
    { time: '8:44:33 AM', name: 'Nguyen Van C', amount: 1000 }
  ]

  return (
    <>
      <div className='mt-2 text-lg font-bold text-center'>Time left: {formatTime(timeLeft)}</div>

      <div className='flex flex-col gap-4 md:flex-row'>
        <div className='md:w-2/3'>
          <LiveBidding bids={bids} />
        </div>
        <div className='md:w-1/3'>
          <ProductDetail item={auctionItem} />
        </div>
      </div>
    </>
  )
}

export default Index
