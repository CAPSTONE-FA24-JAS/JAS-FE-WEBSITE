import { Image, message } from 'antd'
import React, { ChangeEvent, useState } from 'react'
import { ValuationGemstoneData } from '../../../../../../../../types/Gemstones.type'

interface FinalStepsProps {
  formDataPrice: ValuationGemstoneData
  handleImageChange: (files: File[]) => void
  handleFormChange: (name: string, value: string) => void
}

const FinalStepsStep: React.FC<FinalStepsProps> = ({ formDataPrice, handleImageChange, handleFormChange }) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [errors, setErrors] = useState({
    estimatePriceMin: '',
    estimatePriceMax: '',
    specificPrice: ''
  })

  const handleValidation = (name: string, value: string) => {
    let newErrors = { ...errors }
    const min = parseFloat(formDataPrice.estimatePriceMin.toString() || '0')
    const max = parseFloat(formDataPrice.estimatePriceMax.toString() || '0')
    // const specific = parseFloat(formDataPrice.specificPrice.toString() || '0')
    const numValue = parseFloat(value || '0')

    if (name === 'estimatePriceMin' && numValue >= max) {
      newErrors.estimatePriceMin = 'Minimum price must be less than the maximum price.'
    } else {
      newErrors.estimatePriceMin = ''
    }

    if (name === 'estimatePriceMax' && numValue <= min) {
      newErrors.estimatePriceMax = 'Maximum price must be greater than the minimum price.'
    } else {
      newErrors.estimatePriceMax = ''
    }

    if (name === 'specificPrice' && (numValue < min || numValue > max)) {
      newErrors.specificPrice = 'Specific price must be between the minimum and maximum price.'
    } else {
      newErrors.specificPrice = ''
    }

    setErrors(newErrors)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)

      if (selectedImages.length + filesArray.length > 5) {
        message.error('You can only upload a maximum of 5 images.')
        return
      }

      const updatedImages = [...selectedImages, ...filesArray]
      setSelectedImages(updatedImages)
      handleImageChange(updatedImages)
    }
  }

  const handleInputChange = (name: string, value: string) => {
    handleValidation(name, value)
    handleFormChange(name, value)
  }

  return (
    <>
      <div className='grid grid-cols-2 gap-4 mt-8'>
        <div>
          <label className='block font-extrabold mb-2'>Estimate Price Min</label>
          <input
            type='number'
            name='estimatePriceMin'
            value={formDataPrice.estimatePriceMin > 0 ? formDataPrice.estimatePriceMin : ''}
            onChange={(e) => handleInputChange('estimatePriceMin', e.target.value)}
            min={0}
            className={`w-full border ${
              errors.estimatePriceMin ? 'border-red-500' : 'border-gray-300'
            } p-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
            placeholder='Enter minimum estimated price'
          />
          {errors.estimatePriceMin && <span className='text-red-500 text-sm'>{errors.estimatePriceMin}</span>}
        </div>
        <div>
          <label className='block font-extrabold mb-2'>Estimate Price Max</label>
          <input
            type='number'
            name='estimatePriceMax'
            value={formDataPrice.estimatePriceMax > 0 ? formDataPrice.estimatePriceMax : ''}
            onChange={(e) => handleInputChange('estimatePriceMax', e.target.value)}
            min={0}
            className={`w-full border ${
              errors.estimatePriceMax ? 'border-red-500' : 'border-gray-300'
            } p-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
            placeholder='Enter maximum estimated price'
          />
          {errors.estimatePriceMax && <span className='text-red-500 text-sm'>{errors.estimatePriceMax}</span>}
        </div>
        <div>
          <label className='block font-extrabold text-red-600 mb-2'>Specific Price</label>
          <input
            type='number'
            name='specificPrice'
            value={formDataPrice.specificPrice > 0 ? formDataPrice.specificPrice : ''}
            onChange={(e) => handleInputChange('specificPrice', e.target.value)}
            min={0}
            className={`w-full border ${
              errors.specificPrice ? 'border-red-500' : 'border-gray-300'
            } p-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
            placeholder='Enter specific price'
          />
          {errors.specificPrice && <span className='text-red-500 text-sm'>{errors.specificPrice}</span>}
        </div>
      </div>

      <div className='mt-8'>
        <div>
          <label className='block font-extrabold mb-4'>Upload Images</label>
          <div className='grid grid-cols-4 gap-4 items-center'>
            {selectedImages.length > 0 && (
              <div className='mb-4 col-span-4'>
                <div className='grid grid-cols-4 gap-4'>
                  {selectedImages.map((file, index) => (
                    <Image
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded image ${index + 1}`}
                      className='object-cover rounded-lg h-30 w-20 mb-2'
                    />
                  ))}
                </div>
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
