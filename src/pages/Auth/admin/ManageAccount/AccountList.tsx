import { useState } from 'react'
import { Table, Button, Space, Tag, Avatar, Input, notification, TableProps } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDeleteAccountMutation, useGetListUsersQuery } from '../../../../services/account.services'
import { AdminGetListUserChildrenResponse } from '../../../../types/Account.type'
import UserDetail from './modal/UserDetail'

const { Search } = Input

const ManageAccount = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchText, setSearchText] = useState<string>('')
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useGetListUsersQuery()
  const [deleteAccount] = useDeleteAccountMutation()

  // Filtered data based on search input
  const filteredData =
    data?.data.filter((item) =>
      `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchText.toLowerCase())
    ) || []

  // Handle search input
  const handleSearch = (value: string) => {
    setSearchText(value)
  }
  const handleUserClick = (user: any) => {
    setSelectedUser(user)
    setModalVisible(true)
  }
  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedUser(null)
  }
  // Handle create account button click
  const handleNewAccount = () => {
    navigate('/admin/createAccount') // Navigate to the create account page
  }

  // Handle delete account button click
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
    <div className='p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-bold'>Manage Accounts</h2>
        <div className='flex items-center space-x-4'>
          <input
            onChange={(e) => setSearchText(e.target.value)}
            type='text'
            placeholder='Search for users'
            className='px-3 py-2  text-sm text-gray-600 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400'
          />
          <Button type='primary' icon={<PlusOutlined />} onClick={handleNewAccount}>
            Create Account
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error loading data</div>
      ) : (
        <Table dataSource={filteredData} pagination={{ pageSize: 6 }} columns={columns} rowKey='id' />
      )}
      <UserDetail visible={modalVisible} onClose={handleCloseModal} user={selectedUser} />
    </div>
  )
}

export default ManageAccount
