import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Select, notification } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useGetValuationByIdQuery } from '../../../../services/requestconsign.services'
import { useGetFilterByRoleQuery } from '../../../../services/account.services'
import { useAssignStaffForValuationMutation } from '../../../../services/requestconsign.services'
import { AssignStaffResponse } from '../../../../types/Consign.type'
import { AdminGetFilterByRoleChildrenResponse } from '../../../../types/Account.type'

interface RequestConsignDetailProps {
  recordId: number
  onClose: () => void // Prop to close modal
}

const RequestConsignDetail: React.FC<RequestConsignDetailProps> = ({ recordId, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [assignedStaff, setAssignedStaff] = useState<string>('')
  const [staffOptions, setStaffOptions] = useState<AdminGetFilterByRoleChildrenResponse[]>([])
  const roleId = 3

  const { data: valuationData, isLoading: valuationLoading, error: valuationError } = useGetValuationByIdQuery(recordId)
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
    if (valuationData?.data) {
      const record = valuationData.data
      if (record.staffId) {
        setAssignedStaff(record.staffId.toString())
      }
      if (record.imageValuations) {
        setCurrentImageIndex(0)
      }
    }
  }, [valuationData])

  const images = valuationData?.data?.imageValuations?.map((image: any) => image.imageLink) || []

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleUpdate = () => {
    if (assignedStaff) {
      assignStaffForValuation({
        id: valuationData?.data?.id,
        staffId: parseInt(assignedStaff),
        status: 1
      })
        .unwrap()
        .then((response: AssignStaffResponse) => {
          notification.success({
            message: 'Assigned Staff Successfully',
            description: response.message
          })
        })
        .catch(() => {
          notification.error({
            message: 'Error',
            description: 'Failed to assign staff. Please try again later.'
          })
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
  }

  const handleClose = () => {
    setAssignedStaff('') // Reset assigned staff if needed
    setCurrentImageIndex(0) // Reset image index if needed
    onClose() // Call the parent onClose function
  }

  if (valuationLoading) {
    return <p>Loading valuation details...</p>
  }

  if (valuationError) {
    return <p>Error loading valuation details.</p>
  }

  return (
    <Modal
      title='Consign Detail'
      open={true}
      onCancel={handleClose} // Close modal on cancel
      footer={null}
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
          <h2 className='text-xl font-semibold mb-4'>Valuation Details</h2>
          <div className='flex mb-4'>
            <strong className='w-1/3'>ID:</strong>
            <span>{valuationData?.data?.id}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Name:</strong>
            <span>{valuationData?.data?.name}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Customer Name:</strong>
            <span>
              {valuationData?.data?.seller?.firstName} {valuationData?.data?.seller?.lastName}
            </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Email:</strong>
            <span>{valuationData?.data?.seller?.accountDTO?.email}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Phone:</strong>
            <span>{valuationData?.data?.seller?.accountDTO?.phoneNumber}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Width:</strong>
            <span>{valuationData?.data?.width} cm</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Height:</strong>
            <span>{valuationData?.data?.height} cm</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Depth:</strong>
            <span>{valuationData?.data?.depth} cm</span>
          </div>
          <div className='flex mb-6'>
            <strong className='w-1/3'>Description:</strong>
            <span>{valuationData?.data?.description}</span>
          </div>
          <div className='flex mb-6'>
            <strong className='w-1/3'>Status:</strong>
            <span className='text-red-600 font-semibold'>{assignedStaff ? 'Assigned' : 'Not Assigned'}</span>
          </div>
          <Form.Item label='Assign Staff' className='mt-4 font-bold'>
            <Select value={assignedStaff} onChange={handleStaffChange} placeholder='Select staff'>
              {staffLoading ? (
                <Select.Option value='' disabled>
                  Select Staff
                </Select.Option>
              ) : staffError ? (
                <Select.Option value='' disabled>
                  Failed to load staff
                </Select.Option>
              ) : (
                staffOptions.map((staff) => (
                  <Select.Option key={staff.id} value={staff.id.toString()}>
                    {staff.firstName} {staff.lastName}
                  </Select.Option>
                ))
              )}
            </Select>
          </Form.Item>
          <Button type='primary' onClick={handleUpdate}>
            Assign Staff
          </Button>
          <Button onClick={handleClose} className='ml-2'>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default RequestConsignDetail
