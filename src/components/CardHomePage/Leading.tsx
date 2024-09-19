import React from 'react'

export default function LeadingPage() {
  // Replace these URLs with your actual image URLs
  const imageUrl2 =
    'https://media.istockphoto.com/id/692682044/photo/man-holding-smart-phone-with-blurred-background.jpg?s=612x612&w=0&k=20&c=x4ZD43Qfs4ceuEPO78F5DpSwc0OKIT0aurdVfCFN9kU='

  const imageUrl3 = 'https://nld.mediacdn.vn/291774122806476800/2023/11/16/vang-43-1700110857474900206702.jpg'

  const imageUrl4 = 'https://daugiabtn.com/wp-content/uploads/2021/01/auction-2-768x512.jpg'

  return (
    <div className='p-6 mx-28'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Text and button section */}
        <div className='flex flex-col items-center p-4 col-span-1'>
          <p className='text-center text-2xl mb-4 uppercase'>The Leading Boutique Jewelry and Watch Auction House</p>
          <button className='bg-white text-black border border-black py-2 px-4 rounded-lg text-sm hover:bg-black hover:text-white'>
            LEARN MORE
          </button>
        </div>
        {/* Remaining sections */}
        <div className='flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-lg'>
          <img src={imageUrl2} alt='Image 2' className='w-full h-52 object-cover mb-2 rounded-md' />
          <p className='text-center text-lg font-semibold mb-1'>BUYING AT AUCTION</p>
          <p className='text-center text-sm text-gray-600'>
            Bid from anywhere in the world. Auctions are all live + online and are held twice per month. Shop and bid on
            fine, vintage, antique, luxury brand jewelry, gemstones, and watches.
          </p>
        </div>
        <div className='flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-lg'>
          <img src={imageUrl3} alt='Image 3' className='w-full h-52 object-cover mb-2 rounded-md' />
          <p className='text-center text-lg font-semibold mb-1'>Schedule A Preview</p>
          <p className='text-center text-sm text-gray-600'>
            See something in one of our auctions that you would like to bid on? Schedule a private virtual preview to
            view the lot and talk with one of our senior specialists.
          </p>
        </div>
        <div className='flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-lg'>
          <img src={imageUrl4} alt='Image 4' className='w-full h-52 object-cover mb-2 rounded-md' />
          <p className='text-center text-lg font-semibold mb-1'>Selling At Auction</p>
          <p className='text-center text-sm text-gray-600'>
            Maximize your results—have bidders in over 100 countries compete for your jewelry and watches. No upfront or
            hidden fees. Fully-insured shipping covered by us. If we can't sell for the prices you agree to, you owe us
            nothing.
          </p>
        </div>
      </div>
    </div>
  )
}
