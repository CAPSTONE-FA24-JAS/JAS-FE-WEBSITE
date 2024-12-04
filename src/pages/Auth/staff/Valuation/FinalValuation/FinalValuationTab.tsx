import { EyeOutlined } from '@ant-design/icons'
import { Button, Table, Tag, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetFinalValuationsOfStaffQuery } from '../../../../../services/valuation.services'
import { RootState } from '../../../../../store'
import FinalDetail from './FinalDetail'

import { useLocation } from 'react-router-dom'

// FinalValuationTab component
const FinalValuationTab = () => {
  const location = useLocation()

  // Extract recordId from URL
  const queryParams = new URLSearchParams(location.search)
  const recordId = queryParams.get('recordId')
  const [finalModalVisible, setFinalModalVisible] = useState<boolean>(false)
  const [selectedFinalRecord, setSelectedFinalRecord] = useState<any>(null)

  const staffId = useSelector((state: RootState) => state.authLoginAPI.staffId)

  const { data, error, isLoading } = useGetFinalValuationsOfStaffQuery({
    staffId: staffId || 0,
    pageSize: 10,
    pageIndex: 1
  })

  const finalValuationData = data?.dataResponse || []
  useEffect(() => {
    if (recordId) {
      const foundRecord = finalValuationData.find((item: any) => item.id === Number(recordId))
      if (foundRecord) {
        setSelectedFinalRecord(foundRecord)
        setFinalModalVisible(true)
      }
    }
  }, [recordId, finalValuationData])
  const finalColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Jewelry Name',
      dataIndex: 'jewelry',
      key: 'jewelry',
      render: (jewelry: any) => (jewelry ? jewelry.name : '')
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

        if (status === 'FinalValuated') {
          color = 'red'
        } else if (status === 'ManagerApproved') {
          color = 'blue'
        } else if (status === 'Authorized') {
          color = 'green'
        }

        return <Tag color={color}>{label}</Tag>
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

  // Use recordId from URL to set selectedFinalRecord
  useEffect(() => {
    const recordId = queryParams.get('recordId')
    if (recordId) {
      const record = finalValuationData.find((item: any) => item.id === recordId)
      if (record) {
        setSelectedFinalRecord(record)
        setFinalModalVisible(true)
      }
    }
  }, [location.search, finalValuationData])

  return (
    <div>
      {error && <p>Error fetching final valuations</p>}
      <Table
        dataSource={finalValuationData}
        columns={finalColumns}
        rowKey='id'
        loading={isLoading}
        bordered
        pagination={{ pageSize: 6 }}
      />

      {selectedFinalRecord && (
        <FinalDetail
          isVisible={finalModalVisible}
          onCancel={() => setFinalModalVisible(false)}
          onUpdate={() => {
            console.log('Update final record:', selectedFinalRecord)
            setFinalModalVisible(false)
          }}
          record={selectedFinalRecord}
          setStatus={(status: any) => setSelectedFinalRecord({ ...selectedFinalRecord, status })}
        />
      )}
    </div>
  )
}

export default FinalValuationTab
