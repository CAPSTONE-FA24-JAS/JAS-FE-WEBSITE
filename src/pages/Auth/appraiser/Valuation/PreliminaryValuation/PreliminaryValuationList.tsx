import React, { useEffect, useState } from 'react'
import { Table, Button, Typography, Tag, Tooltip, Spin, Input } from 'antd'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import PreliminaryDetailsModal from './PreliminaryDetailModal'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../../store'
import { useGetPreliminaryValuationsByAppraiserQuery } from '../../../../../services/valuation.services'

const { Title } = Typography
const { Search } = Input // Import the Search component

const PreliminaryValuationList = () => {
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  const staffId = useSelector((state: RootState) => state.authLoginAPI.staffId)
  const [preliminaryData, setPreliminaryData] = useState<any[]>([])
  const [searchText, setSearchText] = useState<string>('')

  // Use the API query to fetch preliminary valuations
  const { data, error, isLoading } = useGetPreliminaryValuationsByAppraiserQuery({
    staffId: staffId || '',
    status: [3, 4, 5], // Adjust status codes as per your API requirements
    pageSize: 10,
    pageIndex: 1
  })

  // Handle modal display
  const showModal = (record: any) => {
    setCurrentRecord(record)
    setIsModalVisible(true)
  }

  const handleUpdate = () => {
    console.log('Update clicked for record:', currentRecord)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setCurrentRecord(null)
  }

  useEffect(() => {
    if (data && data.dataResponse) {
      const fetchedData = Array.isArray(data.dataResponse) ? data.dataResponse : [data.dataResponse]

      const filteredData = fetchedData.filter((item) =>
        ['RecivedJewelry', 'Preliminary', 'ApprovedPreliminary'].includes(item.status)
      )
      setPreliminaryData(filteredData)
    }
  }, [data, error, isLoading])

  const filteredPreliminaryData =
    preliminaryData?.filter((item) => {
      const sellerName = `${item.seller?.firstName || ''} ${item.seller?.lastName || ''}`.toLowerCase()
      return sellerName.includes(searchText.toLowerCase())
    }) || []

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

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
      render: (status: string) => {
        let color = 'green'
        let label = status

        if (status === 'Preliminary') {
          color = 'red'
        } else if (status === 'RecivedJewelry') {
          color = 'blue'
        } else if (status === 'ApprovedPreliminary') {
          color = 'green'
        }

        return <Tag color={color}>{label}</Tag>
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <div>
          <Button type='link' icon={<EyeOutlined />} onClick={() => showModal(record)} />

          {record.status === 'RecivedJewelry' && (
            <Tooltip title='Create Final Valuation'>
              <Button
                type='default'
                icon={<PlusOutlined />}
                className='ml-2'
                onClick={() => {
                  navigate(`/appraiser/createFinal/${record.id}`) // Use record.id as the valuationId
                }}
              />
            </Tooltip>
          )}
        </div>
      )
    }
  ]

  if (isLoading) return <Spin tip='Loading...' />

  if (error) {
    return <div>Error loading preliminary valuations.</div>
  }

  return (
    <div className='p-6'>
      <Title level={3} className='mb-6'>
        Preliminary Valuation List
      </Title>
      <div className='mb-4' style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Search
          placeholder='Search by customer name'
          enterButton
          onSearch={handleSearch}
          style={{ width: 300 }} // You can adjust the width as needed
        />
      </div>
      <Table dataSource={filteredPreliminaryData} columns={columns} rowKey='id' />
      <PreliminaryDetailsModal
        isVisible={isModalVisible}
        onUpdate={handleUpdate}
        onCancel={handleCancel}
        record={currentRecord}
      />
    </div>
  )
}

export default PreliminaryValuationList
