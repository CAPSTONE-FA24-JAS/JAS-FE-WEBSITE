import { Button, Image, Table, TableProps, Tag } from 'antd'
import { useState } from 'react'
import AddAuctionModal from './modal/AddAuctionModal'
import { Link } from 'react-router-dom'
import { useApproveAuctionMutation, useGetAuctionsQuery } from '../../../../services/auction.services'
import { Auction } from '../../../../types/Auction.type'
import { Input } from 'antd'
import { RootState } from '../../../../store'
import { useSelector } from 'react-redux'
import { RoleType } from '../../../../slice/authLoginAPISlice'
import { parseDate } from '../../../../utils/convertTypeDayjs'

const AuctionList = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [editAuction, setEditAuction] = useState<number>(NaN)

  const { data, isLoading } = useGetAuctionsQuery()
  const [approveAuction] = useApproveAuctionMutation()

  const roleId = useSelector((state: RootState) => state.authLoginAPI.roleId)

  const handleApprove = (id: number) => () => {
    console.log('Approve', id)
    approveAuction(id)
  }

  const handleEdit = (id: number) => () => {
    handleAddAuction()
    setEditAuction(id)
  }

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
      render: (text) => (
        <Image src={text ? text : 'https://www.w3schools.com/w3images/lights.jpg'} alt='Auction' width={100} />
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record: Auction) => {
        let linkPath = ''
        switch (roleId) {
          case RoleType.MANAGER:
            linkPath = `/manager/lotlist/${record.id}`
            break
          case RoleType.STAFFC:
            linkPath = `/staff/lotlist/${record.id}`
            break
          default:
            linkPath = '#'
            break
        }
        return <Link to={linkPath}>{text}</Link>
      }
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
          key: 'createDate',
          render: (text) => (text ? parseDate(text, 'dd/mm/yyy hh/mm/ss') : 'N/A')
        },
        {
          title: 'End Date',
          dataIndex: 'endTime',
          key: 'expiredDate',
          render: (text) => (text ? parseDate(text, 'dd/mm/yyy hh/mm/ss') : 'N/A')
        },
        {
          title: 'Actual End Date',
          dataIndex: 'actualEndTime',
          key: 'actualEndTime',
          render: (text) => (text ? parseDate(text, 'dd/mm/yyy hh/mm/ss') : 'N/A')
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
      key: 'status',
      align: 'center',
      render: (_, record) => {
        let color = ''
        let tagText = ''

        switch (record.status) {
          case 'Waiting':
            color = 'gold'
            tagText = 'Waiting'
            break
          case 'UpComing':
            color = 'blue'
            tagText = 'UpComing'
            break
          case 'Live':
            color = 'green'
            tagText = 'Live'
            break
          case 'Past':
            color = 'volcano'
            tagText = 'Past'
            break
          case 'Cancelled':
            color = 'red'
            tagText = 'Cancelled'
            break
          default:
            break
        }

        return (
          <div className='flex items-center gap-2'>
            {record.status === 'Waiting' ? (
              <Button onClick={handleApprove(record.id)} type='primary'>
                Approve
              </Button>
            ) : (
              <Tag color={color}>{tagText}</Tag>
            )}
          </div>
        )
      }
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <div className='flex items-center justify-center gap-2'>
          <Button onClick={handleEdit(record.id)} type='primary'>
            Edit
          </Button>
          <Button danger>Delete</Button>
        </div>
      )
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
          {roleId === RoleType.MANAGER && (
            <Button className='px-3 py-2' type='primary' onClick={handleAddAuction}>
              Add Auction
            </Button>
          )}
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={auctionFiltered}
        pagination={{ pageSize: 5 }}
        loading={isLoading}
        style={{ minHeight: '65vh' }}
        rowKey={(record) => record.id.toString()}
      />
      <AddAuctionModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        id={editAuction ?? null}
        setEditAuction={setEditAuction}
      />
    </div>
  )
}

export default AuctionList
