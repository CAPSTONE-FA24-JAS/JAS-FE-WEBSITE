import React, { useState } from 'react'
import { Button, Col, Input, Row, Space, Table, Tag, Tooltip } from 'antd'
import { EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import ValuationDetailsModal from './RequestPreliminaryDetailModal' // Adjust the import path as needed
import { useGetRequestPreliminaryValuationQuery } from '../../../../services/valuation.services' // Adjust the import path as needed
import { useNavigate } from 'react-router-dom'

const { Search } = Input

const RequestPreliminaryList = () => {
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  const [searchText, setSearchText] = useState<string>('')
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)

  const { data, isLoading, error, refetch } = useGetRequestPreliminaryValuationQuery({ pageSize, pageIndex })

  const showModal = (record: any) => {
    setCurrentRecord(record)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setCurrentRecord(null)
  }

  const handleUpdate = () => {
    refetch() // Re-fetch data to update the table
    setIsModalVisible(false)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const filteredDataSource =
    data?.data.dataResponse?.filter(
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
      key: 'valuationName'
    },
    {
      title: 'Customer Name',
      dataIndex: ['seller', 'firstName'],
      key: 'customerName',
      render: (text: any, record: any) => `${record.seller.firstName} ${record.seller.lastName}`
    },
    {
      title: 'Contact',
      dataIndex: ['seller', 'email'],
      key: 'contact',
      render: (text: any, record: any) => record.seller.accountDTO.email
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (!status) {
          return <Tag color='gray'>Unknown</Tag>
        }
        let color = status === '1' ? 'green' : status === 'Assigned' ? 'gray' : 'blue'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <Space>
          <Tooltip title='View Detail'>
            <Button icon={<EyeOutlined />} onClick={() => showModal(record)} />
          </Tooltip>
          <Tooltip title='Create Preliminary Valuation'>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => {
                navigate(`/appraiser/createPreliminary/${record.id}`)
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <div className='p-4'>
      <Row justify='space-between' align='middle' className='mb-4'>
        <Col>
          <h2 className='text-2xl font-bold'>Preliminary Valuation List</h2>
        </Col>
        <Col>
          <Row gutter={16} align='middle'>
            <Col>
              <Search
                placeholder='Search by valuation or customer name'
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
      ) : filteredDataSource && filteredDataSource.length > 0 ? (
        <Table
          dataSource={filteredDataSource}
          columns={columns}
          rowKey='id'
          pagination={{
            total: data?.data?.totalItemRepsone,
            current: pageIndex,
            pageSize: pageSize,
            onChange: (page, pageSize) => {
              setPageIndex(page)
              setPageSize(pageSize)
              refetch()
            }
          }}
        />
      ) : (
        <p>No data available</p>
      )}

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
