import { useState } from 'react'
import { AuctionItem } from '.'

const ImageSlider: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0)

  return (
    <div className='flex gap-2'>
      <div className='w-4/5'>
        <img src={images[currentImage]} alt={`Main ${currentImage + 1}`} className='object-cover w-full h-96' />
      </div>
      <div className='w-1/5 mr-4'>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Preview ${index + 1}`}
            className={`w-full h-20 object-cover mb-2 cursor-pointer ${
              index === currentImage ? 'border-2 border-blue-500' : ''
            }`}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </div>
    </div>
  )
}

const ProductDetail: React.FC<{ item: AuctionItem }> = ({ item }) => (
  <div className='p-4 bg-white rounded-lg shadow-md'>
    <div className='flex items-center justify-between mb-4'>
      <h2 className='text-2xl font-bold'>
        <strong>Lot: </strong>
        {item.id}
      </h2>
      <p className='text-lg text-gray-500'>Est {item.estimatedPrice}</p>
    </div>
    <h1 className='mb-4 text-2xl font-bold'>{item.name}</h1>
    <h1 className='mb-4 text-2xl font-bold'>
      <strong>Type:</strong> Increase bid
    </h1>
    <p className='mb-4 text-xl font-bold text-red-600'>NOW!</p>
    <ImageSlider images={item.images} />
    <div className='mt-4 mb-4'>
      <p>
        <strong>ARTIST:</strong> {item.artist}
      </p>
      <p>
        <strong>CATEGORY:</strong> {item.category}
      </p>
    </div>
    <p>
      <strong>DESCRIPTION:</strong> {item.description}
    </p>
  </div>
)

export default ProductDetail
