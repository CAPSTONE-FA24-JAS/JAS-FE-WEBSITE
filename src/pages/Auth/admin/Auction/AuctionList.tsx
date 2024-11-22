import { Button, Image, message, Space, Table, TableProps, Tabs, Tag, Tooltip } from 'antd'
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
  const [tabKey, setTabKey] = useState<string>('all')

  const { data, isLoading } = useGetAuctionsQuery()
  const [approveAuction] = useApproveAuctionMutation()

  const roleId = useSelector((state: RootState) => state.authLoginAPI.roleId)

  const handleApprove = (id: number) => async () => {
    console.log('Approve', id)
    try {
      const res = await approveAuction(id).unwrap()
      if (res.isSuccess) {
        message.success('Approve auction successfully')
      } else {
        message.error('Approve auction failed')
      }
    } catch (error) {
      message.error('Approve auction failed')
    }
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
      width: 60,
      fixed: 'left',
      align: 'center',
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: 'ascend'
    },
    {
      title: 'Image',
      dataIndex: 'imageLink',
      key: 'imageLink',
      width: 120,
      fixed: 'left',
      render: (text) => (
        <Image
          src={text ? text : 'https://www.w3schools.com/w3images/lights.jpg'}
          alt='Auction'
          width={100}
          height={75}
          style={{ objectFit: 'cover' }}
        />
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      ellipsis: {
        showTitle: true
      },
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
        return (
          <Tooltip title={text}>
            <Link to={linkPath}>{text}</Link>
          </Tooltip>
        )
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'location',
      width: 200,
      align: 'left',
      render: (text) => (
        <Tooltip title={text}>
          <div className='text-sm line-clamp-2'>{text}</div>
        </Tooltip>
      )
    },
    {
      title: 'Auction Time',
      children: [
        {
          title: 'Start',
          dataIndex: 'startTime',
          key: 'createDate',
          width: 150,
          render: (text) => (text ? parseDate(text, 'dd/mm/yyyy hh:mm:ss') : 'N/A')
        },
        {
          title: 'End',
          dataIndex: 'endTime',
          key: 'expiredDate',
          width: 150,
          render: (text) => (text ? parseDate(text, 'dd/mm/yyyy hh:mm:ss') : 'N/A')
        },
        {
          title: 'Actual End',
          dataIndex: 'actualEndTime',
          key: 'actualEndTime',
          width: 150,
          render: (text) => (text ? parseDate(text, 'dd/mm/yyyy hh:mm:ss') : 'N/A')
        }
      ]
    },
    {
      title: 'Total Lot',
      dataIndex: 'totalLot',
      key: 'totalLot',
      width: 80,
      align: 'center'
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
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
          <div className='flex items-center justify-center gap-2'>
            {record.status === 'Waiting' ? (
              <Button onClick={handleApprove(record.id)} type='primary' size='small'>
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
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <div className='flex items-center justify-center gap-2'>
          {record.status === 'Waiting' && (
            <Space size='small'>
              <Button onClick={handleEdit(record.id)} type='primary' size='small'>
                Edit
              </Button>
              <Button danger size='small'>
                Delete
              </Button>
            </Space>
          )}
        </div>
      )
    }
  ]

  const auctionFiltered =
    Array.isArray(data?.data) && data?.data.length > 0
      ? data?.data.filter((item) => {
          const matchSearch =
            (item.description?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
            (item.name?.toLowerCase().includes(searchText.toLowerCase()) ?? false)
          if (tabKey === 'all') return matchSearch
          return item.status === tabKey && matchSearch
        })
      : []

  const handleAddAuction = () => {
    setIsModalVisible(true)
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
  }

  const tabItems = [
    {
      key: 'all',
      label: 'All'
    },
    {
      key: 'Waiting',
      label: 'Waiting'
    },
    {
      key: 'UpComing',
      label: 'UpComing'
    },
    {
      key: 'Live',
      label: 'Live'
    },
    {
      key: 'Past',
      label: 'Past'
    },
    {
      key: 'Cancelled',
      label: 'Cancelled'
    }
  ]

  return (
    <div className='p-5 rounded-lg bg-slate-50'>
      <div className='flex flex-col gap-4 sm:flex-row sm:justify-between'>
        <h2 className='text-xl font-semibold'>Auction List</h2>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <input
            onChange={(e) => setSearchText(e.target.value)}
            type='text'
            placeholder='Search'
            className='w-full px-3 py-[6px] text-sm text-gray-600 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 sm:w-48'
          />
          {roleId === RoleType.MANAGER && (
            <Button className='px-3 py-2' type='primary' onClick={handleAddAuction}>
              Add Auction
            </Button>
          )}
        </div>
      </div>

      <div className='mt-4 overflow-x-auto'>
        <div className='min-w-[1024px]'>
          <Tabs defaultActiveKey='all' items={tabItems} onChange={(key) => setTabKey(key)} />

          <Table
            columns={columns}
            dataSource={auctionFiltered}
            pagination={{ pageSize: 5 }}
            loading={isLoading}
            style={{ minHeight: '65vh' }}
            rowKey={(record) => record.id.toString()}
            scroll={{ x: 768 }}
          />
        </div>
      </div>

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
