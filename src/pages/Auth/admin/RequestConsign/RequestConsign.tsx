import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Col, Input, Row, Space, Table, Tag } from 'antd'
import { useState, useEffect } from 'react'
import { useGetValuationsQuery } from '../../../../services/requestconsign.services'
import RequestConsignDetail from './RequestConsignDetail'
import { useLocation, useNavigate } from 'react-router-dom'

const { Search } = Input

export default function RequestConsign() {
  const [searchText, setSearchText] = useState<string>('')
  const { data, isLoading, error, refetch } = useGetValuationsQuery(undefined)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const recordId = queryParams.get('recordId')

    if (recordId) {
      const record = data?.dataResponse.find((item: any) => item.id === parseInt(recordId))
      if (record) {
        setSelectedRecord(record)
      }
    }
  }, [location.search, data])

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const filteredDataSource =
    data?.dataResponse
      .filter(
        (item: any) =>
          (item.firstNameSeller || '').toLowerCase().includes(searchText.toLowerCase()) ||
          (item.lastNameSeller || '').toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((item: any) => item.status === 'Requested' || item.status === 'Assigned') || []

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
      render: (_text: string, record: any) => `${record.firstNameSeller || ''} ${record.lastNameSeller || ''}`
    },
    {
      title: 'Contact',
      dataIndex: 'email',
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
        const color = status === 'Assigned' ? 'green' : status === 'Requested' ? 'gray' : 'blue'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_text: any, record: any) => (
        <Space>
          <Button
            type='primary'
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedRecord(record)
            }}
          />
        </Space>
      )
    }
  ]

  const handleCloseModal = () => {
    setSelectedRecord(null)
    navigate('/manager/ConsignList', { replace: true })
  }

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
        <>
          {filteredDataSource.length === 0 ? (
            <p>No consignments found.</p>
          ) : (
            <Table
              dataSource={filteredDataSource}
              columns={columns}
              rowKey='id'
              bordered
              pagination={{ pageSize: 6 }}
              loading={isLoading}
            />
          )}
        </>
      )}

      {selectedRecord && (
        <div className='mt-4'>
          <RequestConsignDetail recordId={selectedRecord.id} onClose={handleCloseModal} refetch={refetch} />
        </div>
      )}
    </div>
  )
}
