export default function AboutUs() {
  return (
    <div className='flex flex-wrap mx-auto max-w-6xl p-8'>
      {/* Cột 2/3 */}
      <div className='w-full md:w-2/3 p-4'>
        <h2 className='text-4xl font-bold mb-4 uppercase'>About JAS®</h2>
        <p className='mb-4'>
          One of JAS’s recent auctions featured online participation from bidders from all over the country.
        </p>
        <div className='flex mb-4'>
          <div className='flex-1 p-2'>
            <p>
              Headquartered at Lot E2a-7, D1 Street, High-Tech Park, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City,
              JASis a leading fine jewelry auction house. JAS provides a secure, transparent, trustworthy and regulated
              global auction marketplace for buying and selling fine jewelry.
            </p>
          </div>
          <div className='flex-1 p-2'>
            <img
              src='https://xdcs.cdnchinhphu.vn/zoom/600_315/446259493575335936/2024/5/20/daugia-17161957033192022518062-0-0-512-819-crop-17161958970651941040649.jpg'
              alt='Auction Image'
              className='w-full h-auto'
            />
          </div>
        </div>
        <p className='mb-4'>
          For consignors/sellers, JAS provides a means to maximize the value of their jewelry and watches by accessing
          and encouraging competition among bidders in multiple locations, without the upfront risk (in the form of
          hefty fixed fees) that they may incur when working with one of the “big four” auction houses, and with
          dedicated customer service that is unparalleled in the industry and available to all of our customers—not just
          a select few.
        </p>
        <h3 className='text-2xl font-semibold mb-2'>Selling At Auction</h3>
        <p className='mb-4'>
          For bidders/buyers, JAS guarantees the authenticity of the jewelry and gemstones they bid on, detailed and
          accurate product descriptions and images they can trust and rely on, and unparalleled dedicated customer
          service to ensure any questions or information they may need are addressed.
        </p>
        <h3 className='text-2xl font-semibold mb-2'>Buying at Auction</h3>
        <p className='mb-4'>
          In addition to our bi-weekly live and online auctions, JAS also offers valuation services. If you have an
          existing collection, estate or trust that needs valuation services, no matter where you are located, our
          extensive network of experts can provide you with the services you need.
        </p>
      </div>

      {/* Cột 1/3 */}
      <div className='w-full md:w-1/3 p-4'>
        <div className='bg-gray-100 p-4 rounded-lg shadow-md'>
          <h3 className='text-xl font-semibold mb-2 uppercase'>Contact Info</h3>
          <p className='mb-8 text-gray-600'>
            <strong>Address:</strong>
            <br />
            Lot E2a-7
            <br />
            D1 Street, High-Tech Park
            <br />
            Long Thanh My Ward, Thu Duc City, Ho Chi Minh City
          </p>
          <p className='mb-8 text-gray-600'>
            <strong>Hours:</strong>
            <br />
            Mon-Fri 10am-6pm EST
            <br />
            Office Visits by Appointment Only
          </p>
          <p className='mb-8 text-gray-600'>
            <strong>Phone:</strong>
            <br />
            (+84) 64-071-639
          </p>
          <p className='mb-8 text-gray-600'>
            <strong>WhatsApp:</strong>
            <br />
            (+84) 64-071-639
          </p>
          <p className='mb-8 text-gray-600'>
            <strong>Email:</strong>
            <br />
            jas@gmail.com
          </p>
        </div>
      </div>
    </div>
  )
}
