import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Col, Input, Row, Space, Table, Tag } from 'antd'
import { useState, useEffect } from 'react'
import RequestFinalDetail from './RequestFinalDetail'
import { useGetValuationsQuery } from '../../../../services/valuation.services'
import { useLocation, useNavigate } from 'react-router-dom'

interface Valuation {
  id: number
  name: string
  seller: {
    firstName: string
    lastName: string
  }
  status: string
}

const { Search } = Input

const RequestFinalValuation = () => {
  const [selectedFinalRecord, setSelectedFinalRecord] = useState<Valuation | null>(null)
  const [searchText, setSearchText] = useState<string>('')
  const location = useLocation()
  const navigate = useNavigate()

  const { data, error, isLoading, refetch } = useGetValuationsQuery()

  const finalValuationData: Valuation[] =
    data?.dataResponse?.filter((valuation: Valuation) =>
      ['FinalValuated', 'ManagerApproved', 'Authorized', 'Rejected'].includes(valuation.status)
    ) || []

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const recordId = queryParams.get('recordId')

    if (recordId) {
      const record = finalValuationData.find((valuation) => valuation.id === parseInt(recordId))
      if (record) {
        setSelectedFinalRecord(record)
      }
    }
  }, [location.search, finalValuationData])

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const handleCloseModal = () => {
    setSelectedFinalRecord(null)
    navigate('/manager/requestfinal', { replace: true })
  }

  const finalColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Valuation Name',
      dataIndex: 'nameJewelry',
      key: 'nameJewelry'
    },
    {
      title: 'Customer Name',
      dataIndex: ['seller', 'firstName'],
      key: 'customerName',
      render: (_text: string, record: any) => `${record.firstNameSeller || ''} ${record.lastNameSeller || ''}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green'
        let label = status

        if (status === 'FinalValuated') {
          color = 'red'
        } else if (status === 'ManagerApproved') {
          color = 'blue'
        } else if (status === 'Authorized') {
          color = 'green'
        } else if (status === 'Rejected') {
          color = 'gray'
        }

        return <Tag color={color}>{label}</Tag>
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_text: any, record: Valuation) => (
        <Space>
          <Button
            type='primary'
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedFinalRecord(record)
            }}
          />
        </Space>
      )
    }
  ]

  return (
    <div className='p-4'>
      {error && <p>Error fetching final valuations</p>}
      <Row justify='space-between' align='middle' className='mb-4'>
        <Col>
          <h2 className='text-2xl font-bold'>Request Final Valuation List</h2>
        </Col>
        <Col>
          <Row gutter={16} align='middle'>
            <Col>
              <Search
                placeholder='Search by valuation name'
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
      ) : (
        <>
          {finalValuationData.length === 0 ? (
            <p>No final valuations found.</p>
          ) : (
            <Table<Valuation>
              dataSource={finalValuationData.filter((item: Valuation) =>
                item.name.toLowerCase().includes(searchText.toLowerCase())
              )}
              columns={finalColumns}
              rowKey='id'
              bordered
              pagination={{ pageSize: 6 }}
            />
          )}
        </>
      )}

      {selectedFinalRecord && (
        <div className='mt-4'>
          <RequestFinalDetail
            recordId={selectedFinalRecord.id}
            isVisible={true}
            setStatus={(status) => {
              console.log(status)
            }}
            refetch={refetch}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  )
}

export default RequestFinalValuation
