import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useViewListLotByAuctionQuery } from '../../../services/overview.services'
import { LotDto, LotLanding } from '../../../types/Lot.type'

export default function Lots() {
  const navigate = useNavigate()
  const { auctionId } = useParams<{ auctionId: string }>()

  const auctionIdNumber = Number(auctionId)

  if (isNaN(auctionIdNumber)) {
    return <p>Invalid auction ID!</p>
  }

  const { data, isLoading, error } = useViewListLotByAuctionQuery(auctionIdNumber)

  const itemsPerPage = 6
  const [currentPage, setCurrentPage] = useState(1)
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  if (isLoading) return <p>Loading...</p>
  if (error || !data) return <p>Error loading lots or no data available!</p>

  const lotsData = data.data

  const lots: LotLanding[] = Array.isArray(lotsData) ? lotsData : [lotsData]

  if (lots.length === 0) {
  } else {
    console.log('Dữ liệu lots:', lots)
  }

  const allLotDTOs = lots.reduce((acc, lot: LotLanding) => {
    return acc.concat(lot.lotDTOs || [])
  }, [] as LotDto[])

  if (allLotDTOs.length === 0) {
  } else {
    console.log('Dữ liệu lotDTOs:', allLotDTOs)
  }

  // Filter lots based on search term and category
  const filteredLots = allLotDTOs.filter(
    (dto) => selectedCategory === 'All' || dto.lotType === selectedCategory // Chỉ lọc theo loại lotType nếu cần
  )

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const toggleDescription = () => {
    setIsExpanded(!isExpanded)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to the first page on search
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
    setCurrentPage(1) // Reset to the first page on filter change
  }

  const handleLotClick = (lotId: number) => {
    navigate(`/detaillot/${lotId.toString()}`) // Chuyển đổi lotId thành chuỗi
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLots = filteredLots.slice(startIndex, endIndex)

  const totalPages = Math.ceil(filteredLots.length / itemsPerPage)

  console.log('Auction Name:', data.name)

  return (
    <div className='mx-56 mt-8'>
      <div className='flex items-start mb-20'>
        <div className='flex-1 pr-4'>
          <h2 className='mb-4 text-4xl font-bold'>{lotsData.name}</h2>
          <p className='text-3xl mb-4 font-bold'>
            {new Date(lotsData.startTime).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <p className='mb-2 text-lg font-bold'>Live Auction</p>
          <div className='flex items-center mb-2'>
            <p className='text-base font-semibold mr-2'>Live bidding began:</p>
            <p className='text-base'>
              {new Date(lotsData.startTime).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}{' '}
              EDT
            </p>
          </div>
          <p className='text-base'>FPT, HO CHI MINH CITY | {lotsData.totalLot} Lots</p>
        </div>
        <div className='w-px mx-4 bg-gray-300' />
        <div className='flex-1 pl-4'>
          <h2 className='mb-4 text-xl font-semibold'>Auction Description</h2>
          <div
            className={`text-base mb-4 transition-max-height duration-300 ease-in-out overflow-hidden ${
              isExpanded ? 'max-h-screen' : 'max-h-24'
            }`}
          >
            <p className='mb-4'>
              Galleria features an extensive collection of everyday jewelry, including watches, estate pieces, and
              signed items. Our jewelry collection includes designer statement pieces, antiques, and vintage treasures
              that will enhance your style and complement your jewelry collection.
            </p>
            <h3 className='mb-2 text-lg font-semibold'>Location Description</h3>
            <p className='mb-4 text-base'>Fortuna Showroom</p>
            <h3 className='mb-2 text-lg font-semibold'>Viewing Information</h3>
            <p className='mb-4 text-base'>August 20 to 23 and August 26 from 10 AM to 5 PM ET</p>
            <p className='mb-4 text-base'>
              Contact our office (212) 389-9040, via email at info@fortunaauction.com or via our online scheduler to
              schedule a private, virtual or in-person preview.
            </p>
            <h3 className='mb-2 text-lg font-semibold'>Notes</h3>
            <p className='mb-4 text-base'>
              Sales tax applicable in: CA, CO, FL, GA, IL, MA, MD, MI, NJ, NY, OH, PA, RI, SC, TN, TX and VA. As part of
              our White Glove services to our clients, we arrange insured international shipping worldwide and carefully
              pack your item(s) for transit, your invoice will include a quote for this service.
            </p>
          </div>
          <button onClick={toggleDescription} className='text-blue-500 hover:underline focus:outline-none'>
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        </div>
      </div>

      {/* Filter and search */}
      <div className='flex items-center mb-4'>
        <p className='mr-4 text-lg font-semibold'> {filteredLots.length} LOTS</p>
        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={handleSearchChange}
          className='px-4 py-2 mr-4 border rounded-lg'
        />
        <select value={selectedCategory} onChange={handleCategoryChange} className='px-4 py-2 border rounded-lg'>
          <option value='All'>All Categories</option>
          {/* Map dynamic categories if available */}
          {/* {[...new Set(lots.map((lot: LotLanding) => lot.lotType))].map((category) => (
            // <option key={category} value={category}>
            //   {category}
            // </option>
          ))} */}
        </select>
      </div>

      {/* Lots grid */}
      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        {paginatedLots.map((item: LotDto) => (
          <div
            key={item.id}
            className='flex flex-col items-center bg-gray-200 border rounded-lg shadow-lg cursor-pointer h-96'
            onClick={() => handleLotClick(item.id)}
          >
            <img
              src={item.jewelry.imageJewelries[0]?.imageLink || ''} // Lấy imageLink từ imageJewelries
              alt={item.jewelry.name || 'Jewelry Image'}
              className='object-cover w-full h-56 mb-4 rounded-md'
            />
            <div className='flex flex-col items-start w-full px-4'>
              <h4 className='text-md font-medium text-left'>{item.title || 'Jewelry Title'}</h4>
              <h3 className='text-lg font-semibold text-left uppercase'>{item.jewelry.name || 'Jewelry Name'}</h3>
              <p className='text-sm italic font-semibold text-left text-gray-600'>
                Est: {item.jewelry.estimatePriceMin.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} -{' '}
                {item.jewelry.estimatePriceMax.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </p>
              <p
                className={`text-sm font-semibold text-left ${
                  item.status === 'Sold' ? 'text-green-500' : item.status === 'Pass' ? 'text-gray-500' : ''
                }`}
              >
                {item.status} {item.currentPriceWinner}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className='flex justify-center mt-6'>
        <div className='flex space-x-2'>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                currentPage === i + 1 ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-600'
              } cursor-pointer`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
