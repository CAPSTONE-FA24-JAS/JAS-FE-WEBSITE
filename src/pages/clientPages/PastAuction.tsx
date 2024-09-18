import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function PastAuction() {
  const navigate = useNavigate()

  const handleViewLotsClick = () => {
    navigate('/lotslist')
  }

  return (
    <div className='relative h-screen overflow-hidden'>
      <img
        src='https://hoangphucphoto.com/wp-content/uploads/2023/10/anh-ts-thumb.jpg'
        alt='Auction Background'
        className='absolute inset-0 w-full h-full object-cover'
      />
      <div className='absolute top-4 left-32 flex flex-col items-start'>
        <div className='bg-gray-200 bg-opacity-80 p-8 rounded-lg shadow-lg text-left w-96'>
          <h1 className='text-3xl uppercase text-4 font-bold text-black mb-2'>Galleria by JAS® - August 27, 2024</h1>
          <p className='text-base font-bold text-black mb-4'>Live bidding</p>
          <p className='text-base text-black mb-4'>Live bidding began: Aug 27, 2024 at 11 AM EDT</p>
          <p className='text-lg text-black mb-4'>New York, NY | 167 Lots</p>
          <button
            onClick={handleViewLotsClick}
            className='bg-sky-500 text-white py-2 px-4 rounded-lg uppercase hover:bg-gray-400'
          >
            View Lots
          </button>
        </div>
      </div>
    </div>
  )
}
