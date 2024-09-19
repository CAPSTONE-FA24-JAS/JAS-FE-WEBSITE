import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const lots = [
  {
    imageUrl: 'https://lavenderstudio.com.vn/wp-content/uploads/2017/10/chup-hinh-trang-suc-2.jpg',
    idlots: 'L001',
    name: 'Van Cleef & Arpels 10.33ct D IF Diamond Ring',
    estimate: '$994,000',
    status: 'Sold',
    category: 'Rings'
  },
  {
    imageUrl: 'https://lavenderstudio.com.vn/wp-content/uploads/2017/10/chup-hinh-trang-suc-2.jpg',
    idlots: 'L002',
    name: 'Art Deco Cartier Emerald Diamond Bracelet',
    estimate: '$1,200,000',
    status: 'Sold',
    category: 'Bracelets'
  },
  {
    imageUrl: 'https://lavenderstudio.com.vn/wp-content/uploads/2017/10/chup-hinh-trang-suc-2.jpg',
    idlots: 'L003',
    name: 'Art Deco Cartier Natural Pearl, Diamond Bracelet',
    estimate: '$850,000',
    status: 'Passed',
    category: 'Bracelets'
  }
  // Add more items as needed
]

export default function Lots() {
  const navigate = useNavigate()
  const itemsPerPage = 6
  const [currentPage, setCurrentPage] = useState(1)
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber)
  }

  const toggleDescription = () => {
    setIsExpanded(!isExpanded)
  }

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to the first page on search
  }

  const handleCategoryChange = (e: any) => {
    setSelectedCategory(e.target.value)
    setCurrentPage(1) // Reset to the first page on filter change
  }

  const handleLotClick = (lotId: any) => {
    navigate(`/detaillot/${lotId}`) // Navigate to the detail page for the selected lot
  }

  // Filter lots based on search term and category
  const filteredLots = lots.filter(
    (lot) =>
      lot.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'All' || lot.category === selectedCategory)
  )

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLots = filteredLots.slice(startIndex, endIndex)

  const totalPages = Math.ceil(filteredLots.length / itemsPerPage)

  return (
    <div className='mx-56'>
      <div className='flex items-start mb-20'>
        <div className='flex-1 pr-4'>
          <h2 className='text-2xl font-semibold mb-4'>Galleria by JAS® - August 27, 2024</h2>
          <p className='text-lg mb-2'>Live Auction</p>
          <p className='text-base mb-2'>Live bidding began: Aug 27, 2024 at 11 AM EDT</p>
          <p className='text-base'>New York, NY | 167 Lots</p>
        </div>
        <div className='w-px bg-gray-300 mx-4' />
        <div className='flex-1 pl-4'>
          <h2 className='text-xl font-semibold mb-4'>Auction Description</h2>
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
            <h3 className='text-lg font-semibold mb-2'>Location Description</h3>
            <p className='text-base mb-4'>Fortuna Showroom</p>
            <h3 className='text-lg font-semibold mb-2'>Viewing Information</h3>
            <p className='text-base mb-4'>August 20 to 23 and August 26 from 10 AM to 5 PM ET</p>
            <p className='text-base mb-4'>
              Contact our office (212) 389-9040, via email at info@fortunaauction.com or via our online scheduler to
              schedule a private, virtual or in-person preview.
            </p>
            <h3 className='text-lg font-semibold mb-2'>Notes</h3>
            <p className='text-base mb-4'>
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
      <div className='flex items-center mb-4'>
        <p className='text-lg font-semibold mr-4'> {filteredLots.length} LOTS</p>
        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={handleSearchChange}
          className='border px-4 py-2 rounded-lg mr-4'
        />
        <select value={selectedCategory} onChange={handleCategoryChange} className='border px-4 py-2 rounded-lg'>
          <option value='All'>All Categories</option>
          <option value='Rings'>Rings</option>
          <option value='Bracelets'>Bracelets</option>
          {/* Add more categories as needed */}
        </select>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {paginatedLots.map((item, index) => (
          <div
            key={index}
            className='flex flex-col items-center h-96 border bg-gray-200 rounded-lg shadow-lg cursor-pointer'
            onClick={() => handleLotClick(item.idlots)} // Add click handler for each lot
          >
            <img src={item.imageUrl} alt={item.name} className='w-full h-56 object-cover mb-4 rounded-md' />
            <div className='w-full px-4 flex flex-col items-start'>
              <h3 className='text-lg font-semibold text-left uppercase'>{item.idlots}</h3>
              <h3 className='text-lg font-semibold text-left uppercase'>{item.name}</h3>
              <p className='text-sm text-gray-600 italic font-semibold text-left'>Est. {item.estimate}</p>
              <p
                className={`text-sm font-semibold text-left ${
                  item.status === 'Sold' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.status}
              </p>
            </div>
          </div>
        ))}
      </div>
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
