import { useState } from 'react'
import { LotDetail } from '../../../../../types/Lot.type'

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

const convertArrayImages = (item: LotDetail): string[] => {
  const images: string[] = []

  if (item.jewelry) {
    // Add jewelry images
    if (item.jewelry.imageJewelries) {
      images.push(...item.jewelry.imageJewelries.map((img) => img.imageLink))
    }

    // Add main diamonds images
    if (item.jewelry.mainDiamonds) {
      item.jewelry.mainDiamonds.forEach((diamond) => {
        if (diamond.imageDiamonds) {
          images.push(...diamond.imageDiamonds.map((img) => img.imageLink))
        }
      })
    }

    // Add secondary diamonds images
    if (item.jewelry.secondaryDiamonds) {
      item.jewelry.secondaryDiamonds.forEach((diamond) => {
        if (diamond.imageDiamonds) {
          images.push(...diamond.imageDiamonds.map((img) => img.imageLink))
        }
      })
    }
  }

  // Filter out any undefined or null values
  return images
}

const ProductDetail: React.FC<{ item: LotDetail }> = ({ item }) => (
  <div className='p-4 bg-white rounded-lg shadow-md'>
    <div className='flex items-center justify-between mb-4'>
      <h2 className='text-2xl font-bold'>
        <strong>Lot: </strong>
        {item.id}
      </h2>
      <p className='text-lg text-gray-500'>
        Est {item.jewelry.estimatePriceMin} - {item.jewelry.estimatePriceMax}
      </p>
    </div>
    <h1 className='mb-4 text-2xl font-bold'>{item.jewelry.name}</h1>
    <h1 className='mb-4 text-2xl font-bold'>
      <strong>Type:</strong> {item.lotType}
    </h1>
    <ImageSlider images={convertArrayImages(item)} />
    <div className='mt-4 mb-4'>
      <p>
        <strong>ARTIST:</strong> {item.jewelry.artist.name}
      </p>
      <p>
        <strong>CATEGORY:</strong> {item.jewelry.category.name}
      </p>
    </div>
    <p>
      <strong>DESCRIPTION:</strong> {item.jewelry.description}
    </p>
  </div>
)

export default ProductDetail
