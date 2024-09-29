import { Button, Table, TableProps } from 'antd'
import { useState } from 'react'
import AddAuctionModal from './modal/AddAuctionModal'
import { Link } from 'react-router-dom'

interface Auction {
  id: number
  name: string
  createDate: string
  expiredDate: string
  quantity: number
  status: number
}

const AuctionList = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const auctionData: Auction[] = [
    {
      id: 1,
      name: 'Antique Vase Auction',
      createDate: '2024-09-01',
      expiredDate: '2024-09-10',
      quantity: 5,
      status: 1
    },
    {
      id: 2,
      name: 'Vintage Car Auction',
      createDate: '2024-09-05',
      expiredDate: '2024-09-15',
      quantity: 10,
      status: 2
    },
    {
      id: 3,
      name: 'Jewelry Auction',
      createDate: '2024-09-07',
      expiredDate: '2024-09-17',
      quantity: 8,
      status: 1
    },
    {
      id: 4,
      name: 'Art Auction',
      createDate: '2024-09-09',
      expiredDate: '2024-09-19',
      quantity: 20,
      status: 3
    },
    {
      id: 5,
      name: 'Rare Books Auction',
      createDate: '2024-09-12',
      expiredDate: '2024-09-22',
      quantity: 3,
      status: 2
    },
    {
      id: 6,
      name: 'Luxury Watches Auction',
      createDate: '2024-09-14',
      expiredDate: '2024-09-24',
      quantity: 15,
      status: 1
    },
    {
      id: 7,
      name: 'Modern Art Auction',
      createDate: '2024-09-16',
      expiredDate: '2024-09-26',
      quantity: 12,
      status: 3
    },
    {
      id: 8,
      name: 'Collectible Stamps Auction',
      createDate: '2024-09-18',
      expiredDate: '2024-09-28',
      quantity: 25,
      status: 1
    },
    {
      id: 9,
      name: 'Classic Furniture Auction',
      createDate: '2024-09-20',
      expiredDate: '2024-09-30',
      quantity: 6,
      status: 2
    },
    {
      id: 10,
      name: 'Antique Coins Auction',
      createDate: '2024-09-22',
      expiredDate: '2024-10-02',
      quantity: 30,
      status: 3
    },
    {
      id: 11,
      name: 'Rare Wines Auction',
      createDate: '2024-09-24',
      expiredDate: '2024-10-04',
      quantity: 50,
      status: 1
    },
    {
      id: 12,
      name: 'Sports Memorabilia Auction',
      createDate: '2024-09-26',
      expiredDate: '2024-10-06',
      quantity: 40,
      status: 3
    },
    {
      id: 13,
      name: 'Fine Jewelry Auction',
      createDate: '2024-09-28',
      expiredDate: '2024-10-08',
      quantity: 10,
      status: 2
    },
    {
      id: 14,
      name: 'Luxury Handbags Auction',
      createDate: '2024-09-30',
      expiredDate: '2024-10-10',
      quantity: 7,
      status: 1
    },
    {
      id: 15,
      name: 'Vintage Camera Auction',
      createDate: '2024-10-01',
      expiredDate: '2024-10-11',
      quantity: 15,
      status: 2
    },
    {
      id: 16,
      name: 'Musical Instruments Auction',
      createDate: '2024-10-03',
      expiredDate: '2024-10-13',
      quantity: 5,
      status: 1
    },
    {
      id: 17,
      name: 'Luxury Real Estate Auction',
      createDate: '2024-10-05',
      expiredDate: '2024-10-15',
      quantity: 1,
      status: 3
    },
    {
      id: 18,
      name: 'Historical Documents Auction',
      createDate: '2024-10-07',
      expiredDate: '2024-10-17',
      quantity: 20,
      status: 1
    },
    {
      id: 19,
      name: 'Luxury Cars Auction',
      createDate: '2024-10-09',
      expiredDate: '2024-10-19',
      quantity: 3,
      status: 2
    },
    {
      id: 20,
      name: 'Collectible Toys Auction',
      createDate: '2024-10-11',
      expiredDate: '2024-10-21',
      quantity: 25,
      status: 1
    }
  ]

  const columns: TableProps<Auction>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Link to={'/admin/lotlist'}>{text}</Link>
    },
    {
      title: 'Quantity Lot',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center'
    },

    {
      title: 'Auction Time',
      children: [
        {
          title: 'Create Date',
          dataIndex: 'createDate',
          key: 'createDate'
        },
        {
          title: 'Expired Date',
          dataIndex: 'expiredDate',
          key: 'expiredDate'
        }
      ]
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    }
  ]
  const auctionFiltered = auctionData.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))

  const handleAddAuction = () => {
    setIsModalVisible(true)
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
  }

  const handleAddAuctionSubmit = (data: any) => {
    console.log('New auction data:', data)
    // Here you would typically add the new auction to your data source
    setIsModalVisible(false)
  }

  return (
    <div className='p-5 rounded-lg bg-slate-50'>
      <div className='flex justify-between'>
        <h2 className='mb-4 text-xl font-semibold'>Auction List</h2>
        <div className='flex justify-evenly'>
          <input
            onChange={(e) => setSearchText(e.target.value)}
            type='text'
            placeholder='Search'
            className='w-2/4 px-3 py-[6px] mb-4 text-sm text-gray-600 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400'
          />
          <Button className='px-3 py-2' type='primary' onClick={handleAddAuction}>
            Add Auction
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={auctionFiltered}
        pagination={{ pageSize: 5 }}
        loading={false}
        style={{ minHeight: '65vh' }}
      />
      <AddAuctionModal visible={isModalVisible} onCancel={handleModalCancel} onAdd={handleAddAuctionSubmit} />
    </div>
  )
}

export default AuctionList
