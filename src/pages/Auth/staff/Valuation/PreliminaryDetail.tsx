// PreliminaryValuationDetail.tsx
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
  const images = [
    'https://hoangphucphoto.com/wp-content/uploads/2023/10/anh-ts-thumb.jpg',
    'https://lavenderstudio.com.vn/wp-content/uploads/2017/10/chup-hinh-trang-suc-2.jpg',
    'https://via.placeholder.com/150/0000FF/808080?text=Image+3'
  ]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <Modal
      title={`${tab === '1' ? 'Preliminary' : 'Final'} Valuation Detail`}
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
          <p className='text-xl font-bold mb-6'>{record?.valuationName}</p>

          <p className='mb-4'>
            <strong>Customer Name:</strong> {record?.customerName}
          </p>

          {tab === '1' && (
            <>
              <p className='mb-4'>
                <strong>Initial Price:</strong> ${record?.initialPrice}
              </p>
            </>
          )}

          <Form.Item label='Status' className='mt-4'>
            <Select value={status} onChange={(value) => setStatus(value)}>
              <Select.Option value='Approve'>Approve</Select.Option>
              <Select.Option value='Reject'>Reject</Select.Option>
              <Select.Option value='Pending'>Pending</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </div>
    </Modal>
  )
}

export default PreliminaryValuationDetail
