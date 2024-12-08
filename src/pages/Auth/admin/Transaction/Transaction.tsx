import React, { useState, useEffect } from 'react'
import { useViewCompanyTransactionsQuery } from '../../../../services/overview.services'
import { Table, Tag, Typography } from 'antd'
import moment from 'moment'
import type { Key } from 'antd/es/table/interface' // Import Key type
import { parsePriceVND } from '../../../../utils/convertTypeDayjs'

const { Text } = Typography

interface Transaction {
  transactionType: string
  amount: number
  transactionTime: string | null
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
          {parsePriceVND(amount)}
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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOrder = e.target.value
    const sortedTransactions = [...transactions].sort((a, b) => {
      if (!a.transactionTime || !b.transactionTime) return 0
      return sortOrder === 'asc'
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
        dataSource={transactions}
        rowKey={(record) => record.transactionTime || String(record.amount)}
        bordered
        pagination={{
          pageSize: 8,
          showSizeChanger: true
        }}
        className='border rounded-lg'
        rowClassName='hover:bg-gray-50 transition-colors duration-200'
        scroll={{ x: true }}
      />
    </div>
  )
}

export default TransactionsComponent
