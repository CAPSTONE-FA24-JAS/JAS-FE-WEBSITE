import React from 'react'
import { Bid } from '.'
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons'

const LiveBidding: React.FC<{ bids: Bid[] }> = ({ bids }) => (
  <div className='p-4 bg-white rounded-lg shadow-md h-[80vh] overflow-auto'>
    <div className='p-4 text-white bg-red-600 rounded-t-lg'>
      <h2 className='mb-2 text-2xl font-bold'>TOP BID</h2>
      <p className='text-4xl font-bold'>${bids[0].amount.toLocaleString()}</p>
    </div>
    <div className='flex justify-between py-1'>
      <p className='mt-2 text-sm'>PADDLE 5678 (CONNECTED)</p>
      <div className='flex gap-2'>
        <button
          className='flex items-center justify-center p-2 text-center bg-red-500 rounded-3xl'
          onClick={() => console.log('Pause')} //truyền props vào đây
        >
          <PauseOutlined style={{ fontSize: '20px' }} />
        </button>
        <button
          className='flex items-center justify-center p-2 text-center bg-red-500 rounded-3xl'
          onClick={() => console.log('Start')} //truyền props vào đây
        >
          <CaretRightOutlined style={{ fontSize: '20px' }} />
        </button>
      </div>
    </div>

    <div className='mt-4'>
      {bids.map((bid, index) => (
        <div key={index} className='flex justify-between mb-1 text-sm'>
          <span>{bid.time}</span>
          <span>{bid.name}</span>
          <span>${bid.amount.toLocaleString()}</span>
        </div>
      ))}
    </div>
  </div>
)

export default LiveBidding
