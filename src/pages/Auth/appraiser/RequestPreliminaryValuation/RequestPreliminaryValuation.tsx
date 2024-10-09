import React, { useState } from 'react'
import { Table, Button, Typography, Tag, Modal, Form, Input, Select } from 'antd'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ValuationDetailsModal from './RequestPreliminaryDetailModal'

const { Title } = Typography
const { Option } = Select

const preliminaryValuationRequests = [
  {
    id: 1,
    valuationName: 'Diamond Ring',
    customerName: 'Nguyễn Văn A',
    contact: '0123456789',
    status: 'Đang chờ xử lý'
  },
  {
    id: 2,
    valuationName: 'Gold Necklace',
    customerName: 'Trần Thị B',
    contact: '0987654321',
    status: 'Đã hoàn thành'
  },
  {
    id: 3,
    valuationName: 'Silver Bracelet',
    customerName: 'Lê Văn C',
    contact: '0345678901',
    status: 'Đang xử lý'
  },
  {
    id: 4,
    valuationName: 'Emerald Pendant',
    customerName: 'Phạm Thị D',
    contact: '0765432109',
    status: 'Đã từ chối'
  },
  {
    id: 5,
    valuationName: 'Platinum Watch',
    customerName: 'Đặng Văn E',
    contact: '0123456780',
    status: 'Đang chờ xử lý'
  }
]

const statusTagColors: { [key: string]: string } = {
  'Đang chờ xử lý': 'orange',
  'Đang xử lý': 'blue',
  'Đã hoàn thành': 'green',
  'Đã từ chối': 'red'
}

const RequestPreliminaryList = () => {
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
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact'
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
          <Button type='link' icon={<EyeOutlined />} onClick={() => showModal(record)} />{' '}
          {/* Eye icon for view details */}
          <Button
            type='link'
            icon={<PlusOutlined />}
            onClick={() => navigate(`/appraiser/createPreliminary/${record.id}`)} // Navigate to the specific route
          />
        </div>
      )
    }
  ]

  return (
    <div className='p-6'>
      <Title level={3} className='mb-6'>
        Preliminary Valuation List
      </Title>
      <Table dataSource={preliminaryValuationRequests} columns={columns} rowKey='id' />

      <ValuationDetailsModal
        visible={isModalVisible}
        onUpdate={handleUpdate}
        onCancel={handleCancel}
        record={currentRecord}
      />
    </div>
  )
}

export default RequestPreliminaryList
