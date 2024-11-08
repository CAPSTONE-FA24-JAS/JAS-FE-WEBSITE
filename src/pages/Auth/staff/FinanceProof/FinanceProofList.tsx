import { Table, TableProps, Tabs, Tag } from 'antd'
import { useState } from 'react'
import { useGetFinanceProofsQuery } from '../../../../services/financeProof.services'
import { FinanceProof } from '../../../../types/FinanceProof.type'
import FinancialProofModal from './modal/FinanceProofModal'
import { parseDate, parsePriceVND } from '../../../../utils/convertTypeDayjs'

const FinanceProofList = () => {
  const [searchText, setSearchText] = useState<string>('')
  const { data: financeProofResponse, isLoading } = useGetFinanceProofsQuery()
  const [selectedProofId, setSelectedProofId] = useState<number | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [tabKey, setTabKey] = useState('all')

  const financeProofData = financeProofResponse?.data || []

  const filteredData = financeProofData.filter((item) => {
    const matchesSearch = item.customerName.toLowerCase().includes(searchText.toLowerCase())

    if (tabKey === 'all') {
      return matchesSearch
    }

    return matchesSearch && item.status.toLowerCase() === tabKey.toLowerCase()
  })

  const columns: TableProps<FinanceProof>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: 'ascend'
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: 'Price Limit',
      dataIndex: 'priceLimit',
      key: 'priceLimit',
      render: (value) => parsePriceVND(value)
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => (text ? parseDate(text, 'dd/mm/yyyy') : 'N/A')
    },
    {
      title: 'Expire Date',
      dataIndex: 'expireDate',
      render: (text) => (text ? parseDate(text, 'dd/mm/yyyy') : 'N/A')
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'red'
        switch (status) {
          case 'Approve':
            color = 'green'
            break
          case 'Reject':
            color = 'red'
            break
          case 'Pending':
            color = 'orange'
            break
        }
        return <Tag color={color}>{status}</Tag>
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: FinanceProof) => (
        <div className='flex space-x-2'>
          <button
            onClick={() => {
              setSelectedProofId(record.id)
              setModalVisible(true)
            }}
            className='px-3 py-1 text-sm text-white bg-blue-500 rounded-lg'
          >
            Check
          </button>
        </div>
      )
    }
  ]

  const tabItems = [
    { key: 'all', label: 'All' },
    { key: 'approve', label: 'Approved' },
    { key: 'reject', label: 'Rejected' },
    { key: 'pending', label: 'Pending' },
    { key: 'cancel', label: 'Cancelled' }
  ]

  return (
    <div className='p-5 rounded-lg bg-slate-50'>
      <div className='flex justify-between'>
        <h2 className='mb-4 text-xl font-semibold'>Finance Proof</h2>
        <input
          onChange={(e) => setSearchText(e.target.value)}
          type='text'
          placeholder='Search for users'
          className='w-1/4 px-3 py-2 mb-4 text-sm text-gray-600 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400'
        />
      </div>
      <Tabs defaultActiveKey='all' items={tabItems} onChange={(key) => setTabKey(key)} />
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        loading={isLoading}
        style={{ minHeight: '65vh' }}
        scroll={{ x: 768 }}
        rowKey={(record) => record.id.toString()}
      />

      {selectedProofId && (
        <FinancialProofModal
          visible={modalVisible}
          setModalVisible={setModalVisible}
          onClose={() => {
            setSelectedProofId(null)
            setModalVisible(false)
          }}
          id={selectedProofId}
        />
      )}
    </div>
  )
}

export default FinanceProofList
