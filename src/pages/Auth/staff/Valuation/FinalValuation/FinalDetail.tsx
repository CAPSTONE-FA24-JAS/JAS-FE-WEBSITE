import React from 'react'
import { Button, Modal, Select, Input } from 'antd'

const { Option } = Select

interface FinalDetailProps {
  isVisible: boolean
  onCancel: () => void
  onUpdate: () => void
  record: any // Or define a more specific type
  status?: any // Make this optional or define the type as needed
  setStatus?: (status: any) => void // If you still need this prop
  tab: string
}

const statusTagColors: { [key: string]: string } = {
  'Đang chờ xử lý': 'orange',
  'Đang xử lý': 'blue',
  'Hoàn thành': 'green',
  'Đã từ chối': 'red'
}

const FinalDetail: React.FC<FinalDetailProps> = ({ isVisible, onCancel, onUpdate, record, status, setStatus, tab }) => {
  return (
    <Modal
      title='Final Valuation Details'
      open={isVisible}
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

          <div className='mb-4'>
            <strong>Giá khởi điểm:</strong>
            <Input placeholder='Nhập giá khởi điểm' className='mt-2' />
          </div>
          <div className='mb-4'>
            <strong>Phương thức đấu giá:</strong>
            <br />
            <Select placeholder='Chọn phương thức đấu giá' className='mt-2'>
              <Option value='Trực tuyến'>Trực tuyến</Option>
              <Option value='Trực tiếp'>Trực tiếp</Option>
            </Select>
          </div>
          <div className='mb-4'>
            <strong>Thời điểm đấu giá:</strong>
            <Input type='datetime-local' className='mt-2' />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default FinalDetail
