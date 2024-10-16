import { Table, TableProps, Tag } from 'antd'
import { useState } from 'react'
import { useGetFinanceProofsQuery } from '../../../../services/financeProof.services'
import { FinanceProof } from '../../../../types/FinanceProof.type'
import FinancialProofModal from '../../admin/FinanceProof/modal/FinanceProofModal'

const FinanceProofListManager = () => {
  const [searchText, setSearchText] = useState<string>('')
  const { data: financeProofResponse, isLoading } = useGetFinanceProofsQuery()
  const [selectedProofId, setSelectedProofId] = useState<number | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const financeProofData = financeProofResponse?.data || []

  const filteredData = financeProofData.filter((item) =>
    item.customerName.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns: TableProps<FinanceProof>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: 'Price Limit',
      dataIndex: 'priceLimit',
      key: 'priceLimit'
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate'
    },
    {
      title: 'Expire Date',
      dataIndex: 'expireDate',
      key: 'expireDate'
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason'
    },
    { title: 'Staff ID', dataIndex: 'staffId', render: (staffId: number) => <span>{staffId || 'N/A'}</span> },
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
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        loading={isLoading}
        style={{ minHeight: '65vh' }}
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

export default FinanceProofListManager
