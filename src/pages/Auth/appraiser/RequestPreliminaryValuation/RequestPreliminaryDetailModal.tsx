import React from 'react'
import { Modal, Input, Select, Button } from 'antd'

const { Option } = Select

interface ValuationDetailsModalProps {
  visible: boolean
  onCancel: () => void
  onUpdate: () => void // Added onUpdate prop
  record: any
}

const ValuationDetailsModal: React.FC<ValuationDetailsModalProps> = ({ visible, onCancel, onUpdate, record }) => {
  return (
    <Modal
      title='Valuation Details'
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      style={{ padding: '24px' }}
    >
      <div className='grid grid-cols-2 gap-6'>
        <div className='flex items-center justify-center'>
          <img
            src='https://via.placeholder.com/300?text=Valuation+Image'
            alt='Valuation Item'
            className='max-w-full rounded-lg'
          />
        </div>

        <div>
          <p className='mb-4'>
            <strong>{record?.id}</strong>
          </p>
          <p className='mb-4'>
            <strong>{record?.valuationName}</strong>
          </p>
          <p className='mb-4'>
            <strong>Customer Name:</strong> {record?.customerName}
          </p>
          <p className='mb-4'>
            <strong>Phone:</strong> {record?.phone}
          </p>
          <p className='mb-4'>
            <strong>Email:</strong> {record?.email || 'N/A'}
          </p>
          <p className='mb-4'>
            <strong>Width:</strong> {record?.width || 'N/A'} cm
          </p>
          <p className='mb-4'>
            <strong>Height:</strong> {record?.height || 'N/A'} cm
          </p>
          <p className='mb-4'>
            <strong>Depth:</strong> {record?.depth || 'N/A'} cm
          </p>
          <div className='mb-4'>
            <strong>Status:</strong>
            <Select defaultValue={record?.status} className='ml-2'>
              <Option value='Đang chờ xử lý'>Đang chờ xử lý</Option>
              <Option value='Đang xử lý'>Đang xử lý</Option>
              <Option value='Đã hoàn thành'>Đã hoàn thành</Option>
              <Option value='Đã từ chối'>Đã từ chối</Option>
            </Select>
          </div>
          <p className='mb-4'>
            <strong>Staff (Người gửi yêu cầu thẩm định):</strong> {record?.staff || 'N/A'}
          </p>
        </div>
      </div>

      <div className='flex justify-end mt-6'>
        <Button onClick={onCancel} className='mr-2'>
          Cancel
        </Button>
        <Button type='primary' onClick={onUpdate}>
          Update
        </Button>
      </div>
    </Modal>
  )
}

export default ValuationDetailsModal
