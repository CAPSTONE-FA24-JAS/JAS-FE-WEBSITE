import React, { useState } from 'react'
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons'
import { Message } from '../../../../../hooks/useBidding'
import { LotDetail } from '../../../../../types/Lot.type'

interface User {
  customerId: string
  firstName: string
  lastName: string
  joinTime: string
}

interface SampleData {
  Fixed_Price: {
    fixedPrice: number
    users: User[]
  }
  Secret_Auction: {
    bids: Message[]
  }
}

// Sample data
const SAMPLE_DATA: SampleData = {
  Fixed_Price: {
    fixedPrice: 1500,
    users: [
      { customerId: 'U001', firstName: 'John', lastName: 'Doe', joinTime: '2024-03-15 10:30' },
      { customerId: 'U002', firstName: 'Alice', lastName: 'Smith', joinTime: '2024-03-15 10:35' },
      { customerId: 'U003', firstName: 'Robert', lastName: 'Johnson', joinTime: '2024-03-15 10:40' },
      { customerId: 'U004', firstName: 'Emma', lastName: 'Davis', joinTime: '2024-03-15 10:45' },
      { customerId: 'U005', firstName: 'Michael', lastName: 'Wilson', joinTime: '2024-03-15 10:50' }
    ]
  },
  Secret_Auction: {
    bids: [
      { bidTime: '2024-03-15 10:30', customerId: 'U001', firstName: 'John', lastName: 'Doe', currentPrice: 2000 },
      { bidTime: '2024-03-15 10:35', customerId: 'U002', firstName: 'Alice', lastName: 'Smith', currentPrice: 2200 },
      { bidTime: '2024-03-15 10:40', customerId: 'U003', firstName: 'Robert', lastName: 'Johnson', currentPrice: 2500 },
      { bidTime: '2024-03-15 10:45', customerId: 'U004', firstName: 'Emma', lastName: 'Davis', currentPrice: 2800 },
      { bidTime: '2024-03-15 10:50', customerId: 'U005', firstName: 'Michael', lastName: 'Wilson', currentPrice: 3000 }
    ]
  }
}

interface HeaderControlsProps {
  backgroundColor: string
  isPlaying: boolean
  setIsPlaying: (value: boolean) => void
}

const HeaderControls: React.FC<HeaderControlsProps> = ({ backgroundColor, isPlaying, setIsPlaying }) => (
  <div className='flex justify-between py-1'>
    <div className='flex gap-2'>
      <button
        className={`flex items-center justify-center p-2 text-center ${backgroundColor} rounded-3xl`}
        onClick={() => setIsPlaying(false)}
      >
        <PauseOutlined style={{ fontSize: '20px' }} />
      </button>
      <button
        className={`flex items-center justify-center p-2 text-center ${backgroundColor} rounded-3xl`}
        onClick={() => setIsPlaying(true)}
      >
        <CaretRightOutlined style={{ fontSize: '20px' }} />
      </button>
    </div>
    <div className='text-sm'>Status: {isPlaying ? 'Running' : 'Paused'}</div>
  </div>
)

interface LiveBiddingProps {
  bids: Message[]
  itemLot: LotDetail
}

const LiveBidding: React.FC<LiveBiddingProps> = ({ bids, itemLot }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true)

  const calculatePriceReduction = (startPrice: number, currentPrice: number): string => {
    const reduction = ((startPrice - currentPrice) / startPrice) * 100
    return reduction.toFixed(1)
  }

  const renderBiddingContent = () => {
    switch (itemLot.lotType) {
      case 'Public_Auction':
        return (
          <>
            <div className='p-4 text-white bg-red-600 rounded-t-lg'>
              <h2 className='mb-2 text-2xl font-bold'>TOP BID</h2>
              <HeaderControls backgroundColor='bg-red-500' isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
            </div>
            <div className='mt-4'>
              {Array.isArray(bids) && bids.length > 0 ? (
                bids.map((bid, index) => (
                  <div key={index} className='flex justify-between mb-1 text-sm'>
                    <span>{bid.bidTime}</span>
                    <span>
                      {bid.customerId}: {bid.firstName} {bid.lastName}
                    </span>
                    <span>${bid.currentPrice}</span>
                  </div>
                ))
              ) : (
                <div className='text-center text-gray-500'>No bids yet</div>
              )}
            </div>
          </>
        )

      case 'Secret_Auction':
        const secretBids = SAMPLE_DATA.Secret_Auction.bids
        return (
          <>
            <div className='p-4 text-white bg-blue-600 rounded-t-lg'>
              <h2 className='mb-2 text-2xl font-bold'>PRIVATE TOP BID</h2>
              <HeaderControls backgroundColor='bg-blue-500' isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
              <p className='mt-2 text-4xl font-bold'>${secretBids[secretBids.length - 1].currentPrice}</p>
            </div>
            <div className='mt-4'>
              {secretBids.map((bid, index) => (
                <div key={index} className='flex justify-between p-2 mb-2 text-sm rounded bg-gray-50'>
                  <span>{bid.bidTime}</span>
                  <span>
                    {bid.customerId}: {bid.firstName} {bid.lastName}
                  </span>
                  <span>${bid.currentPrice}</span>
                </div>
              ))}
            </div>
          </>
        )

      case 'Fixed_Price':
        const { fixedPrice, users } = SAMPLE_DATA.Fixed_Price
        return (
          <>
            <div className='p-4 text-white bg-green-600 rounded-t-lg'>
              <h2 className='mb-2 text-2xl font-bold'>FIXED PRICE</h2>
              <HeaderControls backgroundColor='bg-green-500' isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
              <p className='mt-2 text-4xl font-bold'>${fixedPrice}</p>
            </div>
            <div className='mt-4'>
              <h3 className='mb-2 text-lg font-semibold'>Interested Buyers</h3>
              {users.map((user, index) => (
                <div key={index} className='flex items-center gap-3 p-3 mb-2 rounded bg-gray-50'>
                  <div className='flex items-center justify-center w-10 h-10 font-semibold text-green-700 bg-green-100 rounded-full'>
                    {user.firstName.charAt(0)}
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium'>
                      {user.firstName} {user.lastName}
                    </div>
                    <div className='text-sm text-gray-500'>ID: {user.customerId}</div>
                  </div>
                  <div className='text-sm text-gray-500'>{user.joinTime.split(' ')[1]}</div>
                </div>
              ))}
            </div>
          </>
        )

      case 'Auction_Price_GraduallyReduced':
        const startPrice = itemLot.startPrice || 0
        return (
          <>
            <div className='p-4 text-white bg-purple-600 rounded-t-lg'>
              <h2 className='mb-2 text-2xl font-bold'>DECLINING PRICE AUCTION</h2>
              <HeaderControls backgroundColor='bg-purple-500' isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <div className='p-3 bg-purple-500 rounded'>
                  <div className='text-sm opacity-80'>Starting Price</div>
                  <div className='text-2xl font-bold'>${startPrice}</div>
                </div>
                <div className='p-3 bg-purple-500 rounded'>
                  <div className='text-sm opacity-80'>Current Price</div>
                  <div className='text-2xl font-bold'>$123123123</div>
                </div>
              </div>
              <div className='p-2 mt-4 text-center bg-purple-500 rounded'>
                <span className='text-lg'>Price Reduction: {calculatePriceReduction(startPrice, 10000)}%</span>
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return <div className='p-4 bg-white rounded-lg shadow-md h-[80vh] overflow-auto'>{renderBiddingContent()}</div>
}

export default LiveBidding
