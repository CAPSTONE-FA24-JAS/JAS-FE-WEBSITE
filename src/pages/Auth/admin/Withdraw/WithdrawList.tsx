import { Button, Table, notification, Avatar, Tag } from 'antd'
import {
  useApproveRequestNewWithdrawMutation,
  useCancelWithdrawMutation,
  useProcessWithdrawStaffMutation,
  useViewListRequestWithdrawForManagementQuery
} from '../../../../services/invoice.services'
import { useGetFilterByRoleQuery } from '../../../../services/account.services'
import { ColumnsType } from 'antd/es/table'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { RoleType } from '../../../../slice/authLoginAPISlice'
import { WithDraw } from '../../../../types/Withdraw.type'

type WithdrawStatus = 'Requested' | 'InProgress' | 'Approved' | 'Canceled'

export default function WithdrawalRequests() {
  const { data, error, isLoading, refetch } = useViewListRequestWithdrawForManagementQuery()
  const [approveRequestNewWithdraw] = useApproveRequestNewWithdrawMutation()
  const [processRequestWithdraw] = useProcessWithdrawStaffMutation()
  const [cancelWithdraw] = useCancelWithdrawMutation()
  const { data: customerData, isLoading: loadingCus } = useGetFilterByRoleQuery(1)
  const user = useSelector((state: RootState) => state.authLoginAPI)
  const userRole = user?.roleId?.toString()

  const getCustomerInfo = (customerId: number) => {
    return customerData?.data?.find((customer) => customer.customerDTO?.id === customerId)
  }

  const handleStatusChange = async (requestId: number, newStatus: string) => {
    try {
      let response
      if (newStatus === 'InProgress') {
        // Call your API to update status to InProgress
        response = await processRequestWithdraw({ requestId }).unwrap()
      } else if (newStatus === 'Approved') {
        response = await approveRequestNewWithdraw({ requestId }).unwrap()
      } else if (newStatus === 'Rejected') {
        // Call your API to reject
        response = await cancelWithdraw({ requestId }).unwrap()
      }

      notification.success({
        message: 'Success',
        description: response?.message || `Successfully updated status to ${newStatus}`,
        placement: 'topRight'
      })
      refetch()
    } catch (error) {
      notification.error({
        message: 'Error',
        description: `Failed to update status to ${newStatus}`,
        placement: 'topRight'
      })
    }
  }

  const renderActionButtons = (record: WithDraw) => {
    const isManager = userRole === RoleType.MANAGER
    const isStaff = userRole === RoleType.STAFFC

    if (record.status === 'Requested' && isStaff) {
      return (
        <div className='flex justify-center gap-2'>
          <Button type='primary' onClick={() => handleStatusChange(record.id, 'InProgress')} className='bg-green-500'>
            Progess
          </Button>
          <Button danger type='primary' onClick={() => handleStatusChange(record.id, 'Rejected')}>
            Cancel
          </Button>
        </div>
      )
    }

    if (record.status === 'InProgress' && isManager) {
      return (
        <div className='flex justify-center gap-2'>
          <Button type='primary' onClick={() => handleStatusChange(record.id, 'Approved')} className='bg-green-500'>
            Approve
          </Button>
          <Button danger type='primary' onClick={() => handleStatusChange(record.id, 'Rejected')}>
            Reject
          </Button>
        </div>
      )
    }

    return null
  }

  const getStatusColor = (status: WithdrawStatus) => {
    const statusColors: { [key in WithdrawStatus]: string } = {
      Requested: 'blue',
      InProgress: 'gold',
      Approved: 'green',
      Canceled: 'red'
    }
    return statusColors[status]
  }

  const columns: ColumnsType = [
    {
      title: 'Customer',
      key: 'customer',
      align: 'left',
      render: (record: WithDraw) => {
        const customer = getCustomerInfo(record.customerId)
        return (
          <div className='flex items-center gap-3'>
            <Avatar
              size={40}
              src={customer?.customerDTO?.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
              className='border border-gray-200'
            />
            <div className='flex flex-col'>
              <span className='font-medium'>
                {customer?.customerDTO?.firstName} {customer?.customerDTO?.lastName}
              </span>
              <span className='text-sm text-gray-500'>{customer?.email}</span>
            </div>
          </div>
        )
      }
    },
    {
      title: 'Bank Details',
      key: 'bankDetails',
      align: 'left',
      render: (record: WithDraw) => (
        <div className='flex flex-col'>
          <span className='font-medium'>
            {record.viewCreditCardDTO ? record.viewCreditCardDTO.bankAccountHolder : 'Unknow'}
          </span>
          <span className='text-sm text-gray-500'>
            Bank Name: {record.viewCreditCardDTO ? record.viewCreditCardDTO.bankName : 'Unknow'}
          </span>
          <span className='text-xs text-gray-400'>
            Bank Code: {record.viewCreditCardDTO ? record.viewCreditCardDTO.bankCode : 'Unknow'}
          </span>
        </div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      render: (amount: number) => (
        <span className='font-medium text-emerald-600'>
          {amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: WithdrawStatus) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (record: WithDraw) => renderActionButtons(record)
    }
  ]

  if (error) {
    return (
      <div className='p-4 border border-red-200 rounded-lg bg-red-50'>
        <p className='text-red-600'>Error loading data</p>
      </div>
    )
  }

  return (
    <div className='p-6 bg-white rounded-lg shadow-sm'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Withdrawal Management</h1>
      </div>
      <Table
        rowKey='id'
        columns={columns}
        loading={isLoading || loadingCus}
        dataSource={data?.data || []}
        bordered
        pagination={{
          pageSize: 5,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
        className='shadow-sm'
      />
    </div>
  )
}
