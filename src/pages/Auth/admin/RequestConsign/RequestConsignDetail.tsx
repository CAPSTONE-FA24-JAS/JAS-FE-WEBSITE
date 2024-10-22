import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Select, notification } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useGetFilterByRoleQuery } from '../../../../services/account.services'
import { useAssignStaffForValuationMutation } from '../../../../services/requestconsign.services'
import { AssignStaffResponse } from '../../../../types/Consign.type'
import { AdminGetFilterByRoleChildrenResponse } from '../../../../types/Account.type'

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
  const [staffOptions, setStaffOptions] = useState<AdminGetFilterByRoleChildrenResponse[]>([])

  const roleId = 3

  const { data: staffData, isLoading: staffLoading, error: staffError } = useGetFilterByRoleQuery(roleId)
  const [assignStaffForValuation] = useAssignStaffForValuationMutation()

  useEffect(() => {
    if (staffData && staffData.data) {
      const staffList = staffData.data
      const extractedStaff = staffList.map((account: any) => account.staffDTO).filter(Boolean)
      setStaffOptions(extractedStaff)
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
      assignStaffForValuation({
        id: record.id,
        staffId: parseInt(assignedStaff),
        status: 1
      })
        .unwrap()
        .then((response: AssignStaffResponse) => {
          if (response.isSuccess) {
            notification.success({
              message: 'Assigned Staff Successlly',
              description: response.message
            })
            refetch() // Refetch to update the list
            onUpdate() // Call onUpdate to close modal
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

  const handleStaffChange = (value: string) => {
    setAssignedStaff(value)
    setStatus('1')
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
        <Button key='update' type='primary' onClick={handleUpdate}>
          Update
        </Button>
      ]}
      width={900}
      style={{ padding: '24px' }}
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
          <p className='mb-2 text-xl font-bold'>{record?.id}</p>
          <p className='mb-6 text-xl font-bold'>{record?.name}</p>
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
            <strong className='w-1/3'>Width:</strong>
            <span>{record?.width} cm</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Height:</strong>
            <span>{record?.height} cm</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Depth:</strong>
            <span>{record?.depth} cm</span>
          </div>
          <div className='flex mb-6'>
            <strong className='w-1/3'>Description:</strong>
            <span>{record?.description}</span>
          </div>
          <div className='flex mb-6'>
            <strong className='w-1/3'>Status:</strong>
            <span className='text-red-600 font-semibold'>{status === '1' ? 'Assigned' : status}</span>
          </div>

          <Form.Item label='Assign Staff' className='mt-4 font-bold'>
            <Select value={assignedStaff} onChange={handleStaffChange} placeholder='Select staff'>
              {staffLoading ? (
                <Select.Option value='' disabled>
                  Loading...
                </Select.Option>
              ) : staffError ? (
                <Select.Option value='' disabled>
                  Error loading staff
                </Select.Option>
              ) : (
                staffOptions.map((staff) =>
                  staff ? (
                    <Select.Option key={staff.id} value={staff.id}>
                      {staff.firstName} {staff.lastName}
                    </Select.Option>
                  ) : null
                )
              )}
            </Select>
          </Form.Item>
        </div>
      </div>
    </Modal>
  )
}

export default RequestConsignDetail
