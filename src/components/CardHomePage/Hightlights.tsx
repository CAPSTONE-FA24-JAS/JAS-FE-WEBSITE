import { useState, useEffect } from 'react'
import { useViewAuctionsByStatusQuery } from '../../services/overview.services'



interface Item {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  actualEndTime: string;
  description: string;
  imageLink: string;
  status: string;
  totalLot: number;
  lotDTOs: any[];
  imageUrl: string;
  title: string;
}

const Highlights = () => {
  const itemsPerPage = 6
  const [currentPage, setCurrentPage] = useState(1)
  const [highlights, setHighlights] = useState<Item[]>([])
  const { data: highlightsData } = useViewAuctionsByStatusQuery(4) 
  console.log("past:", highlightsData)
  useEffect(() => {
    if (highlightsData && highlightsData.isSuccess) {
      const formattedHighlights = highlightsData.data.map((item: Item) => ({
        name: item.name,
        imageUrl: item.imageLink,
        title: item.name,
        status: item.status,
        detail: `SOLD for ${item.totalLot} lots`,
        description: item.description
      }))
      setHighlights(formattedHighlights) 
    }
  }, [highlightsData]) 

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
        {Array.isArray(paginatedHighlights) && paginatedHighlights.map((highlight, index) => (
          <div key={index} className='flex flex-col items-center bg-gray-200 border rounded-lg shadow-lg h-96'>
            <img src={highlight.imageUrl} alt={highlight.title} className='object-cover w-full h-56 mb-4 rounded-md' />
            <div className='flex flex-col items-center w-full px-4'>
              <h3 className='mb-2 text-lg font-semibold font-sans italic text-center uppercase'>{highlight.name}</h3>
              <div className='w-16 mb-4 border-b-2 border-gray-400' />
              <p className='text-sm italic font-semibold text-gray-600 mb-2'>
                {highlight.description.length > 100 ? 
                  `${highlight.description.substring(0, 100)}...` : 
                  highlight.description}
              </p>
              <p className='mb-2  font-semibold text-gray-600 font-sans italic text-center uppercase'>{highlight.status}</p>
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

export default Highlights
