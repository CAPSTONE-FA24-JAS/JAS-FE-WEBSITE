import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Table, Tag, Tooltip, Typography } from 'antd'
import type { Key } from 'antd/es/table/interface'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useViewCompanyTransactionsQuery } from '../../../../services/overview.services'
import { parsePriceVND } from '../../../../utils/convertTypeDayjs'

const { Text } = Typography

interface Transaction {
  transactionType: string
  amount: number
  transactionTime: string | null
  customerName: string
}

function TransactionsComponent() {
  const { data, error, isLoading } = useViewCompanyTransactionsQuery(undefined)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (data?.data) {
      setTransactions([...data.data])
    }
  }, [data])

  if (isLoading) return <p className='py-4 text-lg text-center'>Loading transactions...</p>
  if (error) return <p className='py-4 text-lg text-center text-red-500'>Error loading transactions.</p>

  const transactionTypes = [
    { text: 'AddWallet', value: 'AddWallet' },
    { text: 'WithDrawWallet', value: 'WithDrawWallet' },
    { text: 'DepositWallet', value: 'DepositWallet' },
    { text: 'RefundDeposit', value: 'RefundDeposit' },
    { text: 'BuyPay', value: 'BuyPay' },
    { text: 'SellerPay', value: 'SellerPay' },
    { text: 'Banktransfer', value: 'Banktransfer' },
    { text: 'RefundInvoice', value: 'RefundInvoice' }
  ]

  const columns = [
    {
      title: 'Transaction Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
      width: '25%',
      align: 'center' as 'left' | 'right' | 'center',
      filters: transactionTypes,
      onFilter: (value: Key | boolean, record: Transaction) => record.transactionType === value,
      render: (type: string) => {
        const isGreen = ['AddWallet', 'DepositWallet', 'BuyPay', 'Banktransfer'].includes(type)
        const color = isGreen ? 'green' : 'red'
        const icon = isGreen ? <ArrowUpOutlined /> : <ArrowDownOutlined />
        return (
          <Tag color={color} icon={icon}>
            {type}
          </Tag>
        )
      }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '25%',
      align: 'center' as 'left' | 'right' | 'center',
      render: (amount: number, record: Transaction) => {
        const isGreen = ['AddWallet', 'DepositWallet', 'BuyPay', 'Banktransfer'].includes(record.transactionType)
        const formattedAmount = parsePriceVND(amount)
        return (
          <Text className={`font-semibold ${isGreen ? 'text-green-600' : 'text-red-600'}`}>
            {isGreen ? formattedAmount : `-${formattedAmount}`}
          </Text>
        )
      }
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      width: '25%',
      align: 'center' as 'left' | 'right' | 'center',
      render: (customerName: string) => (
        <Text strong>{customerName}</Text>
      )
    },
    {
      title: 'Transaction Time',
      dataIndex: 'transactionTime',
      key: 'transactionTime',
      width: '25%',
      align: 'center' as 'left' | 'right' | 'center',
      render: (time: string | null) => (
        <Tooltip title={time ? moment(time).format('LLLL') : 'N/A'}>
          {time ? moment(time).format('YYYY-MM-DD HH:mm') : 'N/A'}
        </Tooltip>
      )
    }
  ]

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOrder = e.target.value
    const sortedTransactions = [...transactions].sort((a, b) => {
      if (!a.transactionTime || !b.transactionTime) return 0
      return sortOrder === 'desc'
        ? new Date(a.transactionTime).getTime() - new Date(b.transactionTime).getTime()
        : new Date(b.transactionTime).getTime() - new Date(a.transactionTime).getTime()
    })
    setTransactions(sortedTransactions)
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>Transaction History</h2>
        <select onChange={handleSortChange} className='border p-2 rounded'>
          <option value='desc'>Sort by Time: Newest</option>
          <option value='asc'>Sort by Time: Oldest</option>
        </select>
      </div>
      <Table
        columns={columns}
        dataSource={transactions.slice().reverse()}
        rowKey={(record) => record.transactionTime || String(record.amount)}
        bordered
        pagination={{
          pageSize: 8,
          showSizeChanger: true
        }}
        className='border rounded-lg'
        rowClassName={(record) => (['AddWallet', 'DepositWallet', 'BuyPay', 'Banktransfer'].includes(record.transactionType) ? 'bg-green-50' : 'bg-red-50')}
        scroll={{ x: true }}
      />
    </div>
  )
}

export default TransactionsComponent
