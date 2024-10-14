import React, { useState, useEffect } from 'react'
import { Button, Typography, Tag } from 'antd'

const { Text } = Typography

interface AuctionData {
  auctionId: string
  itemName: string
  highestBid: string
  status: string
  bidders: number
  remainingTime: number // Thời gian đấu giá còn lại (giây)
  imageUrl: string // Thêm thuộc tính chứa URL của ảnh
  estimate: string // Thêm thuộc tính cho Estimate
}

export default function LiveBidding() {
  // Giả định dữ liệu đấu giá
  const auctionItem: AuctionData = {
    auctionId: '123',
    itemName: 'Diamond Necklace',
    highestBid: '5000 USD',
    status: 'Ongoing',
    bidders: 10,
    remainingTime: 3600,
    imageUrl: 'https://via.placeholder.com/150',
    estimate: '4500 - 5500 USD'
  }

  const [timeLeft, setTimeLeft] = useState(auctionItem.remainingTime)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  return (
    <div className='p-4'>
      <h2 className='text-center text-xs font-bold uppercase tracking-wide mb-4'>Live Bidding - Product Details</h2>
      <div className='grid grid-cols-3 gap-1'>
        <div>
          <div className='relative flex items-center space-x-1 border border-red-500 p-4 rounded-lg'>
            <div className='absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg'>
              NOW
            </div>

            <img src={auctionItem.imageUrl} alt={auctionItem.itemName} className='w-12 h-12 object-cover' />

            <div>
              <div className='font-semibold'>{auctionItem.auctionId}</div>
              <div className='font-semibold'>{auctionItem.itemName}</div>
              <div>{auctionItem.estimate}</div>
            </div>
          </div>

          <div className='flex flex-col'>
            <div className='w-full'>
              <div className='bg-red-700 text-white font-bold px-4 py-2 rounded-lg w-full text-center'>
                <div>Current Bid:</div>
                <div className='text-2xl mb-6 '>${auctionItem.highestBid}</div>
                <div className='bg-black bg-opacity-30 text-white font-bold w-full text-center flex items-center'>
                  <span className='flex-grow text-center'>PADDLE 5678</span>
                  <span className='h-2 w-2 bg-green-500 rounded-full mr-2'></span>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-4 text-center'>
            <Button type='primary' disabled={timeLeft === 0}>
              Place Bid
            </Button>
          </div>
        </div>

        {/* Hai cột còn lại để trống */}
        <div></div>
        <div></div>
      </div>
    </div>
  )
}
