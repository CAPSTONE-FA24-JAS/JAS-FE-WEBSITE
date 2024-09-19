import { EyeOutlined, PlusOutlined, SearchOutlined, FilePdfOutlined } from '@ant-design/icons'
import { Button, Col, Input, Modal, Row, Table, Tabs, Tag } from 'antd'
import { useEffect, useState } from 'react'
import CreateReceipt from './CreateReceipt'
import PreliminaryValuationDetail from './PreliminaryDetail'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { useGetPreliminaryValuationsByStaffQuery } from '../../../../services/valuation.services'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'

const { Search } = Input

const ValuationTabs = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [preliminaryData, setPreliminaryData] = useState<any[]>([])

  const staffId = useSelector((state: RootState) => state.authLoginAPI.id)

  const { data, error, isLoading } = useGetPreliminaryValuationsByStaffQuery({
    staffId: staffId || '',
    pageSize: 10,
    pageIndex: 1
  })

  useEffect(() => {
    if (data && data.data) {
      const fetchedData = Array.isArray(data.data.dataResponse) ? data.data.dataResponse : [data.data.dataResponse]
      setPreliminaryData(fetchedData)
    }
  }, [data, error, isLoading])

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const filteredPreliminaryData = preliminaryData
    .filter((item) => item.status === 'Preliminary Valued')
    .filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))

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
      dataIndex: 'seller',
      key: 'seller',
      render: (seller: any) => (seller ? `${seller.firstName} ${seller.lastName}` : '')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => {
        let color = status === 'Receipted' ? 'blue' : 'green'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <div>
          <Button
            type='primary'
            icon={<EyeOutlined />}
            className='bg-blue-500 hover:bg-blue-600'
            onClick={() => {
              setSelectedRecord(record)
              setModalVisible(true)
            }}
          />
          <Button
            type='default'
            icon={<PlusOutlined />}
            className='ml-2'
            onClick={() => {
              setSelectedRecord(record)
              setConfirmationVisible(true)
            }}
          />
        </div>
      )
    }
  ]

  const tabItems = [
    {
      key: '1',
      label: 'Preliminary Valuation',
      children: (
        <Table
          dataSource={filteredPreliminaryData}
          columns={columns}
          rowKey='id'
          loading={isLoading}
          pagination={false}
        />
      )
    },
    {
      key: '2',
      label: 'Final Valuation',
      children: <Table dataSource={[]} columns={columns} rowKey='id' pagination={false} />
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

      <Tabs defaultActiveKey='1' items={tabItems} />

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
          tab='1'
        />
      )}

      <CreateReceipt
        isVisible={confirmationVisible}
        onCancel={() => setConfirmationVisible(false)}
        onCreate={() => {
          console.log('Creating confirmation receipt for:', selectedRecord)
          setConfirmationVisible(false)
        }}
        record={selectedRecord}
      />
    </div>
  )
}

export default ValuationTabs
