// ValuationTabs.tsx
import { EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Col, Input, Row, Table, Tabs, Tag } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PreliminaryValuationDetail from './PreliminaryDetail'

const { Search } = Input
const { TabPane } = Tabs

const preliminaryData = [
  {
    id: '1',
    valuationName: 'Diamond Ring',
    customerName: 'John Doe',
    contact: 'john@example.com',
    status: 'Approve',
    initialPrice: 5000
  },
  {
    id: '2',
    valuationName: 'Gold Necklace',
    customerName: 'Jane Smith',
    contact: 'jane@example.com',
    status: 'Pending',
    initialPrice: 3000 // Added field for initial price
  }
]

const finalData = [
  {
    id: '3',
    valuationName: 'Silver Bracelet',
    customerName: 'Michael Johnson',
    contact: 'michael@example.com',
    status: 'Reject',
    initialPrice: 1500 // Added field for initial price
  }
]

const ValuationTabs = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [currentTab, setCurrentTab] = useState<string>('1') // Track current tab
  const navigate = useNavigate() // Initialize the navigate hook

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const filteredPreliminaryData = preliminaryData.filter((item) =>
    item.valuationName.toLowerCase().includes(searchText.toLowerCase())
  )

  const filteredFinalData = finalData.filter((item) =>
    item.valuationName.toLowerCase().includes(searchText.toLowerCase())
  )

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
      render: (status: any) => {
        let color = status === 'Approve' ? 'green' : status === 'Reject' ? 'red' : 'gray'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      }
    },
    {
      title: 'More',
      key: 'more',
      render: (text: any, record: any) => (
        <Button
          type='primary'
          icon={<EyeOutlined />}
          className='bg-blue-500 hover:bg-blue-600'
          onClick={() => {
            // Show the detail modal
            setSelectedRecord(record)
            setModalVisible(true)
          }}
        >
          View
        </Button>
      )
    }
  ]

  return (
    <div className='p-4'>
      <Row justify='space-between' align='middle' className='mb-4'>
        <Col>
          <h2 className='text-2xl font-bold'>Valuation List</h2>
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
      <Tabs defaultActiveKey='1' onChange={(key) => setCurrentTab(key)}>
        <TabPane tab='Preliminary Valuation' key='1'>
          <Table dataSource={filteredPreliminaryData} columns={columns} rowKey='id' />
        </TabPane>
        <TabPane tab='Final Valuation' key='2'>
          <Table dataSource={filteredFinalData} columns={columns} rowKey='id' />
        </TabPane>
      </Tabs>

      {selectedRecord && (
        <PreliminaryValuationDetail
          isVisible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onUpdate={() => {
            console.log('Update record:', selectedRecord)
            setModalVisible(false)
          }}
          record={selectedRecord}
          status={selectedRecord.status}
          setStatus={(status: any) => setSelectedRecord({ ...selectedRecord, status })}
          tab={currentTab}
        />
      )}
    </div>
  )
}

export default ValuationTabs
