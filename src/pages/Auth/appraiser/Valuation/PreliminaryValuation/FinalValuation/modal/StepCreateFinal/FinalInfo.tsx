import React, { ChangeEvent, useState } from 'react'
import { Image } from 'antd'

interface FinalStepsProps {
  formDataPrice: any
  handleImageChange: (files: File[]) => void
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FinalStepsStep: React.FC<FinalStepsProps> = ({ formDataPrice, handleFormChange, handleImageChange }) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedImages(filesArray)
      handleImageChange(filesArray)
    }
  }

  return (
    <>
      <div className='grid grid-cols-2 gap-4 mt-8'>
        <div>
          <label className='block font-medium mb-1'>Estimate Price Min</label>
          <input
            type='number'
            name='estimatePriceMin'
            value={formDataPrice.estimatePriceMin}
            onChange={handleFormChange}
            min={0}
            className='w-full border border-gray-300 p-2 rounded'
            placeholder='Enter minimum estimated price'
          />
        </div>
        <div>
          <label className='block font-medium mb-1'>Estimate Price Max</label>
          <input
            type='number'
            name='estimatePriceMax'
            value={formDataPrice.estimatePriceMax}
            onChange={handleFormChange}
            min={0}
            className='w-full border border-gray-300 p-2 rounded'
            placeholder='Enter maximum estimated price'
          />
        </div>
        <div>
          <label className='block font-medium text-red-600 mb-1'>Specific Price</label>
          <input
            type='number'
            name='specificPrice'
            value={formDataPrice.specificPrice}
            onChange={handleFormChange}
            min={0}
            className='w-full border border-gray-300 p-2 rounded'
            placeholder='Enter specific price'
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 mt-8'>
        <div>
          <label className='block font-medium mb-1'>Upload Images</label>
          <div className='flex flex-col items-center col-span-1'>
            {selectedImages.length > 0 && (
              <div className='mb-4'>
                {selectedImages.map((file, index) => (
                  <Image
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Uploaded image ${index + 1}`}
                    className='object-cover rounded-lg h-60 w-60 mb-2'
                  />
                ))}
              </div>
            )}
            <button
              type='button'
              className='p-2 text-sm font-bold text-gray-600 rounded-lg hover:text-blue-600 bg-slate-400'
              onClick={() => document.getElementById('img')?.click()}
            >
              Upload Images
            </button>
            <input
              type='file'
              id='img'
              name='img'
              accept='image/*'
              multiple
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default FinalStepsStep
