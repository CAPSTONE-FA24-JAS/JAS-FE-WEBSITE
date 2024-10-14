import { PlusOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Col, Input, Row, Space, Table, Tag, Tooltip } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ConsignDetail from './ConsignDetail' // Ensure this component is created
import { RootState } from '../../../../store'
import { useGetPreliminaryValuationsByStaffQuery } from '../../../../services/requestconsign.services'

const { Search } = Input

const RequestConsignList = () => {
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [status, setStatus] = useState<number | string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)
  const staffId = useSelector((state: RootState) => state.authLoginAPI.staffId)
  console.log('Staff ID:', staffId)

  const { data, error, isLoading, refetch } = useGetPreliminaryValuationsByStaffQuery({
    staffId: staffId || '',
    pageIndex,
    pageSize
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading data</div>
  }

  console.log('API Response Data:', data)

  const showModal = (record: any) => {
    setSelectedRecord(record)
    setStatus(Number(record.status) || 0)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const filteredDataSource =
    data?.dataResponse?.filter(
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
      <ConsignDetail
        isVisible={isModalVisible}
        onCancel={handleCancel}
        record={selectedRecord}
        status={status.toString()}
        setStatus={setStatus}
        refetch={refetch}
      />
    </div>
  )
}

export default RequestConsignList
