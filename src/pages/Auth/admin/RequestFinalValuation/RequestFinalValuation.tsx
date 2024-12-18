import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Col, Input, Row, Space, Table, Tabs, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGetValuationsQuery } from '../../../../services/valuation.services'
import ManageValuationDetail from './ManageValuationDetail'
import RequestFinalDetail from './RequestFinalDetail'

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
const { TabPane } = Tabs

const RequestFinalValuation = () => {
  const [selectedFinalRecord, setSelectedFinalRecord] = useState<Valuation | null>(null)
  const [selectedValuationRecord, setSelectedValuationRecord] = useState<Valuation | null>(null)
  const [searchText, setSearchText] = useState<string>('')
  const location = useLocation()
  const navigate = useNavigate()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const { data, refetch } = useGetValuationsQuery()

  const finalValuationData: Valuation[] =
    data?.dataResponse?.filter((valuation: Valuation) =>
      [
        'Requested',
        'Assigned',
        'RequestedPreliminary',
        'Preliminary',
        'ApprovedPreliminary',
        'RecivedJewelry',
        'Evaluated',
        'ManagerApproved',
        'Authorized',
        'Rejected'
      ].includes(valuation.status)
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
      title: 'Consign Name',
      dataIndex: 'name',
      key: 'consignName'
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

        if (status === 'Evaluated') {
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
              setSelectedValuationRecord(record)
              setSelectedFinalRecord(record)
            }}
          />
        </Space>
      )
    }
  ]

  const statusList = [
    { key: 'Requested', label: 'Requested' },
    { key: 'Assigned', label: 'Assigned' },
    { key: 'RequestedPreliminary', label: 'Requested Preliminary' },
    { key: 'Preliminary', label: 'Preliminary' },
    { key: 'ApprovedPreliminary', label: 'Approved Preliminary' },
    { key: 'RecivedJewelry', label: 'Received Jewelry' },
    { key: 'Evaluated', label: 'Evaluated' },
    { key: 'ManagerApproved', label: 'Manager Approved' },
    { key: 'Authorized', label: 'Authorized' },
    { key: 'Rejected', label: 'Rejected' }
  ]

  return (
    <div className='p-4'>
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

      <Tabs defaultActiveKey='Evaluated'>
        {statusList.map((status) => (
          <TabPane tab={status.label} key={status.key}>
            <Table<Valuation>
              dataSource={finalValuationData.filter(
                (item) => item.status === status.key && item.name.toLowerCase().includes(searchText.toLowerCase())
              )}
              columns={finalColumns}
              rowKey='id'
              bordered
              pagination={{ pageSize: 6 }}
            />
          </TabPane>
        ))}
      </Tabs>

      {selectedFinalRecord &&
        ['Evaluated', 'ManagerApproved', 'Authorized', 'Rejected'].includes(selectedFinalRecord.status) && (
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
      {selectedValuationRecord &&
        [
          'Requested',
          'Assigned',
          'RequestedPreliminary',
          'Preliminary',
          'ApprovedPreliminary',
          'RecivedJewelry'
        ].includes(selectedValuationRecord.status) && (
          <div className='mt-4'>
            <ManageValuationDetail
              recordId={selectedValuationRecord.id}
              isVisible={true}
              setStatus={(status) => {
                console.log(status)
              }}
              refetch={refetch}
              onCancel={() => {
                setModalVisible(false)
                setSelectedValuationRecord(null)
              }}
            />
          </div>
        )}
    </div>
  )
}

export default RequestFinalValuation
