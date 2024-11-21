import React, { useState } from 'react'
import { Tabs, Table, Avatar, Tag, Button, Tooltip } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import BillInVoiceList from './CheckBillInVoice/BillInvoiveList'
import ManageWinList from './AssignDelivery/ManageWinList'
import { useGetInvoicesForManagerQuery } from '../../../../services/invoice.services'
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
  const [status, setStatus] = useState<string>('')

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
  }

  const filteredData = data?.data?.dataResponse || []
  const allowedStatuses = ['PendingPayment', 'Paid', 'Delivering', 'Delivered', 'Rejected', 'Finished']

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
      render: (price: number) => `${price.toLocaleString()}VND`
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
        <Tooltip title='View Details'>
          <Button type='link' icon={<EyeOutlined />} onClick={() => showDetails(record)} />
        </Tooltip>
      )
    }
  ]

  const allowedData = filteredData.filter((invoice: Invoice) => allowedStatuses.includes(invoice.status)) as Invoice[]
  const deliveringInvoices = allowedData.filter((invoice: Invoice) => invoice.status === 'Delivering')
  const deliveredInvoices = allowedData.filter((invoice: Invoice) => invoice.status === 'Delivered')
  const rejectedInvoices = allowedData.filter((invoice: Invoice) => invoice.status === 'Rejected')
  const finishedInvoices = allowedData.filter((invoice: Invoice) => invoice.status === 'Finished')
  const tabItems = [
    {
      key: '1',
      label: 'All Invoices',
      children: (
        <div>
          <h2 className='text-lg font-semibold mb-4'></h2>
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
      label: 'Pending Payment',
      children: <BillInVoiceList />
    },
    {
      key: '3',
      label: 'Paid',
      children: <ManageWinList />
    },
    {
      key: '4',
      label: 'Delivering',
      children: (
        <Table columns={columns} dataSource={deliveringInvoices} bordered pagination={{ pageSize: 5 }} rowKey='id' />
      )
    },
    {
      key: '5',
      label: 'Delivered',
      children: (
        <Table columns={columns} dataSource={deliveredInvoices} bordered pagination={{ pageSize: 5 }} rowKey='id' />
      )
    },
    {
      key: '6',
      label: 'Rejected',
      children: (
        <Table columns={columns} dataSource={rejectedInvoices} bordered pagination={{ pageSize: 5 }} rowKey='id' />
      )
    },
    {
      key: '7',
      label: 'Finished',
      children: (
        <Table columns={columns} dataSource={finishedInvoices} bordered pagination={{ pageSize: 5 }} rowKey='id' />
      )
    }
  ]

  return (
    <div className='invoice-tab-container p-6'>
      <h1 className='text-2xl font-bold mb-4'>Invoice Management</h1>
      <Tabs defaultActiveKey='1' items={tabItems} />
    </div>
  )
}
