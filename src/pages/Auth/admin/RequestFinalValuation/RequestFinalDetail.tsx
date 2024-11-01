import React, { useState } from 'react'
import { Button, Modal, Select, notification, Spin } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import {
  useUpdateJewelryStatusByManagerMutation,
  useGetValuationByIdQuery
} from '../../../../services/valuation.services'

const { Option } = Select

interface RequestFinalDetailProps {
  recordId: number
  isVisible: boolean
  onClose: () => void
  setStatus: (status: string) => void
  refetch: () => void
}

const RequestFinalDetail: React.FC<RequestFinalDetailProps> = ({
  recordId,
  isVisible,
  onClose,
  setStatus,
  refetch
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  const {
    data: valuationData,
    isLoading: valuationLoading,
    error: valuationError
  } = useGetValuationByIdQuery({ id: recordId })
  console.log('Valuation Data: ', valuationData)

  const images = valuationData?.data?.imageValuations?.map((img: any) => img.imageLink) || [
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
    const jewelryId = valuationData?.data?.jewelry?.id // Ensure you're using the correct path to jewelry ID
    const status = 7

    console.log('Updating status with:', { jewelryId, status })

    if (!jewelryId) {
      notification.error({
        message: 'Update Failed',
        description: 'Invalid jewelry ID.'
      })
      return
    }

    try {
      await updateStatus({ jewelryId, status }).unwrap()
      notification.success({
        message: 'Status Updated',
        description: 'The status has been updated to Final Valuated' // Message reflects the new status
      })
      setStatus('FinalValuated') // Set the status in the state

      refetch()
      onClose()
    } catch (error) {
      console.error('Error updating status:', error)
      notification.error({
        message: 'Update Failed',
        description: 'There was an error updating the status.'
      })
    }
  }

  if (valuationLoading) {
    return <Spin tip='Loading...' />
  }

  if (valuationError) {
    return <p>Error fetching valuation details</p>
  }

  return (
    <Modal
      title='Request Final Valuation Details'
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key='cancel' onClick={onClose}>
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
          <p className='mb-2 text-xl font-bold'>ID: {valuationData?.data?.id || 'N/A'}</p>
          <p className='mb-6 text-xl font-bold'>{valuationData?.data?.name || 'No Name Available'}</p>

          <div className='flex mb-4'>
            <strong className='w-1/3'>Customer Name:</strong>
            <span>
              {valuationData?.data?.seller?.firstName || ''} {valuationData?.data?.seller?.lastName || ''}
            </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Email:</strong>
            <span>{valuationData?.data?.seller?.accountDTO?.email || 'No Email Available'}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Phone:</strong>
            <span>{valuationData?.data?.seller?.accountDTO?.phoneNumber || 'No Phone Available'}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Estimated Price:</strong>
            <span>
              {valuationData?.data?.jewelry?.estimatePriceMin || 0} -{' '}
              {valuationData?.data?.jewelry?.estimatePriceMax || 0} VND
            </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Artist:</strong>
            <span>{valuationData?.data?.jewelry?.artist?.name || 0} </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Category:</strong>
            <span>{valuationData?.data?.jewelry?.category?.name || 0} </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Starting Price:</strong>
            <span className='text-red-700 font-bold'>{valuationData?.data?.jewelry?.startingPrice || 0} </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Final Price:</strong>
            <span>{valuationData?.data?.jewelry?.specificPrice || 0} </span>
          </div>
          <div className='mt-4 flex'>
            <strong className='w-1/3'>Status:</strong>
            {valuationData?.data?.status === 'FinalValuated' ? (
              <Select value={selectedStatus} onChange={handleStatusChange} style={{ width: 200 }}>
                {statusOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            ) : (
              <span className='text-red-700 font-bold'>{valuationData?.data?.status || 'Unknown Status'}</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default RequestFinalDetail
