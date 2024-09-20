import { Table, TableProps, Tag } from 'antd'
import { useState } from 'react'
import FinancialProofModal from './modal/FinanceProofModal'

export interface FinanceProof {
  id: number
  name: string
  createDate: string
  expiredDate: string
  contact: string
  status: number
}

const FinanceProofList = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [selectedProof, setSelectedProof] = useState<FinanceProof | null>(null)

  const financeProofData: FinanceProof[] = [
    {
      id: 1,
      name: 'John Doe',
      createDate: '2023-09-01',
      expiredDate: '2024-09-01',
      contact: 'johndoe@example.com',
      status: 1
    },
    {
      id: 2,
      name: 'Jane Smith',
      createDate: '2023-08-15',
      expiredDate: '2024-08-15',
      contact: 'janesmith@example.com',
      status: 2
    },
    {
      id: 3,
      name: 'Michael Johnson',
      createDate: '2023-07-10',
      expiredDate: '2024-07-10',
      contact: 'michaelj@example.com',
      status: 3
    },
    {
      id: 4,
      name: 'Emily Davis',
      createDate: '2023-06-05',
      expiredDate: '2024-06-05',
      contact: 'emilydavis@example.com',
      status: 1
    },
    {
      id: 5,
      name: 'Robert Brown',
      createDate: '2023-05-20',
      expiredDate: '2024-05-20',
      contact: 'robertbrown@example.com',
      status: 2
    },
    {
      id: 6,
      name: 'Sarah Wilson',
      createDate: '2023-04-18',
      expiredDate: '2024-04-18',
      contact: 'sarahwilson@example.com',
      status: 1
    },
    {
      id: 7,
      name: 'William Taylor',
      createDate: '2023-03-12',
      expiredDate: '2024-03-12',
      contact: 'willtaylor@example.com',
      status: 2
    },
    {
      id: 8,
      name: 'Sophia Martinez',
      createDate: '2023-02-08',
      expiredDate: '2024-02-08',
      contact: 'sophiam@example.com',
      status: 1
    },
    {
      id: 9,
      name: 'David Lee',
      createDate: '2023-01-22',
      expiredDate: '2024-01-22',
      contact: 'davidlee@example.com',
      status: 1
    },
    {
      id: 10,
      name: 'Olivia Anderson',
      createDate: '2022-12-05',
      expiredDate: '2023-12-05',
      contact: 'oliviaa@example.com',
      status: 2
    }
  ]

  const filteredData = financeProofData.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))

  const columns: TableProps<FinanceProof>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Create Date',
      dataIndex: 'createDate',
      key: 'createDate'
    },
    {
      title: 'Expired Date',
      dataIndex: 'expiredDate',
      key: 'expiredDate'
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        let color = ''
        let text = ''
        switch (status) {
          case 1:
            color = 'green'
            text = 'Active'
            break
          case 2:
            color = 'red'
            text = 'Inactive'
            break
          case 3:
            color = 'orange'
            text = 'Pending'
            break
        }
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: FinanceProof) =>
        record.status === 3 ? (
          <div className='flex space-x-2'>
            <button
              onClick={() => {
                setSelectedProof(record)
                setModalVisible(true)
              }}
              className='px-3 py-1 text-sm text-white bg-blue-500 rounded-lg'
            >
              Check
            </button>
          </div>
        ) : (
          ''
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
        loading={false}
        style={{ minHeight: '65vh' }}
      />
      <FinancialProofModal visible={modalVisible} onClose={() => setModalVisible(false)} financeProof={selectedProof} />
    </div>
  )
}

export default FinanceProofList
