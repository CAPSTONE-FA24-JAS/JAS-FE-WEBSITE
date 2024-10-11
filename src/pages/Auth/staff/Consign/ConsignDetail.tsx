import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Modal, notification } from 'antd'
import React, { useState } from 'react'
import { useUpdatePreliminaryValuationStatusMutation } from '../../../../services/valuation.services'

interface ConsignDetailProps {
  isVisible: boolean
  onCancel: () => void
  record: any
  status: string
  setStatus: (status: string) => void
  refetch: () => void
}

const ConsignDetail: React.FC<ConsignDetailProps> = ({ isVisible, onCancel, record, setStatus, refetch }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [updateStatus] = useUpdatePreliminaryValuationStatusMutation() // Use the mutation

  const images = record?.imageValuations?.map((img: any) => img.imageLink) || [
    'https://via.placeholder.com/150?text=No+Image'
  ]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleUpdateStatus = async () => {
    try {
      const response = await updateStatus({ id: record.id, status: 2 }).unwrap()
      notification.success({
        message: 'Has sent a request for appraisal!'
      })
      setStatus('Requested')
      refetch()
    } catch (error) {
      notification.error({
        message: 'Status Update Failed'
      })
    }
  }

  return (
    <Modal
      title='Consign Detail'
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='update' type='primary' onClick={handleUpdateStatus}>
          Request
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
          <div className='mb-4 flex'>
            <strong className='w-1/3'>Customer Name:</strong>
            <span className=' font-semibold'>
              {record?.seller?.firstName} {record?.seller?.lastName}
            </span>
          </div>
          <div className='mb-4 flex'>
            <strong className='w-1/3'>Email:</strong>
            <span className=' font-semibold'>{record?.seller?.accountDTO.email}</span>
          </div>
          <div className='mb-4 flex'>
            <strong className='w-1/3'>Phone:</strong>
            <span className=' font-semibold'>{record?.seller?.phoneNumber}</span>
          </div>
          <div className='mb-4 flex'>
            <strong className='w-1/3'>Width:</strong>
            <span className=' font-semibold'>{record?.width} cm</span>
          </div>
          <div className='mb-4 flex'>
            <strong className='w-1/3'>Height:</strong>
            <span className=' font-semibold'>{record?.height} cm</span>
          </div>
          <div className='mb-4 flex'>
            <strong className='w-1/3'>Depth:</strong>
            <span className=' font-semibold'>{record?.depth} cm</span>
          </div>
          <div className='mb-6 flex'>
            <strong className='w-1/3'>Description:</strong>
            <span className=' font-semibold'>{record?.description}</span>
          </div>
          <div className='mt-4 flex'>
            <strong className='w-1/3'>Status:</strong>
            <span className='text-red-600 font-semibold'>{record?.status}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ConsignDetail
