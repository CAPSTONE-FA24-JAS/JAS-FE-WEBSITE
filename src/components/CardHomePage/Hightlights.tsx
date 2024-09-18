import React, { useState } from 'react'

const highlights = [
  {
    imageUrl: 'https://lavenderstudio.com.vn/wp-content/uploads/2017/10/chup-hinh-trang-suc-2.jpg',
    title: 'Van Cleef & Arpels 10.33ct D IF Diamond Ring',
    detail: 'SOLD for $994,000'
  },
  {
    imageUrl: 'https://lavenderstudio.com.vn/wp-content/uploads/2017/10/chup-hinh-trang-suc-2.jpg',
    title: 'Art Deco Cartier Emerald Diamond Bracelet',
    detail: 'SOLD for $1,200,000'
  },
  {
    imageUrl: 'https://lavenderstudio.com.vn/wp-content/uploads/2017/10/chup-hinh-trang-suc-2.jpg',
    title: 'Art Deco Cartier Natural Pearl, Diamond Bracelet',
    detail: 'SOLD for $850,000'
  },
  {
    imageUrl: 'https://lavenderstudio.com.vn/wp-content/uploads/2017/10/chup-hinh-trang-suc-2.jpg',
    title: 'Art Deco Cartier Natural Pearl, Diamond Bracelet',
    detail: 'SOLD for $850,000'
  },
  {
    imageUrl: 'https://lavenderstudio.com.vn/wp-content/uploads/2017/10/chup-hinh-trang-suc-2.jpg',
    title: 'Art Deco Cartier Natural Pearl, Diamond Bracelet',
    detail: 'SOLD for $850,000'
  },
  {
    imageUrl: 'https://lavenderstudio.com.vn/wp-content/uploads/2017/10/chup-hinh-trang-suc-2.jpg',
    title: 'Art Deco Cartier Natural Pearl, Diamond Bracelet',
    detail: 'SOLD for $850,000'
  },
  {
    imageUrl: 'https://lavenderstudio.com.vn/wp-content/uploads/2017/10/chup-hinh-trang-suc-2.jpg',
    title: 'Art Deco Cartier Emerald Diamond Bracelet',
    detail: 'SOLD for $1,200,000'
  },
  {
    imageUrl: 'https://lavenderstudio.com.vn/wp-content/uploads/2017/10/chup-hinh-trang-suc-2.jpg',
    title: 'Art Deco Cartier Natural Pearl, Diamond Bracelet',
    detail: 'SOLD for $850,000'
  },
  {
    imageUrl: 'https://lavenderstudio.com.vn/wp-content/uploads/2017/10/chup-hinh-trang-suc-2.jpg',
    title: 'Art Deco Cartier Natural Pearl, Diamond Bracelet',
    detail: 'SOLD for $850,000'
  }
  // Add more items as needed
]

export default function Highlights() {
  const itemsPerPage = 6
  const [currentPage, setCurrentPage] = useState(1)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedHighlights = highlights.slice(startIndex, endIndex)

  const totalPages = Math.ceil(highlights.length / itemsPerPage)

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className='mx-56'>
      <h2 className='text-4xl text-center mb-20 uppercase'>PAST AUCTION HIGHLIGHTS</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {paginatedHighlights.map((item, index) => (
          <div key={index} className='flex flex-col items-center h-96 border bg-gray-200 rounded-lg shadow-lg'>
            <img src={item.imageUrl} alt={item.title} className='w-full h-56 object-cover mb-4 rounded-md' />
            <div className='w-full px-4 flex flex-col items-center'>
              <h3 className='text-lg font-semibold text-center mb-2 uppercase'>{item.title}</h3>
              <div className='w-16 border-b-2 border-gray-400 mb-8' />
              <p className='text-sm text-gray-600 italic font-semibold'>{item.detail}</p>
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
              className={`w-4 h-4 rounded-full ${currentPage === i + 1 ? 'bg-gray-600' : 'bg-gray-300'} cursor-pointer`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
