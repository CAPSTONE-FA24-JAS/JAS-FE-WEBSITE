import { useState } from 'react'
import { Table, Button, Space, Tag, Avatar, Input, notification } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDeleteAccountMutation, useGetListUsersQuery } from '../../../../services/account.services'

const { Search } = Input

const ManageAccount = () => {
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

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'profilePicture',
      key: 'avatar',
      render: (text: string) => <Avatar src={text} />
    },
    {
      title: 'Name',
      key: 'name',
      render: (record: any) => `${record.firstName} ${record.lastName}`
    },
    {
      title: 'Role Name',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      title: 'Contact',
      dataIndex: 'phoneNumber',
      key: 'contact'
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
      render: (text: any, record: any) => (
        <Space>
          <Button type='primary' icon={<EditOutlined />}></Button>
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
          <Search placeholder='Search by name' onSearch={handleSearch} enterButton style={{ width: 300 }} />
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
        <Table dataSource={filteredData} columns={columns} rowKey='id' />
      )}
    </div>
  )
}

export default ManageAccount
