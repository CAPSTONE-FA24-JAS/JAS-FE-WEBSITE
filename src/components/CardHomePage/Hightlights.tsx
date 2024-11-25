import { useState } from 'react'

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
      <h2 className='mb-20 text-4xl text-center uppercase'>PAST AUCTION HIGHLIGHTS</h2>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        {paginatedHighlights.map((item, index) => (
          <div key={index} className='flex flex-col items-center bg-gray-200 border rounded-lg shadow-lg h-96'>
            <img src={item.imageUrl} alt={item.title} className='object-cover w-full h-56 mb-4 rounded-md' />
            <div className='flex flex-col items-center w-full px-4'>
              <h3 className='mb-2 text-lg font-semibold text-center uppercase'>{item.title}</h3>
              <div className='w-16 mb-8 border-b-2 border-gray-400' />
              <p className='text-sm italic font-semibold text-gray-600'>{item.detail}</p>
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
