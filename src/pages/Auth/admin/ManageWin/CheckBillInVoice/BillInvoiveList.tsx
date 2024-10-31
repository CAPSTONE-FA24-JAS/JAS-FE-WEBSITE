import { DeliveredProcedureOutlined, EyeOutlined } from '@ant-design/icons'
import { Avatar, Button, Table, Tag, Tooltip } from 'antd'
import { useState } from 'react'
import { useGetInvoicesForManagerQuery } from '../../../../../services/invoice.services'
import BillInvoiceModal from './modal/BillInvoiceModal'

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

export default function BillInVoiceList() {
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
    setSelectedInvoiceId(null)
  }

  const handleAssignCancel = () => {
    setIsAssignModalVisible(false)
    setSelectedInvoiceId(null)
  }

  const allowedStatuses = ['CreateInvoice', 'PendingPayment', 'Paid']

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
      render: (text: any, record: Invoice) => (
        <div>
          <Tooltip title='View Details'>
            <Button type='link' icon={<EyeOutlined />} onClick={() => showDetails(record)} />
          </Tooltip>
        </div>
      )
    }
  ]

  const filteredData = data?.data?.dataResponse.filter((invoice: Invoice) =>
    allowedStatuses.includes(invoice.status)
  ) as Invoice[]

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Check Invoice</h1>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} rowKey='id' />

      {/* Only show modal if selectedInvoiceId is not null */}
      {selectedInvoiceId && (
        <BillInvoiceModal
          visible={isModalVisible}
          onCancel={handleCancel}
          invoiceId={selectedInvoiceId} // Pass the selected invoice ID
          refetch={refetch}
          setStatus={setStatus}
        />
      )}
    </div>
  )
}
