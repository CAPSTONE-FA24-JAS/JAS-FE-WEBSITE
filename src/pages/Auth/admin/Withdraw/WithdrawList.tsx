import { Button, Table } from 'antd'
import { useViewListRequestWithdrawForManagementQuery } from '../../../../services/invoice.services'

export default function WithdrawalRequests() {
  const { data, error, isLoading } = useViewListRequestWithdrawForManagementQuery(undefined)

  const columns = [
    {
      title: 'ID',
      dataIndex: 'walletId',
      key: 'walletId',
      align: 'center' as const,
      render: (text: any) => <span>{text}</span>
    },
    {
      title: 'Bank Account',
      dataIndex: ['viewCreditCardDTO', 'bankAccountHolder'],
      key: 'bankAccountHolder',
      align: 'center' as const
    },
    {
      title: 'Bank Name',
      dataIndex: ['viewCreditCardDTO', 'bankName'],
      key: 'bankName',
      align: 'center' as const
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center' as const,
      render: (amount: any) => <span>{amount.toLocaleString()}</span>
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center' as const,
      render: (record: any) => (
        <Button type='primary' onClick={() => handleApprove(record.walletId)}>
          Approve
        </Button>
      )
    }
  ]

  function handleApprove(walletId: any) {
    alert(`Approve withdrawal for Wallet ID: ${walletId}`)
  }

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading data</p>

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Withdraw Management</h1>
      <Table rowKey='walletId' columns={columns} dataSource={data?.data || []} bordered pagination={{ pageSize: 5 }} />
    </div>
  )
}
