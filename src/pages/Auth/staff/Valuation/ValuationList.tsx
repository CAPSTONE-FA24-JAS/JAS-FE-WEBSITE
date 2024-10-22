
import { Col, Input, Row, Tabs } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import PreliminaryValuationTab from './PreliminaryValuation/PreliminaryValuationTab'
import FinalValuationTab from './FinalValuation/FinalValuationTab'
import { useState } from 'react'

import { EyeOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Col, Input, Row, Table, Tabs, Tag, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import { useSelector } from 'react-redux'
import { useGetPreliminaryValuationsByStaffQuery } from '../../../../services/valuation.services'
import { RootState } from '../../../../store'
import CreateReceipt from './PreliminaryValuation/CreateReceipt'
import PreliminaryValuationDetail from './PreliminaryValuation/PreliminaryDetail'
import FinalDetail from './FinalValuation/FinalDetail'


const { Search } = Input

const ValuationTabs = () => {
  const [searchText, setSearchText] = useState<string>('')

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const preliminaryColumns = [
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
        let color = 'green'
        if (status === 3) color = 'orange'
        else if (status === 4) color = 'blue'
        else if (status === 5) color = 'red'

        return <Tag color={color}>{`Status ${status}`}</Tag>
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_text: any, record: any) => (
        <div>
          <Tooltip title='View Details'>
            <Button
              type='primary'
              icon={<EyeOutlined />}
              className='bg-blue-500 hover:bg-blue-600'
              onClick={() => {
                setSelectedRecord(record)
                setModalVisible(true)
              }}
            />
          </Tooltip>
          <Tooltip title='Create Receipt'>
            <Button
              type='default'
              icon={<FileTextOutlined />}
              className='ml-2'
              onClick={() => {
                setSelectedRecord(record)
                setConfirmationVisible(true)
              }}
            />
          </Tooltip>
        </div>
      )
    }
  ]

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
      render: (seller: any) => (seller ? `${seller.firstName} ${seller.lastName}` : '')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => {
        let color = status === 'Completed' ? 'green' : status === 'Pending' ? 'orange' : 'red'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_text: any, record: any) => (
        <div>
          <Tooltip title='View Final Details'>
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
