import React from 'react'
import { Button, Modal, Select } from 'antd'
const { Option } = Select

interface FinalDetailModalProps {
  visible: boolean
  record: any
  onCancel: () => void
  onUpdate: () => void // Added onUpdate prop
}

const statusTagColors: { [key: string]: string } = {
  'Đang chờ xử lý': 'orange',
  'Đang xử lý': 'blue',
  'Hoàn thành': 'green',
  'Đã từ chối': 'red'
}

const FinalDetailModal: React.FC<FinalDetailModalProps> = ({ visible, onUpdate, onCancel, record }) => {
  return (
    <Modal
      title='Valuation Details'
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='update' type='primary' onClick={onUpdate}>
          Send
        </Button>
      ]}
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
            <strong>Contact:</strong> {record?.contact || 'N/A'}
          </p>
          <p className='mb-4'>
            <strong>Phone:</strong> {record?.phone}
          </p>
          <p className='mb-4'>
            <strong>Email:</strong> {record?.email || 'N/A'}
          </p>
          <p className='mb-4'>
            <strong>Final Price:</strong>
            <span className='font-bold text-red-800'> {record?.desiredPrice} VND</span>
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
        </div>
      </div>
      <div className='mt-6'>
        <p className='italic text-blue-500'>Receipt Link</p>
      </div>
      {/* Note Section */}
      <div className='mt-6'>
        <p className='italic font-bold text-red-500'>
          Note: If customers accept this price, please send jewelry to the address below.
        </p>
        <p className='italic font-bold text-red-500'>
          S10.05(VHGP), Nguyen Xien Street, Long Binh Ward, Thu Duc District, Ho Chi Minh City
        </p>
      </div>
    </Modal>
  )
}

export default FinalDetailModal
