import React, { useState } from 'react'
import { Table, Button, Typography, Tag, Tooltip } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import FinalDetailModal from './FinalDetailModal'
import { RootState } from '../../../../../../store'
import { useSelector } from 'react-redux'
import { useGetFinalValuationsOfAppraiserQuery } from '../../../../../../services/valuation.services'
const { Title } = Typography
const FinalValuationList = () => {
  const [finalModalVisible, setFinalModalVisible] = useState<boolean>(false)
  const [selectedFinalRecord, setSelectedFinalRecord] = useState<any>(null)
  const appraiserId = useSelector((state: RootState) => state.authLoginAPI.staffId)

  const { data, error, isLoading } = useGetFinalValuationsOfAppraiserQuery({
    appraiserId: appraiserId || 0,
    pageSize: 10,
    pageIndex: 1
  })

  const finalValuationData = data?.dataResponse || []

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
      render: (text: any, record: any) => (
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

  return (
    <div className='p-6'>
      <Title level={3} className='mb-6'>
        Final Valuation List
      </Title>
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
          <FinalDetailModal
            isVisible={finalModalVisible}
            onCancel={() => setFinalModalVisible(false)}
            onUpdate={() => {
              console.log('Update final record:', selectedFinalRecord)
              setFinalModalVisible(false)
            }}
            record={selectedFinalRecord}
            // status={selectedFinalRecord.status}
            setStatus={(status: any) => setSelectedFinalRecord({ ...selectedFinalRecord, status })}
          />
        )}
      </div>
    </div>
  )
}

export default FinalValuationList
