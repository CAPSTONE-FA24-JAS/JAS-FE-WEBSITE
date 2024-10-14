import { Button, Image, Table, TableProps } from 'antd'
import { useState } from 'react'
import AddAuctionModal from './modal/AddAuctionModal'
import { Link } from 'react-router-dom'
import { useGetAuctionsQuery } from '../../../../services/auction.services'
import { Auction } from '../../../../types/Auction.type'
import { Input } from 'antd'

const AuctionList = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const { data, error, isLoading } = useGetAuctionsQuery()

  const columns: TableProps<Auction>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: 'ascend'
    },
    {
      title: 'Image',
      dataIndex: 'imageLink',
      key: 'imageLink',
      render: (text) => <Image src={text} alt='Auction' width={100} />
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Link to={'/admin/lotlist'}>{text}</Link>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'location',
      align: 'center',
      render: (text) => <Input.TextArea value={text} autoSize={{ minRows: 3 }} readOnly />
    },
    {
      title: 'Auction Time',
      children: [
        {
          title: 'Start Date',
          dataIndex: 'startTime',
          key: 'createDate'
        },
        {
          title: 'End Date',
          dataIndex: 'endTime',
          key: 'expiredDate'
        },
        {
          title: 'Actual End Date',
          dataIndex: 'actualEndTime',
          key: 'actualEndTime',
          render: (text) => (text ? text : 'N/A')
        }
      ]
    },
    {
      title: 'Total Lot',
      dataIndex: 'totalLot',
      key: 'totalLot',
      align: 'center'
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    }
  ]
  const auctionFiltered = data?.data.filter((item) => item.description.toLowerCase().includes(searchText.toLowerCase()))

  const handleAddAuction = () => {
    setIsModalVisible(true)
  }

  const handleModalCancel = () => {
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
        loading={isLoading}
        style={{ minHeight: '65vh' }}
      />
      <AddAuctionModal visible={isModalVisible} onCancel={handleModalCancel} />
    </div>
  )
}

export default AuctionList
