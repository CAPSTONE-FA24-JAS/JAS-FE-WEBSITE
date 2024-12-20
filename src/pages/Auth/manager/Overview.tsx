import { DeleteOutlined, FundProjectionScreenOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, notification, Space, Table, TableProps } from 'antd'
import { useState } from 'react'
import { useDeleteAccountMutation, useGetListUsersQuery } from '../../../services/account.services'
import {
  useGetTotalAccountActiveQuery,
  useGetTotalAccountsQuery,
  useGetTotalCustomerQuery
} from '../../../services/dashboard.services'
import { AccountData } from '../../../types/Account.type'
import UserDetail from './ManageAccount/modal/UserDetail'

const Overview = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchText, setSearchText] = useState<string>('')
  const { data: totalAccount } = useGetTotalAccountsQuery()
  const { data: activeCurrent } = useGetTotalAccountActiveQuery()
  const { data: totalCustomer } = useGetTotalCustomerQuery()

  const { data, isLoading, refetch } = useGetListUsersQuery()

  const [deleteAccount] = useDeleteAccountMutation()

  const filteredData = Array.isArray(data?.data)
    ? data.data.filter((item) => `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchText.toLowerCase()))
    : []

  const handleUserClick = (user: any) => {
    setSelectedUser(user)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedUser(null)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteAccount(id).unwrap()
      notification.success({
        message: 'Success',
        description: 'Account deleted successfully'
      })
      refetch()
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to delete account'
      })
    }
  }

  const columns: TableProps<AccountData>['columns'] = [
    {
      title: 'Avatar',
      key: 'avatar',
      render: (record: AccountData) => (
        <Avatar
          src={
            `${
              record.staffDTO?.profilePicture ||
              record.customerDTO?.profilePicture ||
              'https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon'
            }` || 'https://i.pravatar.cc/300'
          }
          size={40}
        />
      )
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => (
        <a onClick={() => handleUserClick(record)}>
          {record.staffDTO
            ? `${record.staffDTO?.firstName} ${record.staffDTO?.lastName}`
            : ` ${record.customerDTO?.firstName} ${record.customerDTO?.lastName}`}
        </a>
      )
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      key: 'roleName',
      filters: [
        { text: 'Staff', value: 'Staff Care' },
        { text: 'Admin', value: 'Admin' },
        { text: 'Customer', value: 'Customer' }
      ],
      onFilter: (value, record) => record.roleName.trim() === value.toString().trim()
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: AccountData) => (
        <Space>
          <Button type='primary' danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}></Button>
        </Space>
      )
    }
  ]

  return (
    <>
      <div className='grid grid-cols-3 gap-4 p-6 mb-6 rounded-lg bg-slate-50'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center justify-center w-12 h-12 bg-green-100 rounded-full'>
            <UserOutlined className='text-2xl text-green-600' />
          </div>
          <div>
            <p className='text-sm text-gray-500'>Total Account</p>
            <p className='text-2xl font-semibold'>{totalAccount?.data ? totalAccount.data : 0}</p>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <div className='flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full'>
            <FundProjectionScreenOutlined className='text-2xl text-purple-600' />
          </div>
          <div>
            <p className='text-sm text-gray-500'>Recently Active Account</p>
            <p className='text-2xl font-semibold'>{activeCurrent?.data ? activeCurrent.data : 0}</p>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <div className='flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full'>
            <UserOutlined className='text-2xl text-purple-600' />
          </div>
          <div>
            <p className='text-sm text-gray-500'>Total customer</p>
            <p className='text-2xl font-semibold'>{totalCustomer?.data ? totalCustomer.data : 0}</p>
          </div>
        </div>
      </div>

      <div className='p-5 rounded-lg bg-slate-50'>
        <div className='flex justify-between'>
          <h2 className='mb-4 text-xl font-semibold'>All Users</h2>
          <input
            onChange={(e) => setSearchText(e.target.value)}
            type='text'
            placeholder='Search for users'
            className='w-1/4 px-3 py-2 mb-4 text-sm text-gray-600 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400'
          />
        </div>
        <Table
          dataSource={filteredData || []}
          bordered
          pagination={{ pageSize: 5 }}
          loading={isLoading}
          style={{ minHeight: '65vh' }}
          columns={columns || []}
          rowKey={(record) => record.id}
        />
        <UserDetail visible={modalVisible} onClose={handleCloseModal} user={selectedUser} />
      </div>
    </>
  )
}

export default Overview
