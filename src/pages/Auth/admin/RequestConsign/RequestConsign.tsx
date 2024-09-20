import React, { useState } from 'react'
import { Button, Col, Input, Row, Space, Table, Tag } from 'antd'
import { useGetValuationsQuery } from '../../../../services/requestconsign.services'
import RequestConsignDetail from './RequestConsignDetail'
import { DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons'

const { Search } = Input

export default function RequestConsign() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [status, setStatus] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)

  const { data, isLoading, error, refetch } = useGetValuationsQuery({ pageSize, pageIndex })

  const showModal = (record: any) => {
    setSelectedRecord(record)
    setStatus(record.status || '')
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleUpdate = () => {
    // Refetch data after update
    refetch()
    setIsModalVisible(false)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const filteredDataSource =
    data?.dataResponse.filter(
      (item: any) =>
        (item.seller.firstName || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (item.seller.lastName || '').toLowerCase().includes(searchText.toLowerCase())
    ) || []

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Valuation Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Customer Name',
      dataIndex: ['seller', 'firstName'],
      key: 'customerName',
      render: (text: string, record: any) => `${record.seller.firstName || ''} ${record.seller.lastName || ''}`
    },
    {
      title: 'Contact',
      dataIndex: ['seller', 'email'],
      key: 'email'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (!status) {
          return <Tag color='gray'>Unknown</Tag>
        }
        let color = status === 'Approved' ? 'green' : status === 'Requested' ? 'blue' : 'gray'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <Space>
          <Button type='primary' icon={<EyeOutlined />} onClick={() => showModal(record)}></Button>
          <Button type='primary' danger icon={<DeleteOutlined />}></Button>
        </Space>
      )
    }
  ]

  return (
    <div className='p-4'>
      <Row justify='space-between' align='middle' className='mb-4'>
        <Col>
          <h2 className='text-2xl font-bold'>Consign List</h2>
        </Col>
        <Col>
          <Row gutter={16} align='middle'>
            <Col>
              <Search
                placeholder='Search by customer name'
                allowClear
                enterButton={<SearchOutlined />}
                size='small'
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 250, borderColor: '#dcdcdc' }}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading data</p>
      ) : (
        <Table
          dataSource={filteredDataSource}
          columns={columns}
          rowKey='id'
          pagination={{
            total: data?.totalItemRepsone,
            current: pageIndex,
            pageSize: pageSize,
            onChange: (page, pageSize) => {
              setPageIndex(page)
              setPageSize(pageSize)
              refetch()
            }
          }}
        />
      )}

      <RequestConsignDetail
        isVisible={isModalVisible}
        onCancel={handleCancel}
        onUpdate={handleUpdate}
        record={selectedRecord}
        status={status}
        setStatus={setStatus}
        refetch={refetch}
      />
    </div>
  )
}
