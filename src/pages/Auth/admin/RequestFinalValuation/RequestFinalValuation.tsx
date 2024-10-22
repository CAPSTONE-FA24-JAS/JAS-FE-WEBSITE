import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Col, Input, Row, Table, Tag, Tooltip } from 'antd'
import { useState } from 'react'
import RequestFinalDetail from './RequestFinalDetail'
import { useGetValuationsQuery } from '../../../../services/valuation.services'

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
  const [finalModalVisible, setFinalModalVisible] = useState<boolean>(false)
  const [selectedFinalRecord, setSelectedFinalRecord] = useState<Valuation | null>(null)
  const [searchText, setSearchText] = useState<string>('')

  const { data, error, isLoading, refetch } = useGetValuationsQuery()

  const finalValuationData =
    data?.dataResponse?.filter((valuation: Valuation) =>
      ['FinalValuated', 'ManagerApproved', 'Authorized', 'RejectedPreliminary'].includes(valuation.status)
    ) || []

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const finalColumns = [
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
      dataIndex: 'seller',
      key: 'seller',
      render: (seller: { firstName: string; lastName: string }) =>
        seller ? `${seller.firstName} ${seller.lastName}` : ''
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
        } else if (status === 'RejectedPreliminary') {
          color = 'orange'
        }

        return <Tag color={color}>{label}</Tag>
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: Valuation) => (
        <div>
          <Tooltip title='View Request Final Details'>
            <Button
              type='primary'
              icon={<EyeOutlined />}
              className='bg-blue-500 hover:bg-blue-600'
              onClick={() => {
                setSelectedFinalRecord(record)
                setFinalModalVisible(true)
              }}
            />
          </Tooltip>
        </div>
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

      <Table
        dataSource={finalValuationData.filter((item: any) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        )}
        columns={finalColumns}
        rowKey='id'
        loading={isLoading}
        pagination={{ pageSize: 6 }}
      />

      {selectedFinalRecord && (
        <RequestFinalDetail
          isVisible={finalModalVisible}
          onCancel={() => setFinalModalVisible(false)}
          onUpdate={() => {
            console.log('Update final record:', selectedFinalRecord)
            setFinalModalVisible(false)
          }}
          record={selectedFinalRecord}
          setStatus={(status: any) => setSelectedFinalRecord({ ...selectedFinalRecord, status })}
          refetch={refetch}
        />
      )}
    </div>
  )
}

export default RequestFinalValuation
