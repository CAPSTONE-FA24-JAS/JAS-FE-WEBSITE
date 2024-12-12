import { Alert, Select, Spin } from 'antd'
import React, { useState } from 'react'
import {
  useGetArtistQuery,
  useGetCategoriesQuery,
  useGetKeyCharacteristicsQuery
} from '../../../../../../../../services/createfinalvaluation.services'

const { Option } = Select

interface KeyCharacteristicDetail {
  id: number
  jewelryId: number
  description: string
  keyCharacteristicId: number
  keyCharacteristic: KeyCharacteristic[]
}
export interface KeyCharacteristic {
  id: number
  name: string
}

interface BasicInfoProps {
  formData: any
  handleFormChange: (name: string, value: any) => void
}

interface ErrorState {
  [key: string]: boolean
}

const BasicInfoStep: React.FC<BasicInfoProps> = ({ formData, handleFormChange }) => {
  const {
    data: keyCharacteristicsData,
    error: keyCharacteristicsError,
    isLoading: isLoadingKeyCharacteristics
  } = useGetKeyCharacteristicsQuery()

  const { data: categoriesData, error: categoriesError, isLoading: isLoadingCategories } = useGetCategoriesQuery()

  const { data: artistsData, error: artistsError, isLoading: isLoadingArtists } = useGetArtistQuery()

  const [errors, setErrors] = useState<ErrorState>({
    name: false,
    categoryId: false,
    forGender: false,
    artistId: false,
    condition: false,
    measurements: false,
    weight: false,
    metal: false
  })

  const validateField = (key: string, value: any) => {
    if (key === 'categoryId' || key === 'artistId') {
      return value > 0
    }
    return value && value.toString().trim() !== ''
  }

  if (isLoadingKeyCharacteristics || isLoadingCategories || isLoadingArtists) {
    return (
      <div className='flex justify-center items-center'>
        <Spin tip='Loading data...' />
      </div>
    )
  }

  if (keyCharacteristicsError) {
    return <Alert message='Error loading key characteristics.' type='error' />
  }

  if (categoriesError) {
    return <Alert message='Error loading categories.' type='error' />
  }

  if (artistsError) {
    return <Alert message='Error loading artists.' type='error' />
  }

  const keyCharacteristics = keyCharacteristicsData?.data || []
  const categories = categoriesData?.data || []
  const artists = artistsData?.data || []

  return (
    <div className='grid grid-cols-2 gap-4'>
      {Object.keys(formData).map((key) => {
        if (
          key === 'imageJewelries' ||
          key === 'specificPrice' ||
          key === 'estimatePriceMax' ||
          key === 'estimatePriceMin' ||
          key === 'mainDiamonds' ||
          key === 'secondaryDiamonds' ||
          key === 'mainShaphies' ||
          key === 'secondaryShaphies' ||
          key === 'valuationId'
        )
          return null

        if (key === 'categoryId') {
          return (
            <div key={key}>
              <label className='block font-extrabold text-red-600 mb-2'>
                Category <span className='text-red-500'>*</span>
              </label>
              <Select
                value={formData[key] > 0 ? formData[key] : undefined}
                onChange={(value) => {
                  handleFormChange(key, value)
                  setErrors((prev) => ({ ...prev, [key]: !validateField(key, value) }))
                }}
                className={`w-full h-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                  errors[key] ? 'border-red-500' : ''
                }`}
                placeholder='Select a category'
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
              {errors[key] && <span className='text-red-500 text-sm'>Trường này là bắt buộc</span>}
            </div>
          )
        }

        if (key === 'artistId') {
          return (
            <div key={key}>
              <label className='block font-extrabold text-red-600 mb-2'>Artist</label>
              <Select
                value={formData[key] > 0 ? formData[key] : undefined}
                onChange={(value) => {
                  handleFormChange(key, value)
                  setErrors((prev) => ({ ...prev, [key]: !validateField(key, value) }))
                }}
                className={`w-full h-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                  errors[key] ? 'border-red-500' : ''
                }`}
                placeholder='Select an artist'
              >
                {artists.map((artist) => (
                  <Option key={artist.id} value={artist.id}>
                    {artist.name}
                  </Option>
                ))}
              </Select>
            </div>
          )
        }

        if (key === 'name') {
          return (
            <div key={key}>
              <label className='block font-extrabold text-red-600 mb-2'>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.charAt(0).toUpperCase() + str.slice(1))}
                <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name={key}
                value={formData[key]}
                onChange={(e) => {
                  handleFormChange(e.target.name, e.target.value)
                  setErrors((prev) => ({ ...prev, [key]: !validateField(key, e.target.value) }))
                }}
                className={`w-full border border-gray-300 p-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                  errors[key] ? 'border-red-500' : ''
                }`}
                placeholder={`Enter ${key.replace(/([A-Z])/g, ' ').toLowerCase()}`}
              />
              {errors[key] && <span className='text-red-500 text-sm'>Trường này là bắt buộc</span>}
            </div>
          )
        }

        if (key === 'keyCharacteristicDetails') {
          return (
            <div key={key} className='col-span-2'>
              <label className='block font-extrabold text-red-600 mb-4'>Key Characteristics</label>
              <div className='grid grid-cols-2 gap-4'>
                {keyCharacteristics.length > 0 ? (
                  keyCharacteristics.map((characteristic) => {
                    const characteristicData: KeyCharacteristicDetail = formData.keyCharacteristicDetails.find(
                      (item: KeyCharacteristicDetail) => item.keyCharacteristicId === characteristic.id
                    ) || { keyCharacteristicId: characteristic.id, description: '' }

                    const isRequired = [4, 5, 7, 8].includes(characteristic.id)

                    return (
                      <div key={characteristic.id} className='mb-4'>
                        <label className='block font-medium mb-1'>
                          {characteristic.name} {isRequired && <span className='text-red-500'>*</span>}
                        </label>
                        <input
                          name={`keyCharacteristic_${characteristic.id}`}
                          value={characteristicData.description || ''}
                          onChange={(e) => {
                            const updatedKeyCharacteristicDetails = formData.keyCharacteristicDetails
                              .filter((item: KeyCharacteristicDetail) => item.keyCharacteristicId !== 0)
                              .map((item: KeyCharacteristicDetail) =>
                                item.keyCharacteristicId === characteristic.id
                                  ? { ...item, description: e.target.value }
                                  : item
                              )

                            // Nếu không tìm thấy đặc điểm, thêm vào danh sách
                            if (
                              !updatedKeyCharacteristicDetails.some(
                                (item: KeyCharacteristicDetail) => item.keyCharacteristicId === characteristic.id
                              )
                            ) {
                              updatedKeyCharacteristicDetails.push({
                                keyCharacteristicId: characteristic.id,
                                description: e.target.value
                              })
                            }

                            handleFormChange('keyCharacteristicDetails', updatedKeyCharacteristicDetails)
                          }}
                          placeholder={`Enter ${characteristic.name.toLowerCase()}`}
                          className='w-full border border-gray-300 p-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 custom-input-placeholder'
                        />
                      </div>
                    )
                  })
                ) : (
                  <Alert message='No key characteristics found.' type='info' />
                )}
              </div>
            </div>
          )
        }

        return (
          <div key={key}>
            <label className='block font-extrabold text-red-600 mb-2'>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.charAt(0).toUpperCase() + str.slice(1))}
              {(key === 'condition' || key === 'measurements' || key === 'weight' || key === 'metal') && (
                <span className='text-red-500'>*</span>
              )}
            </label>
            <input
              type={key === 'weight' ? 'number' : 'text'}
              name={key}
              value={formData[key]}
              onChange={(e) => {
                handleFormChange(e.target.name, e.target.value)
                if (key === 'condition' || key === 'measurements' || key === 'weight' || key === 'metal') {
                  setErrors((prev) => ({ ...prev, [key]: !validateField(key, e.target.value) }))
                }
              }}
              className={`w-full border border-gray-300 p-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 custom-input-placeholder ${
                errors[key] ? 'border-red-500' : ''
              }`}
              placeholder={`Enter ${key.replace(/([A-Z])/g, ' ').toLowerCase()}`}
            />
            {errors[key] && <span className='text-red-500 text-sm'>Trường này là bắt buộc</span>}
          </div>
        )
      })}
    </div>
  )
}

export default BasicInfoStep
