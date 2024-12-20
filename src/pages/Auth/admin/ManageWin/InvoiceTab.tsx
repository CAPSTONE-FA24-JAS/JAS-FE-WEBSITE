import { EyeOutlined } from '@ant-design/icons'
import { Avatar, Button, Table, Tabs, Tag, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGetInvoicesForManagerQuery } from '../../../../services/invoice.services'
import ManageWinList from './AssignDelivery/ManageWinList'
import BillInVoiceList from './CheckBillInVoice/BillInvoiveList'
import ManageInvoiceModal from './ManageInvoiceModal'

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

export default function InvoiceTab() {
  const { data, error, isLoading, refetch } = useGetInvoicesForManagerQuery({ pageSize: 10, pageIndex: 1 })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null)
  const [_status, setStatus] = useState<string>('')
  const [_activeTabKey, setActiveTabKey] = useState<string>('1')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const recordId = queryParams.get('recordId')
    const tab = queryParams.get('tab') || '1'

    if (recordId) {
      setSelectedInvoiceId(parseInt(recordId))
      setIsModalVisible(true)
    }

    setActiveTabKey(tab)
  }, [location.search])

  const showDetails = (record: Invoice) => {
    if (record.id) {
      setSelectedInvoiceId(record.id)
      setIsModalVisible(true)
    } else {
      console.error('Invoice ID is null or undefined')
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setSelectedInvoiceId(null)
    navigate('/manager/manageinvoice', { replace: true })
  }

  const filteredData = data?.data?.dataResponse || []
  const allowedStatuses = [
    'CreateInvoice',
    'PendingPayment',
    'Paid',
    'Delivering',
    'Delivered',
    'Rejected',
    'Finished',
    'Refunded',
    'Cancelled',
    'Closed'
  ]

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
      render: (price: number | null) =>
        price !== null && price !== undefined ? `${price.toLocaleString()} VND` : 'N/A'
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
      render: (record: Invoice) => (
        <Tooltip title='View Details'>
          <Button type='link' icon={<EyeOutlined />} onClick={() => showDetails(record)} />
        </Tooltip>
      )
    }
  ]

  const allowedData = filteredData.filter((invoice: Invoice) => allowedStatuses.includes(invoice.status)) as Invoice[]
  const createInvoices = allowedData.filter((invoice: Invoice) => invoice.status === 'CreateInvoice')
  const deliveringInvoices = allowedData.filter((invoice: Invoice) => invoice.status === 'Delivering')
  const deliveredInvoices = allowedData.filter((invoice: Invoice) => invoice.status === 'Delivered')
  const rejectedInvoices = allowedData.filter((invoice: Invoice) => invoice.status === 'Rejected')
  const finishedInvoices = allowedData.filter((invoice: Invoice) => invoice.status === 'Finished')
  const refundedInvoices = allowedData.filter((invoice: Invoice) => invoice.status === 'Refunded')
  const cancelledInvoices = allowedData.filter((invoice: Invoice) => invoice.status === 'Cancelled')
  const closedInvoices = allowedData.filter((invoice: Invoice) => invoice.status === 'Closed')
  const tabItems = [
    {
      key: '1',
      label: 'All Invoices',
      children: (
        <div>
          <h2 className='mb-4 text-lg font-semibold'></h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error loading data</p>
          ) : (
            <Table columns={columns} dataSource={allowedData} bordered pagination={{ pageSize: 5 }} rowKey='id' />
          )}

          {selectedInvoiceId && (
            <ManageInvoiceModal
              visible={isModalVisible}
              onCancel={handleCancel}
              invoiceId={selectedInvoiceId}
              setStatus={setStatus}
              refetch={refetch}
            />
          )}
        </div>
      )
    },
    {
      key: '2',
      label: 'Create Invoice',
      children: (
        <Table columns={columns} dataSource={createInvoices} bordered pagination={{ pageSize: 5 }} rowKey='id' />
      )
    },
    {
      key: '3',
      label: 'Pending Payment',
      children: <BillInVoiceList />
    },
    {
      key: '4',
      label: 'Paid',
      children: <ManageWinList />
    },
    {
      key: '5',
      label: 'Delivering',
      children: (
        <Table columns={columns} dataSource={deliveringInvoices} bordered pagination={{ pageSize: 5 }} rowKey='id' />
      )
    },
    {
      key: '6',
      label: 'Delivered',
      children: (
        <Table columns={columns} dataSource={deliveredInvoices} bordered pagination={{ pageSize: 5 }} rowKey='id' />
      )
    },
    {
      key: '7',
      label: 'Rejected',
      children: (
        <Table columns={columns} dataSource={rejectedInvoices} bordered pagination={{ pageSize: 5 }} rowKey='id' />
      )
    },
    {
      key: '8',
      label: 'Finished',
      children: (
        <Table columns={columns} dataSource={finishedInvoices} bordered pagination={{ pageSize: 5 }} rowKey='id' />
      )
    },
    {
      key: '9',
      label: 'Refunded',
      children: (
        <Table columns={columns} dataSource={refundedInvoices} bordered pagination={{ pageSize: 5 }} rowKey='id' />
      )
    },
    {
      key: '10',
      label: 'Cancelled',
      children: (
        <Table columns={columns} dataSource={cancelledInvoices} bordered pagination={{ pageSize: 5 }} rowKey='id' />
      )
    },
    {
      key: '11',
      label: 'Closed',
      children: (
        <Table columns={columns} dataSource={closedInvoices} bordered pagination={{ pageSize: 5 }} rowKey='id' />
      )
    }
  ]

  return (
    <div className='p-6 invoice-tab-container'>
      <h1 className='mb-4 text-2xl font-bold'>Invoice Management</h1>
      <Tabs defaultActiveKey='1' items={tabItems} />
    </div>
  )
}
