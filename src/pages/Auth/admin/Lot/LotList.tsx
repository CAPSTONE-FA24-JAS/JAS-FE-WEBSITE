import { useState } from 'react'
import { Table, Button, Input, Space, Tag } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import AddLotModal from './modal/AddLotModal'
import { useParams } from 'react-router-dom'

export interface Lot {
  id: number
  product: string
  title: string
  auctionName: string
  number: number
  winner: string
  biddingAmount: number
  commission: number
  status: string
}

const LotList = () => {
  const [searchText, setSearchText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingLot, setEditingLot] = useState<Lot | null>(null) // nào làm với api thì nhét redux vào đây giờ dùng state tạm để UI

  let { id } = useParams()
  console.log('id:', id)

  const lotData: Lot[] = [
    {
      id: 1,
      product: 'Gold Necklace',
      title: '18k Gold Diamond Necklace',
      auctionName: 'Luxury Jewelry Auction',
      number: 101,
      winner: 'Alice Johnson',
      biddingAmount: 5000,
      commission: 250,
      status: 'Completed'
    },
    {
      id: 2,
      product: 'Silver Bracelet',
      title: 'Sterling Silver Charm Bracelet',
      auctionName: 'Fine Jewelry Auction',
      number: 102,
      winner: 'Bob Smith',
      biddingAmount: 1200,
      commission: 60,
      status: 'Pending'
    },
    {
      id: 3,
      product: 'Diamond Ring',
      title: '2 Carat Solitaire Diamond Ring',
      auctionName: 'Exclusive Diamond Auction',
      number: 103,
      winner: 'Catherine Lee',
      biddingAmount: 15000,
      commission: 750,
      status: 'Shipped'
    },
    {
      id: 4,
      product: 'Pearl Earrings',
      title: 'Classic Pearl Drop Earrings',
      auctionName: 'Luxury Jewelry Auction',
      number: 104,
      winner: 'Daniel Green',
      biddingAmount: 800,
      commission: 40,
      status: 'In Progress'
    }
  ]

  const columns: TableProps<Lot>['columns'] = [
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Auction Name', dataIndex: 'auctionName', key: 'auctionName' },
    { title: 'Number', dataIndex: 'number', key: 'number' },
    { title: 'Winner', dataIndex: 'winner', key: 'winner' },
    {
      title: 'Bidding Amount',
      dataIndex: 'biddingAmount',
      key: 'biddingAmount',
      render: (value) => `$${value.toFixed(2)}`
    },
    { title: 'Commission', dataIndex: 'commission', key: 'commission', render: (value) => `$${value.toFixed(2)}` },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default'
        switch (status) {
          case 'WAITING':
            color = 'default'
            break
          case 'AUCTION':
            color = 'processing'
            break
          case 'READY':
            color = 'cyan'
            break
          case 'SOLD':
            color = 'success'
            break
          case 'PASSED':
            color = 'error'
            break
          default:
            color = 'default'
        }
        return <Tag color={color}></Tag> // Remove template string
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button icon={<EditOutlined />} size='small' onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} size='small' danger>
            Delete
          </Button>
        </Space>
      )
    }
  ]

  const handleAdd = () => {
    setEditingLot(null)
    setModalVisible(true)
  }

  const handleEdit = (lot: Lot) => {
    setEditingLot(lot)
    setModalVisible(true)
  }

  const handleModalCancel = () => {
    setModalVisible(false)
    setEditingLot(null)
  }

  const handleModalSubmit = (values: Partial<Lot>) => {
    if (editingLot) {
      // Handle edit logic
      console.log('Editing lot:', { ...editingLot, ...values })
    } else {
      // Handle add logic
      console.log('Adding new lot:', values)
    }
    setModalVisible(false)
    setEditingLot(null)
  }

  const filteredLots = lotData.filter(
    (lot) =>
      lot.product.toLowerCase().includes(searchText.toLowerCase()) ||
      lot.title.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <>
      <div className='p-5 rounded-lg bg-slate-50'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold'>Lots List</h2>
          <Space>
            <Input.Search
              placeholder='Search lots'
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Button type='primary' onClick={handleAdd}>
              + Add
            </Button>
          </Space>
        </div>
        <Table columns={columns} dataSource={filteredLots} rowKey='id' pagination={{ pageSize: 5 }} />
      </div>
      <AddLotModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        initialValues={editingLot || undefined}
      />
    </>
  )
}

export default LotList
