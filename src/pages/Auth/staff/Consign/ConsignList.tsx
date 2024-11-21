import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Col, Input, Row, Space, Table, Tag, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ConsignDetail from './ConsignDetail' // Ensure this component is created
import { RootState } from '../../../../store'
import { useGetPreliminaryValuationsByStaffQuery } from '../../../../services/requestconsign.services'

const { Search } = Input

const RequestConsignList = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [status, setStatus] = useState<number | string>('')

  const [searchText, setSearchText] = useState<string>('')
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)

  const staffId = useSelector((state: RootState) => state.authLoginAPI.staffId)

  // Parsing query params to check if modal should be opened
  const queryParams = new URLSearchParams(location.search)
  const modalTrigger = queryParams.get('modal')
  const recordId = queryParams.get('recordId')

  // Fetch preliminary valuations by staffId
  const { data, error, isLoading, refetch } = useGetPreliminaryValuationsByStaffQuery({
    staffId: staffId || '',
    pageIndex,
    pageSize
  })

  useEffect(() => {
    if (modalTrigger === 'true' && recordId) {
      // Find the record by recordId and open the modal
      const record = data?.dataResponse.find((item: any) => item.id === Number(recordId))
      if (record) {
        setSelectedRecord(record)
        setStatus(Number(record.status) || 0)
        setIsModalVisible(true)
      }
    }
  }, [modalTrigger, recordId, data])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading data</div>
  }

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
        bordered
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
