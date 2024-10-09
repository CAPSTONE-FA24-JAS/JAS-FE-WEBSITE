import React, { useState } from 'react'
import { Table, Button, Typography, Tag } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import FinalDetailModal from './FinalDetailModal'

const { Title } = Typography

const finalValuationRequests = [
  {
    id: 1,
    valuationName: 'Diamond Ring Final Valuation',
    customerName: 'Nguyễn Văn A',
    status: 'Hoàn thành'
  },
  {
    id: 2,
    valuationName: 'Gold Necklace Final Valuation',
    customerName: 'Trần Thị B',
    status: 'Đã từ chối'
  },
  {
    id: 3,
    valuationName: 'Silver Bracelet Final Valuation',
    customerName: 'Lê Văn C',
    status: 'Đang xử lý'
  },
  {
    id: 4,
    valuationName: 'Emerald Pendant Final Valuation',
    customerName: 'Phạm Thị D',
    status: 'Hoàn thành'
  },
  {
    id: 5,
    valuationName: 'Platinum Watch Final Valuation',
    customerName: 'Đặng Văn E',
    status: 'Đang chờ xử lý'
  }
]

const statusTagColors: { [key: string]: string } = {
  'Đang chờ xử lý': 'orange',
  'Đang xử lý': 'blue',
  'Hoàn thành': 'green',
  'Đã từ chối': 'red'
}

const FinalValuationList = () => {
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)

  const showModal = (record: any) => {
    setCurrentRecord(record)
    setIsModalVisible(true)
  }
  const handleUpdate = () => {
    console.log('Update clicked for record:', currentRecord)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
    setCurrentRecord(null)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Valuation Name',
      dataIndex: 'valuationName',
      key: 'valuationName'
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={statusTagColors[status]}>{status}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <div>
          <Button type='link' icon={<EyeOutlined />} onClick={() => showModal(record)} />
        </div>
      )
    }
  ]

  return (
    <div className='p-6'>
      <Title level={3} className='mb-6'>
        Final Valuation List
      </Title>
      <Table dataSource={finalValuationRequests} columns={columns} rowKey='id' />

      <FinalDetailModal
        visible={isModalVisible}
        onUpdate={handleUpdate}
        record={currentRecord}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default FinalValuationList
