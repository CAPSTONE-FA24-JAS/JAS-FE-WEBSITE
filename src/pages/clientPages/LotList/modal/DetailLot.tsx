import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useViewDetailLotByIdQuery } from '../../../../services/overview.services'
import Slider from 'antd/es/slider'

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
  const { id } = useParams<{ id: string }>() // Lấy id từ URL
  const { data, isLoading, error } = useViewDetailLotByIdQuery(Number(id))

  const [mainImageIndex, setMainImageIndex] = useState(0)

  if (isLoading) return <p>Loading...</p>
  if (error || !data) return <p>Error loading lot details!</p>

  const lotDetail = data.data // Giả sử API trả về dữ liệu trong `data.data`

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <div>Next</div>,
    prevArrow: <div>Prev</div>,
    focusOnSelect: true,
    beforeChange: (current: number, next: number) => setMainImageIndex(next)
  }

  return (
    <div className='mx-56 my-12'>
      <div className='flex gap-8'>
        {/* Left Column: Images */}
        <div className='flex-1'>
          {/* Main Image */}
          <img
            src={lotDetail.jewelry.imageJewelries[mainImageIndex].imageLink}
            alt={`Lot ${lotDetail.id}`}
            className='object-cover w-full h-64 mb-4 rounded-md'
          />

          {/* Thumbnail Slider */}
          <Slider {...settings}>
            {lotDetail.jewelry.imageJewelries.map((image: ImageJewelry, index: number) => (
              <div key={index} onClick={() => setMainImageIndex(index)}>
                <img
                  src={image.thumbnailImage}
                  alt={`Thumbnail ${index}`}
                  className='object-cover w-full h-24 mb-2 rounded-md cursor-pointer'
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Right Column: Details */}
        <div className='flex-1'>
          <h2 className='mb-4 text-2xl font-semibold'>{lotDetail.jewelry.name}</h2>
          <p className='mb-2 text-lg font-semibold'>
            Estimate: {lotDetail.jewelry.estimatePriceMin} - {lotDetail.jewelry.estimatePriceMax} VND
          </p>
          <p className='mb-4 text-lg font-semibold'>Status: {lotDetail.status}</p>
          <p className='mb-4 text-base'>
            {lotDetail.auction.name} | {new Date(lotDetail.auction.startTime).toLocaleDateString()}
          </p>

          <h3 className='mb-2 text-xl font-semibold'>Details</h3>
          <p className='mb-4 text-base'>
            <span className='font-semibold'>Artist:</span> {lotDetail.jewelry.artist.name}
          </p>
          <p className='mb-4 text-base'>
            <span className='font-semibold'>Category:</span> {lotDetail.jewelry.category.name}
          </p>
          <p className='mb-4 text-base'>
            <span className='font-semibold'>Description:</span>{' '}
            {lotDetail.jewelry.description || 'No description available.'}
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

          <p className='mb-4 text-base'>
            <span className='font-semibold'>Global Shipping:</span>
            {lotDetail.globalShipping || 'Information about global shipping is not available.'}
          </p>
          <p className='mb-4 text-base'>
            <span className='font-semibold'>Post-Auction Support:</span>
            {lotDetail.postAuctionSupport || 'Details about post-auction support are not provided.'}
          </p>
          <p className='mb-4 text-base'>
            <span className='font-semibold'>Property Sold As-Is:</span>
            {lotDetail.propertySoldAsIs || 'Information about property sold as-is is not available.'}
          </p>
          <p className='mb-4 text-base'>
            <span className='font-semibold'>Bidding Guidelines:</span>
            {lotDetail.biddingGuidelines || 'Bidding guidelines are not specified.'}
          </p>
          <p className='mb-4 text-base'>
            <span className='font-semibold'>Buyer's Premium and Sales Tax:</span>
            {lotDetail.buyersPremium || "Details about buyer's premium and sales tax are not available."}
          </p>
          <p className='mb-4 text-base'>
            <span className='font-semibold'>Conditions of Sale:</span>
            {lotDetail.conditionsOfSale || 'Conditions of sale are not specified.'}
          </p>
          <p className='mb-4 text-base'>
            <span className='font-semibold'>Contact Us:</span>
            {lotDetail.contact || 'Contact information is not available.'}
          </p>
        </div>
      </div>
    </div>
  )
}
