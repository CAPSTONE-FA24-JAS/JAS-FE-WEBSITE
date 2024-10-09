import React, { useState } from 'react'
import { Upload, Button, Image } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Gemstone from './Gemstone'

interface FormData {
  customerName: string
  jewelryName: string
  category: string
  metal: string
  weight: string
  condition: string
  measurements: string
  size: string
  totalReplacementCost: string // New field
  image: File | null // Field for uploaded image
}

interface GemstoneData {
  type: 'Diamond' | 'Sapphire'
  shape: string
  cut: string
  quantity: string
  totalCaratColor: string
  color: string
  dimensions: string
  settingType: string
  clarity: string
  enhancementType: string
  carat: string
  isVisible: boolean
}

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export default function CreateFinalValuation() {
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    jewelryName: '',
    category: '',
    metal: '',
    weight: '',
    condition: '',
    measurements: '',
    size: '',
    totalReplacementCost: '', // Initialize new field
    image: null // Initialize image field
  })

  const [gemstoneDataArray, setGemstoneDataArray] = useState<GemstoneData[]>([
    {
      type: 'Diamond',
      shape: '',
      cut: '',
      quantity: '',
      totalCaratColor: '',
      color: '',
      dimensions: '',
      settingType: '',
      clarity: '',
      enhancementType: '',
      carat: '',
      isVisible: false
    }
  ])

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleGemstoneChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newGemstoneDataArray = [...gemstoneDataArray]
    newGemstoneDataArray[index] = {
      ...newGemstoneDataArray[index],
      [e.target.name]: e.target.value
    }
    setGemstoneDataArray(newGemstoneDataArray)
  }

  const handleGemstoneTypeChange = (type: 'Diamond' | 'Sapphire', index: number) => {
    const newGemstoneDataArray = [...gemstoneDataArray]
    newGemstoneDataArray[index].type = type
    setGemstoneDataArray(newGemstoneDataArray)
  }

  const handleAddGemstone = () => {
    setGemstoneDataArray([
      ...gemstoneDataArray,
      {
        type: 'Diamond',
        shape: '',
        cut: '',
        quantity: '',
        totalCaratColor: '',
        color: '',
        dimensions: '',
        settingType: '',
        clarity: '',
        enhancementType: '',
        carat: '',
        isVisible: false
      }
    ])
  }

  const toggleGemstoneVisibility = (index: number) => {
    const newGemstoneDataArray = [...gemstoneDataArray]
    newGemstoneDataArray[index].isVisible = !newGemstoneDataArray[index].isVisible
    setGemstoneDataArray(newGemstoneDataArray)
  }

  const handleImageChange = async (info: any) => {
    if (info.file.status === 'done') {
      const base64 = await getBase64(info.file.originFileObj as File)
      setFormData({ ...formData, image: info.file.originFileObj }) // Store the image file
      setPreviewImage(base64) // Set the preview image
      setPreviewOpen(true) // Open preview
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form Data:', formData)
    if (formData.image) {
      console.log('Uploaded Image:', formData.image)
    }
    console.log('Gemstone Data:', gemstoneDataArray)
  }

  return (
    <div className='max-w-6xl mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-6'>Final Valuation Form</h2>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-2 gap-4'>
          {Object.keys(formData).map((key) => {
            if (key === 'totalReplacementCost' || key === 'image') return null
            return (
              <div key={key}>
                <label className='block font-medium mb-1'>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </label>
                <input
                  type={key === 'weight' ? 'number' : 'text'}
                  name={key}
                  // value={formData[key as keyof FormData]}
                  onChange={handleFormChange}
                  className='w-full border border-gray-300 p-2 rounded'
                  placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                />
              </div>
            )
          })}
        </div>

        <div className='mt-8'>
          <div className='mt-8 mb-4 flex justify-between items-center'>
            <h3 className='text-xl font-semibold mb-0'>Gemstone Details</h3>
            <button type='button' onClick={handleAddGemstone} className='bg-gray-300 text-black px-4 py-2 rounded'>
              Add Gemstone Details
            </button>
          </div>

          {gemstoneDataArray.map((gemstoneData, index) => (
            <div key={index} className='border p-4 mb-4 rounded'>
              <div className='flex justify-between items-center'>
                <h4 className='text-lg font-semibold'>Gemstone {index + 1}</h4>
                <button
                  type='button'
                  onClick={() => toggleGemstoneVisibility(index)}
                  className='text-black px-2 py-1 flex items-center justify-center relative'
                  style={{ width: '40px', height: '40px' }}
                >
                  <span
                    className={`block border-l-2 border-b-2 ${
                      gemstoneData.isVisible ? 'transform rotate-45' : 'transform -rotate-45'
                    } transition-transform duration-300`}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderColor: 'black',
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      marginLeft: '-5px',
                      marginTop: '-5px'
                    }}
                  />
                </button>
              </div>

              {gemstoneData.isVisible && (
                <Gemstone
                  gemstoneType={gemstoneData.type}
                  setGemstoneType={(type) => handleGemstoneTypeChange(type, index)}
                  showGemstoneDetails={gemstoneData.isVisible}
                  handleGemstoneChange={(e) => handleGemstoneChange(e, index)}
                  gemstoneData={gemstoneData}
                />
              )}
            </div>
          ))}
        </div>

        {/* Total Estimated Retail Replacement Cost Field */}
        <div className='grid grid-cols-2 gap-4 mt-8'>
          <div>
            <label className='block font-medium mb-1 text-red-600'>Total Estimated Retail Replacement Cost</label>
            <input
              type='number'
              name='totalReplacementCost'
              value={formData.totalReplacementCost}
              onChange={handleFormChange}
              min={0} // Set minimum value to 0
              className='w-full border border-gray-300 p-2 rounded'
              placeholder='Enter total estimated retail replacement cost'
            />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4 mt-8'>
          <div>
            <label className='block font-medium mb-1'>Upload Image</label>
            <Upload
              accept='image/*'
              listType='picture-card'
              onChange={handleImageChange}
              showUploadList={false} // Hides the default upload list
            >
              <Button icon={<PlusOutlined />}></Button>
            </Upload>
          </div>
        </div>

        {/* Preview Modal for Uploaded Image */}
        <Image.PreviewGroup>
          <Image
            preview={previewOpen}
            src={previewImage}
            onPreviewClose={() => setPreviewOpen(false)}
            width={200}
            style={{ display: previewOpen ? 'block' : 'none' }} // Show image only when preview is open
          />
        </Image.PreviewGroup>
        <div className='mt-8'>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </div>
      </form>

      {/* Upload Image Field using Ant Design Upload component */}
    </div>
  )
}
