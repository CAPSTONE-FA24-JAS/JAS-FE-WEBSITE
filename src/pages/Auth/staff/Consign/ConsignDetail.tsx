import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Form, Modal, Select } from 'antd'
import React, { useState } from 'react'

interface ConsignDetailProps {
  isVisible: boolean
  onCancel: () => void
  onUpdate: () => void
  record: any
  status: string
  setStatus: (status: string) => void
}

const ConsignDetail: React.FC<ConsignDetailProps> = ({ isVisible, onCancel, onUpdate, record, status, setStatus }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = record?.imageValuations?.map((img: any) => img.imageLink) || [
    'https://via.placeholder.com/150?text=No+Image'
  ]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <Modal
      title='Consign Detail'
      visible={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='update' type='primary' onClick={onUpdate}>
          Update
        </Button>
      ]}
      width={900}
      bodyStyle={{ padding: '24px' }}
    >
      <div className='grid grid-cols-2 gap-6'>
        <div className='relative'>
          <div className='flex items-center justify-center mb-4'>
            <img src={images[currentImageIndex]} alt='product' className='max-w-full rounded-lg' />
          </div>
          <div className='absolute inset-y-0 left-0 flex items-center justify-center pl-3'>
            <Button icon={<LeftOutlined />} onClick={prevImage} className='bg-gray-300 hover:bg-gray-400' />
          </div>
          <div className='absolute inset-y-0 right-0 flex items-center justify-center pr-3'>
            <Button icon={<RightOutlined />} onClick={nextImage} className='bg-gray-300 hover:bg-gray-400' />
          </div>
        </div>

        <div>
          <p className='text-xl font-bold mb-2'>{record?.id}</p>
          <p className='text-xl font-bold mb-6'>{record?.name}</p>

          <p className='mb-4'>
            <strong>Customer Name:</strong> {record?.seller?.firstName} {record?.seller?.lastName}
          </p>
          <p className='mb-4'>
            <strong>Email:</strong> {record?.seller?.email}
          </p>
          <p className='mb-4'>
            <strong>Phone:</strong> {record?.seller?.phoneNumber}
          </p>
          <p className='mb-4'>
            <strong>Width:</strong> {record?.width} cm
          </p>
          <p className='mb-4'>
            <strong>Height:</strong> {record?.height} cm
          </p>
          <p className='mb-4'>
            <strong>Depth:</strong> {record?.depth} cm
          </p>
          <p className='mb-6'>
            <strong>Description:</strong> {record?.description}
          </p>

          <Form.Item label='Status' className='mt-4 font-bold'>
            <Select value={status} onChange={(value) => setStatus(value)}>
              <Select.Option value='Requested'>Requested</Select.Option>
              <Select.Option value='Preliminary Valued'>Preliminary Valued</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </div>
    </Modal>
  )
}

export default ConsignDetail
