import { Table, TableProps, Tabs, Tag } from 'antd'
import { useState, useMemo } from 'react'
import { useGetFinanceProofsQuery } from '../../../../services/financeProof.services'
import { useGetFilterByRoleQuery } from '../../../../services/account.services'
import { FinanceProof } from '../../../../types/FinanceProof.type'
import { AdminGetFilterByRoleData } from '../../../../types/Account.type'
import FinancialProofModal from '../../admin/FinanceProof/modal/FinanceProofModal'
import { parseDate, parsePriceVND } from '../../../../utils/convertTypeDayjs'

const FinanceProofListManager = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [selectedProofId, setSelectedProofId] = useState<number | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [tabKey, setTabKey] = useState('all')

  const { data: financeProofResponse, isLoading } = useGetFinanceProofsQuery()
  const { data: staffResponse, isLoading: staffLoading } = useGetFilterByRoleQuery(3)

  const financeProofData = financeProofResponse?.data || []
  const staffData = staffResponse?.data || []

  // Create a map of staff IDs to full names
  const staffMap = useMemo(() => {
    return staffData.reduce((acc: Record<number, string>, staff: AdminGetFilterByRoleData) => {
      if (staff.staffDTO) {
        acc[staff.staffDTO.id] = `${staff.staffDTO.firstName} ${staff.staffDTO.lastName}`
      }
      return acc
    }, {})
  }, [staffData])

  const filteredData = financeProofData
    .filter((item) => {
      const matchesSearch = item.customerName.toLowerCase().includes(searchText.toLowerCase())
      if (tabKey === 'all') {
        return matchesSearch
      }
      return matchesSearch && item.status.toLowerCase() === tabKey.toLowerCase()
    })
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

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
      key: 'priceLimit',
      render: (value) => parsePriceVND(value)
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => (text ? parseDate(text, 'dd/mm/yyyy') : 'N/A'),
      sorter: (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    },
    {
      title: 'Expire Date',
      dataIndex: 'expireDate',
      key: 'expireDate',
      render: (text) => (text ? parseDate(text, 'dd/mm/yyyy') : 'N/A'),
      sorter: (a, b) => new Date(a.expireDate).getTime() - new Date(b.expireDate).getTime()
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Staff Name',
      dataIndex: 'staffId',
      key: 'staffName',
      render: (staffId: number) => <span>{staffId ? staffMap[staffId] || 'Unknown Staff' : 'N/A'}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          Approve: 'green',
          Reject: 'red',
          Pending: 'orange',
          Processing: 'blue',
          Cancel: 'gray'
        }
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>
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
            className='px-3 py-1 text-sm text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600'
          >
            Check
          </button>
        </div>
      )
    }
  ]

  const tabItems = [
    { key: 'all', label: 'All' },
    { key: 'approve', label: 'Approve' },
    { key: 'reject', label: 'Reject' },
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'cancel', label: 'Cancelled' }
  ]

  return (
    <div className='p-5 rounded-lg bg-slate-50'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold'>Finance Proof</h2>
        <input
          onChange={(e) => setSearchText(e.target.value)}
          type='text'
          placeholder='Search for users'
          className='w-1/4 px-3 py-2 text-sm text-gray-600 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400'
        />
      </div>

      <Tabs defaultActiveKey='all' items={tabItems} onChange={(key) => setTabKey(key)} />

      <Table
        columns={columns}
        dataSource={filteredData}
        bordered
        pagination={{ pageSize: 5 }}
        loading={isLoading || staffLoading}
        style={{ minHeight: '65vh' }}
        rowKey={(record) => record.id.toString()}
        scroll={{ x: 768 }}
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
