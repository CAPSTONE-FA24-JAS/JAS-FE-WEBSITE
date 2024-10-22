import { Col, Input, Row, Tabs } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import PreliminaryValuationTab from './PreliminaryValuation/PreliminaryValuationTab'
import FinalValuationTab from './FinalValuation/FinalValuationTab'
import { useState } from 'react'

const { Search } = Input

const ValuationTabs = () => {
  const [searchText, setSearchText] = useState<string>('')

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

      <Tabs defaultActiveKey='1' items={tabItems} />
    </div>
  )
}

export default ValuationTabs
