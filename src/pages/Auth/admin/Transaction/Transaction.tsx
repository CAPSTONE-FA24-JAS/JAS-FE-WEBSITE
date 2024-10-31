import React from 'react'
import { useViewCompanyTransactionsQuery } from '../../../../services/overview.services'
import { Table, Tag, Typography } from 'antd'
import moment from 'moment'
import type { Key } from 'antd/es/table/interface' // Import Key type

const { Text } = Typography

interface Transaction {
  transactionType: string
  amount: number
  transactionTime: string | null
}

function TransactionsComponent() {
  const { data, error, isLoading } = useViewCompanyTransactionsQuery(undefined)

  if (isLoading) return <p className='text-center text-lg py-4'>Loading transactions...</p>
  if (error) return <p className='text-center text-lg text-red-500 py-4'>Error loading transactions.</p>

  const transactions: Transaction[] = data?.data || []

  const transactionTypes = Array.from(new Set(transactions.map((transaction) => transaction.transactionType)))

  const columns = [
    {
      title: 'Transaction Type',
      dataIndex: 'transactionType',
      key: 'transactionType',
      width: '33%',
      align: 'center' as 'left' | 'right' | 'center',
      filters: transactionTypes.map((type) => ({ text: type, value: type })),
      onFilter: (value: Key | boolean, record: Transaction) => record.transactionType === value,
      render: (type: string) => <Tag color={type === 'DepositWallet' ? 'green' : 'red'}>{type}</Tag>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '33%',
      align: 'center' as 'left' | 'right' | 'center',
      render: (amount: number) => (
        <Text className={`font-semibold ${amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
          {amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })}
        </Text>
      )
    },
    {
      title: 'Transaction Time',
      dataIndex: 'transactionTime',
      key: 'transactionTime',
      width: '33%',
      align: 'center' as 'left' | 'right' | 'center',
      render: (time: string | null) => (time ? moment(time).format('YYYY-MM-DD HH:mm') : 'N/A')
    }
  ]

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Transaction History</h2>
      <Table
        columns={columns}
        dataSource={transactions}
        rowKey={(record) => record.transactionTime || String(record.amount)}
        pagination={{
          pageSize: 8,
          showSizeChanger: true
        }}
        className='rounded-lg border'
        rowClassName='hover:bg-gray-50 transition-colors duration-200'
        scroll={{ x: true }}
      />
    </div>
  )
}

export default TransactionsComponent