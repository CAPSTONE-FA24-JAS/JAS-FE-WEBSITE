import { PlusOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Col, Input, Row, Space, Table, Tag, message, Tooltip, notification } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ConsignDetail from './ConsignDetail'
import { RootState } from '../../../../store'
import {
  useGetPreliminaryValuationsByStaffQuery,
  useUpdateValuationStatusMutation
} from '../../../../services/requestconsign.services'

const { Search } = Input

const RequestConsignList = () => {
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [status, setStatus] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)
  const staffId = useSelector((state: RootState) => state.authLoginAPI.id)
  const { data, error, isLoading, refetch } = useGetPreliminaryValuationsByStaffQuery({
    staffId: staffId || '',
    pageIndex,
    pageSize
  })

  const [updateValuationStatus] = useUpdateValuationStatusMutation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading data</div>
  }

  const showModal = (record: any) => {
    setSelectedRecord(record)
    setStatus(record.status || 'Pending')
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleUpdate = async () => {
    try {
      await updateValuationStatus({ id: selectedRecord.id, status }).unwrap()
      notification.success({
        message: 'Success',
        description: 'Status updated successfully!'
      })
      setIsModalVisible(false)
      refetch() // Refetch the data after update
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update status.'
      })
    }
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
      key: 'contact'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => {
        let color = status === 'Preliminary Valued' ? 'green' : status === 'Reject' ? 'red' : 'gray'
        return <Tag color={color}>{status ? status.toUpperCase() : 'PENDING'}</Tag>
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
          {record.status === 'Preliminary Valued' && (
            <Tooltip title='Create Preliminary Valuation'>
              <Button icon={<PlusOutlined />} onClick={() => navigate(`/staff/addPreliminary/${record.id}`)} />
            </Tooltip>
          )}
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

      <ConsignDetail
        isVisible={isModalVisible}
        onCancel={handleCancel}
        onUpdate={handleUpdate}
        record={selectedRecord}
        status={status}
        setStatus={setStatus}
      />
    </div>
  )
}

export default RequestConsignList
