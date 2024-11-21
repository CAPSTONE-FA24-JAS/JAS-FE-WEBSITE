import { Card, Carousel } from 'antd'
import { useViewTopJewelryAuctionsQuery, useViewTopSellersQuery } from '../../../../../services/manageother.services'
import './customdots.css'

const TopProducts = () => {
  const { data: topJewelryData, isLoading: isLoadingJewelry } = useViewTopJewelryAuctionsQuery()
  const { data: topSellerData, isLoading: isLoadingSellers } = useViewTopSellersQuery()

  if (isLoadingJewelry || isLoadingSellers) {
    return <div>Loading...</div>
  }

  const topJewelry = topJewelryData?.data || []
  const topSellers = topSellerData?.data || []

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between'>
        {/* Top Jewelry Section */}
        <div className='w-1/3'>
          <h1 className='text-3xl font-semibold text-center mb-6'>Top Jewelry</h1>
          <Carousel autoplay dots className='custom-carousel'>
            {topJewelry.map((product) => (
              <div key={product.id}>
                <Card hoverable cover={<img alt={product.name} src={product.imageUrl} />} className='text-center'>
                  <Card.Meta
                    title={product.name}
                    description={`Giá: ${
                      product.price && !isNaN(product.price) ? product.price.toLocaleString() : 'N/A'
                    } VND`}
                  />
                </Card>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Top Sellers Section */}
        <div className='w-1/3'>
          <h1 className='text-3xl font-semibold text-center mb-6'>Top Sellers</h1>
          <Carousel autoplay dots className='custom-carousel'>
            {topSellers.map((seller) => (
              <div key={seller.customerDTO.id}>
                <Card
                  hoverable
                  // cover={
                  //   <img
                  //     alt={seller.customerDTO.firstName}
                  //     src={seller.customerDTO.profilePicture || '/path/to/default-image.jpg'}
                  //   />
                  // }
                  className='text-center'
                >
                  <Card.Meta
                    title={`${seller.customerDTO.firstName} ${seller.customerDTO.lastName}`}
                    description={`Total Valuation: ${seller.totalSellerValuation} items`}
                  />
                </Card>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Empty Section or Additional Content */}
        <div className='w-1/3'>{/* You can add any other content or sections here */}</div>
      </div>
    </div>
  )
}

export default TopProducts
