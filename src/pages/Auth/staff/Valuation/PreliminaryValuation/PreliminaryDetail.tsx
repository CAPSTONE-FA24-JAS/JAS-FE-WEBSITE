import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Form, Modal, Select } from 'antd'
import React, { useState } from 'react'

interface PreliminaryValuationDetailProps {
  isVisible: boolean
  onCancel: () => void
  onUpdate: () => void
  record: any
  status: string
  setStatus: (status: string) => void
  tab: string
}

const PreliminaryValuationDetail: React.FC<PreliminaryValuationDetailProps> = ({
  isVisible,
  onCancel,
  onUpdate,
  record,
  status,
  setStatus,
  tab
}) => {
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
      title='Preliminary Valuation Detail'
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='update' type='primary' onClick={onUpdate}>
          Send
        </Button>
      ]}
      width={900}
      style={{ padding: '24px' }}
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
          <p className='mb-2 text-xl font-bold'>{record?.id}</p>
          <p className='mb-6 text-xl font-bold'>{record?.name}</p>

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
            <strong>Height:</strong> {record?.height} cm
          </p>
          <p className='mb-4'>
            <strong>Width:</strong> {record?.width} cm
          </p>
          <p className='mb-4'>
            <strong>Depth:</strong> {record?.depth} cm
          </p>
          <p className='mb-6'>
            <strong>Description:</strong> {record?.description}
          </p>
          <p className='mb-4'>
            <strong>Preliminary Price:</strong>{' '}
            <span className='font-bold text-red-800'> {record?.desiredPrice} VND</span>
          </p>

          <Form.Item label='Status' className='mt-4 font-bold'>
            <Select value={status} onChange={(value) => setStatus(value)}>
              <Select.Option value='Approve'>Approve</Select.Option>
              <Select.Option value='Reject'>Reject</Select.Option>
              <Select.Option value='Pending'>Pending</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </div>
      <div className='mt-6'>
        <p className='italic text-blue-500'>Receipt Link</p>
      </div>
      {/* Note Section */}
      <div className='mt-6'>
        <p className='italic font-bold text-red-500'>
          Note: If customers accept this price, please send jewelry to the address below.
        </p>
        <p className='italic font-bold text-red-500'>
          S10.05(VHGP), Nguyen Xien Street, Long Binh Ward, Thu Duc District, Ho Chi Minh City
        </p>
      </div>
    </Modal>
  )
}

export default PreliminaryValuationDetail
