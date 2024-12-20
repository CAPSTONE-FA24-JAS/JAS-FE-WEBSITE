import { Image, message } from 'antd'
import React, { ChangeEvent, useState } from 'react'
import { ValuationGemstoneData } from '../../../../../../../../types/Gemstones.type'
import { DeleteOutlined } from '@ant-design/icons'

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
    const numValue = parseFloat(value || '0')

    if (name === 'estimatePriceMin') {
      if (!value) {
        newErrors.estimatePriceMin = 'Please enter the minimum price'
      } else if (numValue >= max && max !== 0) {
        newErrors.estimatePriceMin = 'Minimum price must be less than maximum price'
      } else {
        newErrors.estimatePriceMin = ''
      }
    }

    if (name === 'estimatePriceMax') {
      if (!value) {
        newErrors.estimatePriceMax = 'Please enter the maximum price'
      } else if (numValue <= min && min !== 0) {
        newErrors.estimatePriceMax = 'Maximum price must be greater than minimum price'
      } else {
        newErrors.estimatePriceMax = ''
      }
    }

    if (name === 'specificPrice') {
      if (!value) {
        newErrors.specificPrice = 'Please enter the specific price'
      } else if ((numValue < min || numValue > max) && min !== 0 && max !== 0) {
        newErrors.specificPrice = 'Specific price must be within the minimum and maximum price range'
      } else {
        newErrors.specificPrice = ''
      }
    }

    setErrors(newErrors)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)

      if (selectedImages.length + filesArray.length > 4) {
        message.error('You can only upload a maximum of 4 images.')
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

  const handleRemoveImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index)
    setSelectedImages(updatedImages)
    handleImageChange(updatedImages)
  }

  return (
    <>
      <div className='grid grid-cols-2 gap-4 mt-8'>
        <div>
          <label className='block font-extrabold mb-2'>
            Estimate Price Min <span className='text-red-500'>*</span>
          </label>
          <input
            required
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
          <label className='block font-extrabold mb-2'>
            Estimate Price Max <span className='text-red-500'>*</span>
          </label>
          <input
            required
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
          <label className='block font-extrabold text-red-600 mb-2'>
            Specific Price <span className='text-red-500'>*</span>
          </label>
          <input
            required
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
                    <div key={index} className='relative'>
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded image ${index + 1}`}
                        className='object-cover rounded-lg h-30 w-20 mb-2'
                      />
                      <button
                        type='button'
                        className='absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full'
                        onClick={() => handleRemoveImage(index)}
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
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
