import { Button, Table, notification } from 'antd'
import {
  useApproveRequestNewWithdrawMutation,
  useViewListRequestWithdrawForManagementQuery
} from '../../../../services/invoice.services'

export default function WithdrawalRequests() {
  const { data, error, isLoading, refetch } = useViewListRequestWithdrawForManagementQuery(undefined)
  const [approveRequestNewWithdraw] = useApproveRequestNewWithdrawMutation()

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
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
        <Button type='primary' onClick={() => handleApprove(record.id)}>
          Approve
        </Button>
      )
    }
  ]

  async function handleApprove(requestId: number) {
    try {
      const response = await approveRequestNewWithdraw({ requestId }).unwrap()
      notification.success({
        message: 'Success',
        description: response.message || 'Withdrawal approved successfully',
        placement: 'topRight'
      })
      refetch()
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to approve withdrawal',
        placement: 'topRight'
      })
    }
  }

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading data</p>

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Withdraw Management</h1>
      <Table rowKey='id' columns={columns} dataSource={data?.data || []} bordered pagination={{ pageSize: 5 }} />
    </div>
  )
}
