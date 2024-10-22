import React, { useState } from 'react'
import { Button, Modal, Select, notification } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useUpdateJewelryStatusByManagerMutation } from '../../../../services/valuation.services'

const { Option } = Select

interface RequestFinalDetailProps {
  isVisible: boolean
  onCancel: () => void
  onUpdate: () => void
  record: any
  setStatus: (status: string) => void
  refetch: () => void // Add refetch function to props
}

const RequestFinalDetail: React.FC<RequestFinalDetailProps> = ({
  isVisible,
  onCancel,
  onUpdate,
  record,
  setStatus,
  refetch
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedStatus, setSelectedStatus] = useState<string>(record?.status || '') // Initialize with an empty string
  const images = record?.imageValuations?.map((img: any) => img.imageLink) || [
    'https://via.placeholder.com/150?text=No+Image'
  ]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }
  const statusOptions = [
    { label: 'Final Valuated', value: 'FinalValuated' },
    { label: 'Manager Approved', value: 'ManagerApproved' }
  ]

  const [updateStatus, { isLoading }] = useUpdateJewelryStatusByManagerMutation()

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
  }

  const handleUpdateClick = async () => {
    if (!selectedStatus) {
      notification.error({
        message: 'Update Failed',
        description: 'Please select a valid status before updating.'
      })
      return
    }
    try {
      await updateStatus({ jewelryId: record?.jewelry?.id, status: 7 }).unwrap()
      notification.success({
        message: 'Status Updated',
        description: `The status has been updated to ${selectedStatus}`
      })
      setStatus(selectedStatus)
      onUpdate()
      refetch()
    } catch (error) {
      notification.error({
        message: 'Update Failed',
        description: 'There was an error updating the status.'
      })
    }
  }

  return (
    <Modal
      title='Request Final Valuation Details'
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='update' type='primary' onClick={handleUpdateClick} loading={isLoading}>
          Update
        </Button>
      ]}
      width={1100}
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
          <p className='mb-6 text-xl font-bold'>{record?.jewelry?.name}</p>

          <div className='flex mb-4'>
            <strong className='w-1/3'>Customer Name:</strong>
            <span>
              {record?.seller?.firstName} {record?.seller?.lastName}
            </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Email:</strong>
            <span>{record?.seller?.accountDTO.email}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Phone:</strong>
            <span>{record?.seller?.accountDTO.phoneNumber}</span>
          </div>

          <div className='flex mb-4'>
            <strong className='w-1/3'>Estimated Price:</strong>
            <span>
              {record?.jewelry?.estimatePriceMin} - {record?.jewelry?.estimatePriceMax} VND
            </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Starting Price:</strong>
            <span>{record?.jewelry?.startingPrice} VND</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Artist:</strong>
            <span>{record?.jewelry?.artist?.name}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Category:</strong>
            <span>{record?.jewelry?.category?.name}</span>
          </div>

          <div className='flex mb-4'>
            <strong className='w-1/3'>Final Price:</strong>
            <span>{record?.jewelry?.specificPrice} VND</span>
          </div>

          <div className='mt-4 flex'>
            <strong className='w-1/3'>Status:</strong>
            {record?.status === 'FinalValuated' ? (
              <Select value={selectedStatus} onChange={handleStatusChange} style={{ width: 200 }}>
                {statusOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            ) : (
              <span className='font-semibold text-red-600 '>{record?.status}</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default RequestFinalDetail
