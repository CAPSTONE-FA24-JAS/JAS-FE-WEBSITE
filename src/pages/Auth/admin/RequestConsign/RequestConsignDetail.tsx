import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Select, notification } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useGetFilterByRoleQuery } from '../../../../services/account.services'
import { useAssignStaffForValuationMutation } from '../../../../services/requestconsign.services'
import { AssignStaffResponse } from '../../../../types/Consign.type'

interface ConsignDetailProps {
  isVisible: boolean
  onCancel: () => void
  onUpdate: () => void
  record: any
  status: string
  setStatus: (status: string) => void
  refetch: () => void
}

const RequestConsignDetail: React.FC<ConsignDetailProps> = ({
  isVisible,
  onCancel,
  onUpdate,
  record,
  status,
  setStatus,
  refetch
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [assignedStaff, setAssignedStaff] = useState<string>('')
  const [staffOptions, setStaffOptions] = useState<any[]>([])

  const roleId = 3

  const { data: staffData, isLoading: staffLoading, error: staffError } = useGetFilterByRoleQuery(roleId)
  const [assignStaffForValuation] = useAssignStaffForValuationMutation()

  useEffect(() => {
    if (staffData && staffData.data) {
      setStaffOptions(staffData.data)
    }
  }, [staffData])

  useEffect(() => {
    if (record?.staffId) {
      setAssignedStaff(record.staffId.toString())
    }
    if (record?.imageValuations) {
      setCurrentImageIndex(0)
    }
  }, [record])

  const images = record?.imageValuations?.map((image: any) => image.imageLink) || []

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleUpdate = () => {
    if (assignedStaff) {
      assignStaffForValuation({ id: record.id, staffId: parseInt(assignedStaff) })
        .unwrap()
        .then((response: AssignStaffResponse) => {
          if (response.isSuccess) {
            notification.success({
              message: 'Success',
              description: response.message
            })
            refetch()
            onUpdate()
          } else {
            notification.error({
              message: 'Error',
              description: response.message || 'Failed to assign staff. Please try again later.'
            })
          }
        })
        .catch((error) => {
          notification.error({
            message: 'Error',
            description: 'Failed to assign staff. Please try again later.'
          })
          console.error('Failed to assign staff', error)
        })
    } else {
      notification.warning({
        message: 'Warning',
        description: 'Please select a staff member.'
      })
    }
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
        <Button key='update' type='primary' onClick={handleUpdate}>
          Update
        </Button>
      ]}
      width={900}
      style={{ padding: '24px' }} // Replace bodyStyle with style
    >
      <div className='grid grid-cols-2 gap-6'>
        <div className='relative'>
          <div className='flex items-center justify-center mb-4'>
            {images.length > 0 ? (
              <img src={images[currentImageIndex]} alt='product' className='max-w-full rounded-lg' />
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
          <p className='text-xl font-bold mb-2'>{record?.id}</p>
          <p className='text-xl font-bold mb-6'>{record?.name}</p>

          <p className='mb-4'>
            <strong>Customer Name:</strong> {record?.seller?.firstName} {record?.seller?.lastName}
          </p>
          <p className='mb-4'>
            <strong>Email:</strong> {record?.seller?.email}
          </p>
          <p className='mb-4'>
            <strong>Phone Number:</strong> {record?.seller?.phoneNumber}
          </p>
          <p className='mb-4'>
            <strong>Width:</strong> {record?.width} cm
          </p>
          <p className='mb-4'>
            <strong>Height:</strong> {record?.height} cm
          </p>
          <p className='mb-4'>
            <strong>Description:</strong> {record?.description}
          </p>
          <Form.Item label='Status' className='mt-4 font-bold'>
            <Select value={status} onChange={(value) => setStatus(value)}>
              <Select.Option value='Approve'>Approve</Select.Option>
              <Select.Option value='Reject'>Reject</Select.Option>
              <Select.Option value='Pending'>Pending</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label='Assign Staff' className='mt-4 font-bold'>
            <Select value={assignedStaff} onChange={(value) => setAssignedStaff(value)} placeholder='Select staff'>
              {staffLoading ? (
                <Select.Option value='' disabled>
                  Loading...
                </Select.Option>
              ) : staffError ? (
                <Select.Option value='' disabled>
                  Error loading staff
                </Select.Option>
              ) : (
                staffOptions.map((staff) => (
                  <Select.Option key={staff.id} value={staff.id}>
                    {staff.firstName} {staff.lastName}
                  </Select.Option>
                ))
              )}
            </Select>
          </Form.Item>
        </div>
      </div>
    </Modal>
  )
}

export default RequestConsignDetail
