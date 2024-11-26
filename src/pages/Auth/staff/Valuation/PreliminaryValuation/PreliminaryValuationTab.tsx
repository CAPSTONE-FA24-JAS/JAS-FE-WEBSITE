import { EyeOutlined, FileTextOutlined } from '@ant-design/icons'
import { Button, Table, Tag, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetPreliminaryValuationsByStaffQuery } from '../../../../../services/valuation.services'
import { RootState } from '../../../../../store'
import PreliminaryValuationDetail from './PreliminaryDetail'
import CreateReceipt from './CreateReceipt'

const PreliminaryValuationTab = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [preliminaryData, setPreliminaryData] = useState<any[]>([])
  const staffId = useSelector((state: RootState) => state.authLoginAPI.staffId)

  const { data, error, isLoading, refetch } = useGetPreliminaryValuationsByStaffQuery({
    staffId: staffId || '',
    status: [3, 4, 5],
    pageSize: 10,
    pageIndex: 1
  })

  useEffect(() => {
    if (data && data.dataResponse) {
      const fetchedData = Array.isArray(data.dataResponse) ? data.dataResponse : [data.dataResponse]
      setPreliminaryData(fetchedData)
    }
  }, [data, error, isLoading])

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
      render: (text: any, record: any) => (
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
          {record.status === 'ApprovedPreliminary' && (
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
          )}
        </div>
      )
    }
  ]

  return (
    <div>
      <Table
        dataSource={preliminaryData}
        columns={preliminaryColumns}
        rowKey='id'
        bordered
        pagination={{ pageSize: 6 }}
      />

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
        />
      )}

      <CreateReceipt
        isVisible={confirmationVisible}
        onCancel={() => setConfirmationVisible(false)}
        onCreate={() => {
          console.log('Creating confirmation receipt for:', selectedRecord)
          setConfirmationVisible(false)
          refetch()
        }}
        record={selectedRecord}
        refetch={refetch}
      />
    </div>
  )
}

export default PreliminaryValuationTab
