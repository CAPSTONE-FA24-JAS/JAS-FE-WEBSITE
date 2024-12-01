import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Modal, notification } from 'antd'
import React, { useState } from 'react'
import { useUpdatePreliminaryValuationStatusMutation } from '../../../../services/valuation.services'

// Định nghĩa interface cho ImageValuation
interface ImageValuation {
  imageLink: string
}

// Định nghĩa interface cho Seller
interface Seller {
  firstName: string
  lastName: string
  accountDTO: {
    email: string
    phoneNumber: string
  }
}

// Định nghĩa interface cho Record
interface Record {
  id: number
  name: string
  seller: Seller
  width: number
  height: number
  depth: number
  description: string
  status: string | number
  imageValuations: ImageValuation[]
}

// Sử dụng interface Record trong ConsignDetailProps
interface ConsignDetailProps {
  isVisible: boolean
  onCancel: () => void
  record: Record | null
  status: string
  setStatus: (status: string) => void
  refetch: () => void
}

const ConsignDetail: React.FC<ConsignDetailProps> = ({ isVisible, onCancel, record, setStatus, refetch }) => {
  if (!record) {
    return null
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [updateStatus] = useUpdatePreliminaryValuationStatusMutation() // Use the mutation
  const [isLoading, setIsLoading] = useState(false) // Thêm state để quản lý loading

  const images = record?.imageValuations?.map((img: ImageValuation) => img.imageLink) || [
    'https://via.placeholder.com/150?text=No+Image'
  ]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleUpdateStatus = async () => {
    setIsLoading(true) // Bắt đầu loading
    try {
      await updateStatus({ id: record.id, status: 2 }).unwrap()
      notification.success({
        message: 'Has sent a request for appraisal!'
      })
      setStatus('Requested')
      refetch() // Gọi refetch để cập nhật lại bảng
      onCancel() // Đóng modal sau khi cập nhật thành công
    } catch (error) {
      notification.error({
        message: 'Status Update Failed'
      })
    } finally {
      setIsLoading(false)
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
        <Button key='update' type='primary' onClick={handleUpdateStatus} loading={isLoading}>
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

export default ConsignDetail
