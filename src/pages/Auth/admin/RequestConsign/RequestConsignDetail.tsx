import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Select, notification } from 'antd'
import { LeftOutlined, RightOutlined, FilePdfOutlined } from '@ant-design/icons'
import { useGetValuationByIdQuery } from '../../../../services/requestconsign.services'
import { useGetFilterByRoleQuery } from '../../../../services/account.services'
import { useAssignStaffForValuationMutation } from '../../../../services/requestconsign.services'
import { AssignStaffResponse } from '../../../../types/Consign.type'
import { AdminGetFilterByRoleChildrenResponse } from '../../../../types/Account.type'

interface RequestConsignDetailProps {
  recordId: number
  onClose: () => void // Prop to close modal
  refetch: () => void // Prop to refetch data
}

const RequestConsignDetail: React.FC<RequestConsignDetailProps> = ({ recordId, onClose, refetch }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [assignedStaff, setAssignedStaff] = useState<string>('')
  const [staffOptions, setStaffOptions] = useState<AdminGetFilterByRoleChildrenResponse[]>([])
  const roleId = 3
  const [isModalVisible, setIsModalVisible] = useState(false)
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

  const images = valuationData?.data?.imageValuations || [
    { imageLink: 'https://via.placeholder.com/150?text=No+Image', defaultImage: null }
  ]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const openModal = () => setIsModalVisible(true)
  const closeModal = () => setIsModalVisible(false)
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
          refetch() // Refetch data after successful assignment
          onClose()
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
    setAssignedStaff('')
    setCurrentImageIndex(0)
    onClose()
  }

  const renderImageOrLink = (image: any, index: number) => {
    if (image.defaultImage === 'PDF') {
      return (
        <a
          key={index}
          href={image.imageLink}
          target='_blank'
          rel='noopener noreferrer'
          className='w-[100px] h-[100px] flex items-center justify-center bg-gray-200 rounded-lg mx-2 cursor-pointer border'
        >
          <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
        </a>
      )
    } else {
      return (
        <img
          key={index}
          src={image.imageLink}
          alt={`thumb-${index}`}
          className='w-[100px] h-[100px] object-cover rounded-lg mx-2 cursor-pointer border'
          onClick={() => setCurrentImageIndex(index)}
        />
      )
    }
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
      width={1200}
      style={{ padding: '24px' }}
    >
      <div className='grid grid-cols-2 gap-6'>
        <div className='relative'>
          <div className='flex items-center justify-center mb-4'>
            {images[currentImageIndex]?.defaultImage === 'PDF' ? (
              <a
                href={images[currentImageIndex]?.imageLink}
                target='_blank'
                rel='noopener noreferrer'
                className='w-[450px] h-[500px] flex items-center justify-center bg-gray-200 rounded-lg cursor-pointer border font-bold'
              >
                <FilePdfOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
                GIA
              </a>
            ) : (
              <img
                src={images[currentImageIndex]?.imageLink}
                alt='product'
                onClick={openModal}
                className='w-[450px] h-[500px] object-cover rounded-lg'
              />
            )}
          </div>
          <div className='absolute top-56 left-0 flex items-center justify-center pl-3'>
            <Button icon={<LeftOutlined />} onClick={prevImage} className='bg-gray-300 hover:bg-gray-400' />
          </div>
          <div className='absolute top-56 right-0 flex items-center justify-center pr-3'>
            <Button icon={<RightOutlined />} onClick={nextImage} className='bg-gray-300 hover:bg-gray-400' />
          </div>
          <div className='flex ml-10 mt-10'>
            {valuationData?.data?.imageValuations?.map(renderImageOrLink) || <p>No images available</p>}
          </div>
        </div>
        <Modal open={isModalVisible} footer={null} onCancel={closeModal} width='40%'>
          <img
            src={images[currentImageIndex]?.imageLink}
            alt='product zoomed'
            className='w-full h-auto object-contain'
          />
        </Modal>
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
          <div className='flex'>
            <strong className='w-1/3 font-bold'>Assign Staff:</strong>
            <Form.Item className='w-2/3'>
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
          </div>
        </div>
      </div>
      <div className='flex justify-end'>
        <Button onClick={handleClose} className='mr-2'>
          Close
        </Button>
        <Button type='primary' onClick={handleUpdate}>
          Assign Staff
        </Button>
      </div>
    </Modal>
  )
}

export default RequestConsignDetail
