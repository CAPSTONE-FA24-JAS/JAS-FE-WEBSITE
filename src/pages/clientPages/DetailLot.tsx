import React from 'react'

const lotDetail = {
  imageUrls: [
    'https://hoangphucphoto.com/wp-content/uploads/2023/10/anh-ts-thumb.jpg'
    // Add more image URLs as needed
  ],
  idlots: '102',
  name: 'Cartier Tank Solo in Steel',
  estimate: '$3,000 - $4,000',
  status: 'Passed',
  auctionInfo: 'Live Auction | Galleria by FORTUNA® - August 27, 2024',
  artist: 'Cartier',
  category: 'Watch',
  description: 'Summary of Key Characteristics',
  details: [
    { label: 'CIRCA', value: '2000s' },
    { label: 'CASE MATERIAL', value: 'Stainless steel' },
    { label: 'DIAL', value: 'Opaline white dial with printed Roman numerals' },
    { label: 'BRACELET MATERIAL', value: 'Original bracelet in steel' },
    { label: 'CASE DIMENSIONS', value: '27 mm wide x 34 mm lug-to-lug' },
    { label: 'BRACELET SIZE', value: '6 1/4 inches' },
    { label: 'SERIAL NUMBER', value: '584388ZX' },
    { label: 'REFERENCE NUMBER', value: '3169' },
    { label: 'CALIBER', value: '690' },
    { label: 'MOVEMENT', value: 'Quartz' }
  ],
  condition:
    'Condition: Dial is in excellent condition. Case is very good with minor scratches. Case and bracelet have been customized with aftermarket pave stones. Movement is running at time of cataloging. Overall, the present example is in excellent condition.',
  globalShipping:
    'With customers in over 100 countries, we provide fully insured global shipping, expertly arranged by our team. The shipping costs, determined based on the insured value of the package and its destination, will be calculated post-auction and added to your invoice. Please note, VAT, duties, or any additional charges related to international shipping are not included in these costs and remain the responsibility of the buyer.',
  postAuctionSupport:
    "As a full-service auction house, we take pride in the comprehensive range of post-auction services we offer, including ring resizing, stone replacement, and repair work. It's part of our commitment to ensure a seamless transaction and to cater to your needs even after the gavel falls. However, please note that the applicability of certain services may vary depending on the specifics of the lot. If you have any questions or need additional information such as a cost estimate, we encourage you to reach out to us.",
  propertySoldAsIs:
    'Please be aware that all lots are sold "As Is". We do not guarantee that the lot is in pristine condition or devoid of imperfections, or wear and tear that is consistent with the age of the item. Watches, unless still in original packaging or never worn, will likely have some degree of wear and scratches. This should be expected for many of the watches offered in auction. Even if a watch is running, bidders and buyers should expect that all movements will require maintenance. Watches are not guaranteed to be keeping time. It falls under the buyer\'s responsibility to inspect the lot or request additional photos and condition details prior to bidding.',
  biddingGuidelines:
    "Please remember that once you have placed a bid on FORTUNA's platform, it cannot be retracted or reduced.",
  buyersPremium:
    "A buyer's premium of 25% (30% if bidding on LiveAuctioneers, Invaluable, and Bidsquare) is applicable to all winning bids and is not included in the online bid value. We collect sales tax for lots shipped to the following states within the US: CA, CO, FL, GA, IL, MA, MD, MI, NJ, NY, OH, PA, RI, SC, TN, TX, and VA.",
  conditionsOfSale:
    'We encourage all potential bidders to consult our Conditions of Sale for comprehensive details. By placing a bid, you acknowledge that you have read and are bound by these conditions.',
  contact:
    'For further assistance or inquiries, please contact us at info@fortunaauction.com or call (212) 389-9040. For international calls (outside of the US) and all text messages, please use WhatsApp to reach us at +1 212-389-9040.'
}

export default function LotDetail() {
  return (
    <div className='mx-56 my-12'>
      <div className='flex gap-8'>
        {/* Left Column: Images */}
        <div className='flex-1'>
          {lotDetail.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Lot ${lotDetail.idlots}`}
              className='w-full h-64 object-cover mb-4 rounded-md'
            />
          ))}
        </div>

        {/* Right Column: Details */}
        <div className='flex-1'>
          <h2 className='text-2xl font-semibold mb-4'>{lotDetail.name}</h2>
          <p className='text-lg font-semibold mb-2'>Estimate: {lotDetail.estimate}</p>
          <p className='text-lg font-semibold mb-4'>Status: {lotDetail.status}</p>
          <p className='text-base mb-4'>{lotDetail.auctionInfo}</p>

          <h3 className='text-xl font-semibold mb-2'>Details</h3>
          <p className='text-base mb-4'>
            <span className='font-semibold'>Artist:</span> {lotDetail.artist}
          </p>
          <p className='text-base mb-4'>
            <span className='font-semibold'>Category:</span> {lotDetail.category}
          </p>
          <p className='text-base mb-4'>
            <span className='font-semibold'>Description:</span> {lotDetail.description}
          </p>
          <div className='mb-4'>
            <h4 className='text-lg font-semibold mb-2'>Summary of Key Characteristics:</h4>
            <ul className='list-disc list-inside'>
              {lotDetail.details.map((detail, index) => (
                <li key={index} className='text-base'>
                  <span className='font-semibold'>{detail.label}:</span> {detail.value}
                </li>
              ))}
            </ul>
          </div>
          <p className='text-base mb-4'>
            <span className='font-semibold'>Condition:</span> {lotDetail.condition}
          </p>
          <p className='text-base mb-4'>
            <span className='font-semibold'>Global Shipping:</span> {lotDetail.globalShipping}
          </p>
          <p className='text-base mb-4'>
            <span className='font-semibold'>Post-Auction Support:</span> {lotDetail.postAuctionSupport}
          </p>
          <p className='text-base mb-4'>
            <span className='font-semibold'>Property Sold As-Is:</span> {lotDetail.propertySoldAsIs}
          </p>
          <p className='text-base mb-4'>
            <span className='font-semibold'>Bidding Guidelines:</span> {lotDetail.biddingGuidelines}
          </p>
          <p className='text-base mb-4'>
            <span className='font-semibold'>Buyer's Premium and Sales Tax:</span> {lotDetail.buyersPremium}
          </p>
          <p className='text-base mb-4'>
            <span className='font-semibold'>Conditions of Sale:</span> {lotDetail.conditionsOfSale}
          </p>
          <p className='text-base mb-4'>
            <span className='font-semibold'>Contact Us:</span> {lotDetail.contact}
          </p>
        </div>
      </div>
    </div>
  )
}
