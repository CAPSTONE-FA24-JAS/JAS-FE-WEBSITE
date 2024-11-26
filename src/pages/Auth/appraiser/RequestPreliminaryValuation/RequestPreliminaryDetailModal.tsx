import React, { useState } from 'react'
import { Modal, Button } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

interface ValuationDetailsModalProps {
  visible: boolean
  onCancel: () => void
  onUpdate: () => void
  record: any // You may want to define a more specific type here
}

const ValuationDetailsModal: React.FC<ValuationDetailsModalProps> = ({ visible, onCancel, record }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // const handleUpdate = () => {
  //   notification.success({
  //     message: 'Update Successful',
  //     description: 'Valuation details have been updated successfully.'
  //   })
  //   onUpdate() // Call onUpdate to close modal
  // }

  const images = record?.imageValuations?.map((image: any) => image.imageLink) || []

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <Modal
      title='Valuation Details'
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      style={{ padding: '24px' }}
    >
      <div className='grid grid-cols-2 gap-6'>
        <div className='relative'>
          <div className='flex items-center justify-center mb-4'>
            {images.length > 0 ? (
              <img src={images[currentImageIndex]} alt='Valuation Item' className='max-w-full rounded-lg' />
            ) : (
              <p>No images available</p>
            )}
          </div>
          <div className='absolute inset-y-0 left-0 flex items-center justify-center pl-3'>
            <Button icon={<LeftOutlined />} onClick={prevImage} className='bg-gray-300 hover:bg-gray-400' />
          </div>
          <div className='absolute inset-y-0 right-0 flex items-center justify-center pr-3'>
            <Button icon={<RightOutlined />} onClick={nextImage} className='bg-gray-300 hover:bg-gray-400' />
          </div>
        </div>

        <div>
          <p className='mb-2 text-xl font-bold'>{record?.id}</p>
          <p className='mb-6 text-xl font-bold'>{record?.name}</p>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Customer Name:</strong>
            <span className='font-semibold '>
              {record?.seller?.firstName} {record?.seller?.lastName}
            </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Email:</strong>
            <span className='font-semibold '>{record?.seller?.accountDTO.email}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Phone:</strong>
            <span className='font-semibold '>{record?.seller?.accountDTO.phoneNumber}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Width:</strong>
            <span className='font-semibold '>{record?.width} cm</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Height:</strong>
            <span className='font-semibold '>{record?.height} cm</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Depth:</strong>
            <span className='font-semibold '>{record?.depth} cm</span>
          </div>
          <div className='flex mb-6'>
            <strong className='w-1/3'>Description:</strong>
            <span className='font-semibold '>{record?.description}</span>
          </div>
          <div className='flex mt-4'>
            <strong className='w-1/3'>Status:</strong>
            <span className='font-semibold text-red-600'>{record?.status}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ValuationDetailsModal
