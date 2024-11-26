import { SearchOutlined } from '@ant-design/icons'
import { Col, Input, Row, Tabs } from 'antd'
import { useEffect, useState } from 'react'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import { useLocation } from 'react-router-dom'
import FinalValuationTab from './FinalValuation/FinalValuationTab'
import PreliminaryValuationTab from './PreliminaryValuation/PreliminaryValuationTab'

const { Search } = Input

const ValuationTabs = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const [activeTabKey, setActiveTabKey] = useState<string>('1')

  useEffect(() => {
    const tabKey = queryParams.get('tab') || '1'
    const modalVisible = queryParams.get('modal') === 'true'
    const recordId = queryParams.get('recordId')

    setActiveTabKey(tabKey)

    // Open modal in FinalValuationTab if tab 2 and modal=true are present in the URL
    if (tabKey === '2' && modalVisible && recordId) {
      setSelectedFinalRecord({ id: recordId }) // Mock record, retrieve actual record if needed
      setFinalModalVisible(true)
    }
  }, [location.search])

  const [_searchText, setSearchText] = useState<string>('')
  const [_selectedRecord, _setSelectedRecord] = useState<any>(null)
  const [_selectedRecord1, _setSelectedRecord1] = useState<any>(null)
  const [_selectedFinalRecord, setSelectedFinalRecord] = useState<any>(null)
  const [_confirmationVisible, _setConfirmationVisible] = useState<boolean>(false)
  const [_modalVisible, _setModalVisible] = useState<boolean>(false)
  const [_finalModalVisible, setFinalModalVisible] = useState<boolean>(false)

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  // const preliminaryColumns = [
  //   {
  //     title: 'ID',
  //     dataIndex: 'id',
  //     key: 'id'
  //   },
  //   {
  //     title: 'Valuation Name',
  //     dataIndex: 'name',
  //     key: 'name'
  //   },
  //   {
  //     title: 'Customer Name',
  //     dataIndex: 'seller',
  //     key: 'seller',
  //     render: (seller: any) => (seller ? `${seller.firstName} ${seller.lastName}` : '')
  //   },
  //   {
  //     title: 'Status',
  //     dataIndex: 'status',
  //     key: 'status',
  //     render: (status: any) => {
  //       let color = 'green'
  //       if (status === 3) color = 'orange'
  //       else if (status === 4) color = 'blue'
  //       else if (status === 5) color = 'red'

  //       return <Tag color={color}>{`Status ${status}`}</Tag>
  //     }
  //   },
  //   {
  //     title: 'Actions',
  //     key: 'actions',
  //     render: (_text: any, record: any) => (
  //       <div>
  //         <Tooltip title='View Details'>
  //           <Button
  //             type='primary'
  //             icon={<EyeOutlined />}
  //             className='bg-blue-500 hover:bg-blue-600'
  //             onClick={() => {
  //               setSelectedRecord1(record)
  //               setModalVisible(true)
  //             }}
  //           />
  //         </Tooltip>
  //         <Tooltip title='Create Receipt'>
  //           <Button
  //             type='default'
  //             icon={<FileTextOutlined />}
  //             className='ml-2'
  //             onClick={() => {
  //               setSelectedRecord(record)
  //               setConfirmationVisible(true)
  //             }}
  //           />
  //         </Tooltip>
  //       </div>
  //     )
  //   }
  // ]

  // const _finalColumns = [
  //   {
  //     title: 'ID',
  //     dataIndex: 'id',
  //     key: 'id'
  //   },
  //   {
  //     title: 'Valuation Name',
  //     dataIndex: 'name',
  //     key: 'name'
  //   },
  //   {
  //     title: 'Customer Name',
  //     dataIndex: 'seller',
  //     key: 'seller',
  //     render: (seller: any) => (seller ? `${seller.firstName} ${seller.lastName}` : '')
  //   },
  //   {
  //     title: 'Status',
  //     dataIndex: 'status',
  //     key: 'status',
  //     render: (status: any) => {
  //       let color = status === 'Completed' ? 'green' : status === 'Pending' ? 'orange' : 'red'
  //       return <Tag color={color}>{status.toUpperCase()}</Tag>
  //     }
  //   },
  //   {
  //     title: 'Actions',
  //     key: 'actions',
  //     render: (_text: any, record: any) => (
  //       <div>
  //         <Tooltip title='View Final Details'>
  //           <Button
  //             type='primary'
  //             icon={<EyeOutlined />}
  //             className='bg-blue-500 hover:bg-blue-600'
  //             onClick={() => {
  //               setSelectedFinalRecord(record)
  //               setFinalModalVisible(true)
  //             }}
  //           />
  //         </Tooltip>
  //       </div>
  //     )
  //   }
  // ]

  const tabItems = [
    {
      key: '1',
      label: 'Preliminary Valuation',
      children: <PreliminaryValuationTab />
    },
    {
      key: '2',
      label: 'Final Valuation',
      children: <FinalValuationTab />
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

      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} items={tabItems} />
    </div>
  )
}

export default ValuationTabs
