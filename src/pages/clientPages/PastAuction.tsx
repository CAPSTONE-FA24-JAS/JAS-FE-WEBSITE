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
        className='absolute inset-0 object-cover w-full h-full'
      />
      <div className='absolute flex flex-col items-start top-4 left-32'>
        <div className='p-8 text-left bg-gray-200 rounded-lg shadow-lg bg-opacity-80 w-96'>
          <h1 className='mb-2 text-3xl font-bold text-black uppercase text-4'>Galleria by JAS® - August 27, 2024</h1>
          <p className='mb-4 text-base font-bold text-black'>Live bidding</p>
          <p className='mb-4 text-base text-black'>Live bidding began: Aug 27, 2024 at 11 AM EDT</p>
          <p className='mb-4 text-lg text-black'>New York, NY | 167 Lots</p>
          <button
            onClick={handleViewLotsClick}
            className='px-4 py-2 text-white uppercase rounded-lg bg-sky-500 hover:bg-gray-400'
          >
            View Lots
          </button>
        </div>
      </div>
    </div>
  )
}
