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
