import { useNavigate } from 'react-router-dom'
import { useViewAuctionQuery } from '../../../../services/overview.services'
import { AuctionLanding } from '../../../../types/Auction.type'

export default function PastAuction() {
  const navigate = useNavigate()
  const { data } = useViewAuctionQuery(undefined, {
    refetchOnMountOrArgChange: true
  })
  const pastAuctions = data?.data.filter((auction: AuctionLanding) => auction.status === 'Past') || []
  console.log(pastAuctions)

  const handleViewLotsClick = (auctionId: number) => {
    navigate(`/lots/${auctionId}`)
  }

  return (
    <div className='relative flex flex-col items-start h-full'>
      {pastAuctions.map((auction: AuctionLanding) => (
        <div key={auction.id} className='relative w-full h-screen mb-2'>
          <img src={auction.imageLink} alt={auction.name} className='absolute inset-0 w-full h-full object-cover' />

          <div className='relative z-10 p-8 text-left bg-gray-200 bg-opacity-80 rounded-lg shadow-lg w-2/5 ml-16 mt-16'>
            <h1 className='mb-2 text-5xl font-bold text-black uppercase'>{auction.name}</h1>
            <p className='mb-4 text-xl font-bold text-black '>Live Auction</p>
            <p className='mb-4 text-base text-black'>
              <span className='font-bold'>Start Time:</span> {new Date(auction.startTime).toLocaleString()}
            </p>
            <p className='mb-4 text-base text-black'>
              <span className='font-bold'>End Time:</span> {new Date(auction.endTime).toLocaleString()}
            </p>
            <p className='mb-4 text-lg  text-black'>
              {auction.description} | {auction.totalLot} Lots
            </p>
            <button
              onClick={() => handleViewLotsClick(auction.id)}
              className='px-4 py-2 text-white uppercase bg-sky-500 rounded-lg hover:bg-gray-400'
            >
              View Lots
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
