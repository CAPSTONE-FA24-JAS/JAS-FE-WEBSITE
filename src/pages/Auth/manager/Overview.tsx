import { Avatar, Button, notification, Space, Table, TableProps, Tag } from 'antd'
import { useState } from 'react'
import { DeleteOutlined, EditOutlined, FundProjectionScreenOutlined, UserOutlined } from '@ant-design/icons'
import UserDetail from './ManageAccount/modal/UserDetail'
import { AdminGetListUserChildrenResponse } from '../../../types/Account.type'
import { useDeleteAccountMutation, useGetListUsersQuery } from '../../../services/account.services'

const Overview = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchText, setSearchText] = useState<string>('')

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

  const columns: TableProps<AdminGetListUserChildrenResponse>['columns'] = [
    {
      title: 'Avatar',
      dataIndex: 'profilePicture',
      key: 'avatar',
      render: (text: string) => <Avatar src={text} />
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <a onClick={() => handleUserClick(record)}>
          {record.firstName} {record.lastName}
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => <Tag color={status ? 'green' : 'red'}>{status ? 'Active' : 'Inactive'}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: any) => (
        <Space>
          <Button onClick={handleUserClick} type='primary' icon={<EditOutlined />}></Button>
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
            <UserOutlined size={24} color='green' />
          </div>
          <div>
            <p className='text-sm text-gray-500'>Total Customers</p>
            <p className='text-2xl font-semibold'>5,423</p>
            <p className='text-xs text-green-500'>↑ 15% this month</p>
          </div>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full'>
            <UserOutlined size={24} color='blue' />
          </div>
          <div>
            <p className='text-sm text-gray-500'>Members</p>
            <p className='text-2xl font-semibold'>1,893</p>
            <p className='text-xs text-red-500'>↓ 1% this month</p>
          </div>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full'>
            <FundProjectionScreenOutlined size={24} color='purple   ' />
          </div>
          <div>
            <p className='text-sm text-gray-500'>Active Now</p>
            <p className='text-2xl font-semibold'>189</p>
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
          columns={columns}
          dataSource={filteredData || []}
          pagination={{ pageSize: 5 }}
          loading={isLoading}
          style={{ minHeight: '65vh' }}
        />
        <UserDetail visible={modalVisible} onClose={handleCloseModal} user={selectedUser} />
      </div>
    </>
  )
}

export default Overview
