import React from 'react'
import { Input, Spin, Alert, Select } from 'antd'
import {
  useGetKeyCharacteristicsQuery,
  useGetCategoriesQuery,
  useGetArtistQuery
} from '../../../../../../../../services/createfinalvaluation.services'

const { Option } = Select
interface KeyCharacteristicDetail {
  keyCharacteristicId: number
  description: string
}

interface BasicInfoProps {
  formData: any // Adjust the type accordingly
  handleFormChange: (name: string, value: any) => void // Update the type to accept name and value
}

const BasicInfoStep: React.FC<BasicInfoProps> = ({ formData, handleFormChange }) => {
  const {
    data: keyCharacteristicsData,
    error: keyCharacteristicsError,
    isLoading: isLoadingKeyCharacteristics
  } = useGetKeyCharacteristicsQuery()
  const { data: categoriesData, error: categoriesError, isLoading: isLoadingCategories } = useGetCategoriesQuery()
  const { data: artistsData, error: artistsError, isLoading: isLoadingArtists } = useGetArtistQuery()

  // Check if loading key characteristics
  if (isLoadingKeyCharacteristics) {
    return (
      <div className='flex justify-center items-center'>
        <Spin tip='Loading key characteristics...' />
      </div>
    )
  }

  if (keyCharacteristicsError) {
    return <Alert message='Error loading key characteristics.' type='error' />
  }

  const keyCharacteristics = keyCharacteristicsData?.data || []
  const categories = categoriesData?.data || []
  const artists = artistsData?.data || []

  if (isLoadingCategories) {
    return (
      <div className='flex justify-center items-center'>
        <Spin tip='Loading categories...' />
      </div>
    )
  }

  if (categoriesError) {
    return <Alert message='Error loading categories.' type='error' />
  }

  if (isLoadingArtists) {
    return (
      <div className='flex justify-center items-center'>
        <Spin tip='Loading artists...' />
      </div>
    )
  }

  if (artistsError) {
    return <Alert message='Error loading artists.' type='error' />
  }

  return (
    <div className='grid grid-cols-2 gap-4'>
      {Object.keys(formData).map((key) => {
        if (key === 'categoryId') {
          return (
            <div key={key}>
              <label className='block font-bold mb-2'>Category</label>
              <Select
                value={formData[key]}
                onChange={(value) => handleFormChange(key, value)}
                className='w-full h-10'
                placeholder='Select a category'
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </div>
          )
        }

        if (key === 'artistId') {
          return (
            <div key={key}>
              <label className='block font-bold mb-2'>Artist</label>
              <Select
                value={formData[key]}
                onChange={(value) => handleFormChange(key, value)} // Call handleFormChange with key and value
                className='w-full h-10 '
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

        // Render the Key Characteristics fields
        if (key === 'keyCharacteristicDetails') {
          return (
            <div key={key} className='col-span-2'>
              <label className='block font-bold mb-2'>Key Characteristics</label>
              <div className='grid grid-cols-2 gap-4'>
                {keyCharacteristics.length > 0 ? (
                  keyCharacteristics.map((characteristic) => {
                    // Tìm đối tượng keyCharacteristic trong formData hoặc tạo đối tượng mới nếu chưa có
                    const characteristicData: KeyCharacteristicDetail = formData.keyCharacteristicDetails.find(
                      (item: KeyCharacteristicDetail) => item.keyCharacteristicId === characteristic.id
                    ) || { keyCharacteristicId: characteristic.id, description: '' }

                    return (
                      <div key={characteristic.id} className='mb-4'>
                        <label className='block font-medium mb-1'>{characteristic.name}</label>
                        <Input
                          name={`keyCharacteristic_${characteristic.id}`}
                          value={characteristicData.description || ''}
                          onChange={(e) => {
                            const updatedKeyCharacteristicDetails = formData.keyCharacteristicDetails.map(
                              (item: KeyCharacteristicDetail) =>
                                item.keyCharacteristicId === characteristic.id
                                  ? { ...item, description: e.target.value }
                                  : item
                            )

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
                          className='w-full border border-gray-300 p-2 rounded'
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
            <label className='block font-bold mb-2'>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.charAt(0).toUpperCase() + str.slice(1))}
            </label>
            <Input
              type={key === 'weight' ? 'number' : 'text'}
              name={key}
              value={formData[key]}
              onChange={(e) => handleFormChange(e.target.name, e.target.value)}
              className='w-full border border-gray-300 p-2 rounded'
              placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            />
          </div>
        )
      })}
    </div>
  )
}

export default BasicInfoStep
