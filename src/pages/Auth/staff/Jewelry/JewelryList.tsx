import { Button, Image, Space, Table, Tag, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { useGetAllJewelriesQuery } from '../../../../services/jewelry.services'
import { Jewelry } from '../../../../types/Jewelry.type'
import { parsePriceVND } from '../../../../utils/convertTypeDayjs'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RoleType } from '../../../../slice/authLoginAPISlice'
import { RootState } from '../../../../store'
import CancelJewelryModal from './Modal/CancelJewelryModal '

const JewelryList = () => {
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [searchText, setSearchText] = useState<string>('')
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJewelryId, setSelectedJewelryId] = useState<number | null>(null)

  const roleId = useSelector((state: RootState) => state.authLoginAPI.roleId)
  const { data, isLoading, isFetching } = useGetAllJewelriesQuery()

  const handleEdit = (id: number) => {
    console.log('Edit jewelry', id)
    if (roleId === RoleType.STAFFC) {
      navigate(`/staff/jewelry/${id}`)
    }
    if (roleId === RoleType.MANAGER) {
      navigate(`/manager/jewelry/${id}`)
    }
  }

  const handleCancel = (id: number) => {
    setSelectedJewelryId(id)
    setIsModalOpen(true)
  }

  const columns: ColumnsType<Jewelry> = [
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
      key: 'image',
      width: 120,
      render: (_, record) => (
        <Image src={record.imageJewelries[0]?.imageLink} alt={record.name} className='object-cover w-20 h-20 rounded' />
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (text) => (
        <Tooltip title={text}>
          <span className='font-medium'>{text}</span>
        </Tooltip>
      )
    },
    {
      title: 'Est Price Range',
      key: 'priceRange',
      render: (_, record) => (
        <span>
          {parsePriceVND(record.estimatePriceMin ?? 0)} - {parsePriceVND(record.estimatePriceMax ?? 0)}
        </span>
      )
    },
    // {
    //   title: 'Starting Price For Bid',
    //   dataIndex: 'startingPrice',
    //   key: 'startingPrice',
    //   render: (price) => <span>{parsePriceVND(price)}</span>
    // },
    {
      title: 'Specific Price',
      dataIndex: 'specificPrice',
      key: 'specificPrice',
      render: (price) => <span>{parsePriceVND(price)}</span>
    },
    {
      title: 'Bid Form',
      dataIndex: 'bidForm',
      key: 'bidForm',
      render: (bidForm) => {
        let color = 'blue'
        switch (bidForm) {
          case 'Secret Auction':
            color = 'purple'
            break
          case 'Fixed Price':
            color = 'green'
            break
          case 'Public Auction':
            color = 'blue'
            break
          case 'Auction Price GraduallyReduced':
            color = 'orange'
            break
        }
        return <Tag color={color}>{bidForm}</Tag>
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Authorized', value: 'Authorized' },
        { text: 'Watting', value: 'Watting' },
        { text: 'Cancelled', value: 'Cancelled' },
        { text: 'Sold', value: 'Sold' }
      ],
      onFilter: (value, record) => record.status === String(value),
      render: (status) => <Tag color={status === 'Authorized' ? 'success' : 'default'}>{status}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <Space size='small'>
          {record.status === 'Authorized' && (
            <Button onClick={() => handleCancel(record.id)} type='primary' danger size='small'>
              Cancel
            </Button>
          )}

          <Button onClick={() => handleEdit(record.id)} type='primary' size='small'>
            More
          </Button>
        </Space>
      )
    }
  ]

  // Filter data based on search text
  const jewelryFiltered =
    data?.data.dataResponse.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchText.toLowerCase())
    ) || []

  return (
    <div className='p-5 rounded-lg bg-slate-50'>
      <div className='flex flex-col gap-4 sm:flex-row sm:justify-between'>
        <h2 className='text-xl font-semibold'>Jewelry List</h2>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <input
            onChange={(e) => setSearchText(e.target.value)}
            type='text'
            placeholder='Search'
            className='w-full px-3 py-[6px] text-sm text-gray-600 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 sm:w-48'
          />
        </div>
      </div>

      <div className='mt-4 overflow-x-auto'>
        <div className='min-w-[1024px]'>
          <Table
            columns={columns}
            dataSource={jewelryFiltered}
            loading={isLoading || isFetching}
            rowKey={(record) => record.id.toString()}
            bordered
            pagination={{
              total: data?.data.totalItemRepsone,
              pageSize,
              current: pageIndex,
              onChange: (page, pageSize) => {
                setPageIndex(page)
                setPageSize(pageSize)
              },
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`
            }}
            size='small'
          />
        </div>
      </div>

      <CancelJewelryModal
        jewelryId={selectedJewelryId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedJewelryId(null)
        }}
      />
    </div>
  )
}

export default JewelryList
