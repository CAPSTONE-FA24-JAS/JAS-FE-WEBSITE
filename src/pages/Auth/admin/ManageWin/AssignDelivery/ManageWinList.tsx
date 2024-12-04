import { DeliveredProcedureOutlined, EyeOutlined } from '@ant-design/icons' // Import the required icons
import { Avatar, Button, Table, Tag, Tooltip } from 'antd' // Import Tooltip
import { useState } from 'react'
import { useGetInvoicesForManagerQuery } from '../../../../../services/invoice.services'
import ManageInvoiceModal from '../ManageInvoiceModal'
import AssignDelivererModal from './modal/AssignDelivererModal' // Import the new modal

// Define the structure of the data returned by the API
interface LotDTO {
  id: number
  title: string
  imageLinkJewelry: string
}

interface MyBidDTO {
  id: number
  lotDTO: LotDTO
}

export interface Invoice {
  id: number
  status: string
  totalPrice: number
  myBidDTO: MyBidDTO
}

export default function ManageWinList() {
  const { data, error, isLoading, refetch } = useGetInvoicesForManagerQuery({ pageSize: 10, pageIndex: 1 })
  const [status, setStatus] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null)
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false)

  const showDetails = (record: Invoice) => {
    // Check if record has a valid id
    if (record.id) {
      setSelectedInvoiceId(record.id)
      setIsModalVisible(true)
    } else {
      console.error('Invoice ID is null or undefined')
    }
  }

  const handleAssignDeliverer = (record: Invoice) => {
    if (record.id) {
      setSelectedInvoiceId(record.id)
      setStatus(record.status || '')
      setIsAssignModalVisible(true)
    } else {
      console.error('Invoice ID is null or undefined')
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setSelectedInvoiceId(null) // Ensure that ID is reset after modal is closed
  }

  const handleAssignCancel = () => {
    setIsAssignModalVisible(false)
    setSelectedInvoiceId(null)
  }

  const allowedStatuses = ['Paid']

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Image',
      dataIndex: ['myBidDTO', 'lotDTO', 'imageLinkJewelry'],
      key: 'imageLinkJewelry',
      render: (imageLink: string) => <Avatar src={imageLink} />
    },
    {
      title: 'Title',
      dataIndex: ['myBidDTO', 'lotDTO', 'title'],
      key: 'title'
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => `₫${price.toLocaleString()}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Delivering' ? 'green' : 'volcano'}>{status}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_text: any, record: Invoice) => (
        <div>
          <Tooltip title='View Details'>
            <Button type='link' icon={<EyeOutlined />} onClick={() => showDetails(record)} />
          </Tooltip>
          {record.status === 'Paid' && (
            <Tooltip title='Assign Deliverer'>
              <Button type='link' icon={<DeliveredProcedureOutlined />} onClick={() => handleAssignDeliverer(record)} />
            </Tooltip>
          )}
        </div>
      )
    }
  ]

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading data</p>

  const filteredData = data?.data?.dataResponse.filter((invoice: Invoice) =>
    allowedStatuses.includes(invoice.status)
  ) as Invoice[]

  return (
    <div className='p-2'>
      <Table columns={columns} dataSource={filteredData} bordered pagination={{ pageSize: 5 }} rowKey='id' />

      {selectedInvoiceId && (
        <ManageInvoiceModal
          visible={isModalVisible}
          onCancel={handleCancel}
          invoiceId={selectedInvoiceId}
          refetch={refetch}
          setStatus={setStatus}
        />
      )}

      {selectedInvoiceId && (
        <AssignDelivererModal
          visible={isAssignModalVisible}
          onCancel={handleAssignCancel}
          status={status}
          invoiceId={selectedInvoiceId} // Pass the selected invoice ID
          setStatus={setStatus}
          refetch={refetch}
        />
      )}
    </div>
  )
}
