import Slider from 'antd/es/slider'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useViewDetailLotByIdQuery } from '../../../../services/overview.services'
import { FaArrowLeft } from 'react-icons/fa'

interface ImageJewelry {
  imageLink: string
  title: string
  thumbnailImage: string
  jewelryId: number
}

interface KeyCharacteristicDetail {
  id: number
  description: string
  jewelryId: number
  keyCharacteristicId: number
  keyCharacteristic: {
    id: number
    name: string
  }
}

export default function LotDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useViewDetailLotByIdQuery(Number(id))

  const [mainImageIndex, setMainImageIndex] = useState(0)

  if (isLoading) return <p>Loading...</p>
  if (error || !data) return <p>Error loading lot details!</p>

  const lotDetail = data.data

  return (
    <div className='mx-56 my-12'>
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className='mb-4  hover:text-blue-700'>
        <FaArrowLeft className='inline-block mr-2' style={{ fontSize: '1.5em' }} />
      </button>

      <div className='flex gap-8'>
        {/* Left Column: Images */}
        <div className='flex-1'>
          {/* Main Image */}
          <img
            src={lotDetail.jewelry.imageJewelries[mainImageIndex].imageLink}
            alt={`Lot ${lotDetail.id}`}
            className='object-cover w-full h-96 mb-4 rounded-md'
          />

          {/* Thumbnail Images in a Row */}
          <div className='flex gap-2'>
            {lotDetail.jewelry.imageJewelries.map((image: ImageJewelry, index: number) => (
              <img
                key={index}
                src={image.thumbnailImage}
                alt={`Thumbnail ${index}`}
                className={`object-cover w-24 h-24 mb-2 rounded-md cursor-pointer ${
                  mainImageIndex === index ? 'border-2 border-blue-500' : ''
                }`}
                onClick={() => setMainImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className='flex-1'>
          <h2 className='mb-4 text-2xl font-semibold'>{lotDetail.jewelry.name}</h2>
          <p className='mb-2  text-gray-400 font-base'>
            Estimate: {lotDetail.jewelry.estimatePriceMin} - {lotDetail.jewelry.estimatePriceMax} VND
          </p>
          <p className='mb-4  font-semibold'>Status: {lotDetail.status}</p>
          <h3 className='mb-2 font-bold'>LIVE AUCTION</h3>
          <div className='flex items-center mb-4'>
            <a href='URL_CỦA_BẠN' className='text-base' style={{ color: '#0099FF' }}>
              {lotDetail.auction.name} | {new Date(lotDetail.auction.startTime).toLocaleDateString()}
            </a>
          </div>
          <span className=' font-semibold'>Artist:</span>
          <p className='mb-4 text-base'>{lotDetail.jewelry.artist.name}</p>
          <span className='font-semibold'>Category:</span>
          <p className='mb-4 text-base'>{lotDetail.jewelry.category.name}</p>

          <p className='mb-4 text-base'>
            <span className='font-semibold'>Description</span>{' '}
          </p>
          <div className='mb-4'>
            <h4 className='mb-2 text-lg font-semibold'>Summary of Key Characteristics:</h4>
            <ul className='list-disc list-inside'>
              {lotDetail.jewelry.keyCharacteristicDetails.map((detail: KeyCharacteristicDetail, index: number) => (
                <li key={index} className='text-base'>
                  <span className='font-semibold'>{detail.keyCharacteristic.name}:</span> {detail.description}
                </li>
              ))}
            </ul>
          </div>

          <span className='font-semibold'>Global Shipping:</span>
          <p className='mb-4 text-base'>
            {lotDetail.globalShipping || 'Information about global shipping is not available.'}
          </p>
          <span className='font-semibold'>Post-Auction Support:</span>
          <p className='mb-4 text-base'>
            {lotDetail.postAuctionSupport || 'Details about post-auction support are not provided.'}
          </p>
          <span className='font-semibold'>Property Sold As-Is:</span>
          <p className='mb-4 text-base'>
            {lotDetail.propertySoldAsIs || 'Information about property sold as-is is not available.'}
          </p>
          <span className='font-semibold'>Bidding Guidelines:</span>
          <p className='mb-4 text-base'>{lotDetail.biddingGuidelines || 'Bidding guidelines are not specified.'}</p>
          <span className='font-semibold'>Buyer's Premium and Sales Tax:</span>
          <p className='mb-4 text-base'>
            {lotDetail.buyersPremium || "Details about buyer's premium and sales tax are not available."}
          </p>
          <span className='font-semibold'>Conditions of Sale:</span>
          <p className='mb-4 text-base'>{lotDetail.conditionsOfSale || 'Conditions of sale are not specified.'}</p>
          <span className='font-semibold'>Contact Us:</span>
          <p className='mb-4 text-base'>{lotDetail.contact || 'Contact information is not available.'}</p>
        </div>
      </div>
    </div>
  )
}
