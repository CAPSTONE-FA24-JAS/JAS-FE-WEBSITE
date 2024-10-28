import { useState } from 'react'
import { Table, Button, Input, Space, Tag, notification } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import AddLotModal from './modal/AddLotModal'
import { useParams } from 'react-router-dom'
import {
  useCreateLotFixedPriceMutation,
  useGetLotsByAuctionIdQuery,
  useCreateLotSecretAuctionMutation,
  useCreateLotPublicAuctionMutation,
  useCreateLotAuctionPriceGraduallyReducedMutation
} from '../../../../services/lot.services'
import { CreateLot, Lot } from '../../../../types/Lot.type'
import { useGetAuctionByIdQuery } from '../../../../services/auction.services'
import { parseDate } from '../../../../utils/convertTypeDayjs'

const LotList = () => {
  const [searchText, setSearchText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingLot, setEditingLot] = useState<Lot | null>(null)

  const { id } = useParams<{ id: string }>()
  const auctionId = parseInt(id || '0', 10)

  const { data: lotsData, isLoading } = useGetLotsByAuctionIdQuery(auctionId)
  const { data: auctionData } = useGetAuctionByIdQuery(auctionId)
  const [createFixed, { isLoading: loadingFixedPrice }] = useCreateLotFixedPriceMutation()
  const [createSerect, { isLoading: loadingSecret }] = useCreateLotSecretAuctionMutation()
  const [createPublic, { isLoading: loadingPublice }] = useCreateLotPublicAuctionMutation()
  const [createPriceGraduallyReduced, { isLoading: loadingReduce }] = useCreateLotAuctionPriceGraduallyReducedMutation()

  const columns: TableProps<Lot>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Start Price', dataIndex: 'startPrice', key: 'startPrice', render: (value) => `${value}` },
    {
      title: 'Final Price Sold',
      dataIndex: 'finalPriceSold',
      key: 'finalPriceSold',
      render: (value) => `$${value}`
    },

    {
      title: 'Bid Increment',
      dataIndex: 'bidIncrement',
      key: 'bidIncrement',
      render: (value) => `$${value}`
    },
    { title: 'Deposit', dataIndex: 'deposit', key: 'deposit', render: (value) => `$${value}` },
    {
      title: 'Buy Now Price',
      dataIndex: 'buyNowPrice',
      key: 'buyNowPrice',
      render: (value) => `${value ? value : ''}`
    },

    {
      title: 'Actual End Time',
      dataIndex: 'actualEndTime',
      key: 'actualEndTime',
      render: (value) => parseDate(value, 'dd/mm/yyy hh/mm/ss')
    },
    {
      title: 'Financial Proof',
      dataIndex: 'haveFinancialProof',
      key: 'haveFinancialProof',
      render: (value) => (value ? 'Yes' : 'No')
    },
    {
      title: 'Extend Time',
      dataIndex: 'isExtend',
      key: 'isExtend',
      render: (value) => (value ? 'Yes' : 'No')
    },
    { title: 'Lot Type', dataIndex: 'lotType', key: 'lotType' },
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
        return <Tag color={color}>{status}</Tag>
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

  const handleModalSubmit = async (values: Partial<CreateLot>) => {
    if (editingLot) {
      // Handle edit logic
      console.log('Editing lot:', { ...editingLot, ...values })
    } else {
      try {
        console.log('Adding new lot:', values)
        console.log('Lot Type:', values.lotTypeValue)

        switch (Number(values.lotTypeValue)) {
          case 1:
            console.log('Fixed Price Auction')
            await createFixed({
              title: values.title,
              deposit: values.deposit,
              buyNowPrice: values.buyNowPrice,
              isExtend: values.isExtend,
              haveFinancialProof: values.haveFinancialProof,
              staffId: values.staffId,
              jewelryId: values.jewelryId,
              auctionId: values.auctionId
            }).unwrap() // Thêm .unwrap() để handle error
            notification.success({
              message: 'Success',
              description: 'Fixed Price Lot created successfully!'
            })
            break
          case 2:
            console.log('Sercet Auction')
            await createSerect({
              title: values.title,
              startPrice: values.startPrice,
              finalPriceSold: values.finalPriceSold,
              deposit: values.deposit,
              isExtend: values.isExtend,
              haveFinancialProof: values.haveFinancialProof,
              staffId: values.staffId,
              jewelryId: values.jewelryId,
              auctionId: values.auctionId
            }).unwrap()
            notification.success({
              message: 'Success',
              description: 'Secret Auction Lot created successfully!'
            })
            break
          case 3:
            console.log('Public Auction')
            await createPublic({
              title: values.title,
              startPrice: values.startPrice,
              finalPriceSold: values.finalPriceSold,
              bidIncrement: values.bidIncrement,
              deposit: values.deposit,
              isExtend: values.isExtend,
              haveFinancialProof: values.haveFinancialProof,
              staffId: values.staffId,
              jewelryId: values.jewelryId,
              auctionId: values.auctionId
            }).unwrap()
            notification.success({
              message: 'Success',
              description: 'Public Auction Lot created successfully!'
            })
            break

          case 4:
            console.log('Reverse Auction')
            await createPriceGraduallyReduced({
              title: values.title,
              startPrice: values.startPrice,
              finalPriceSold: values.finalPriceSold,
              bidIncrement: values.bidIncrement,
              deposit: values.deposit,
              isExtend: values.isExtend,
              haveFinancialProof: values.haveFinancialProof,
              staffId: values.staffId,
              jewelryId: values.jewelryId,
              auctionId: values.auctionId,
              bidIncrementTime: values.bidIncrementTime
            }).unwrap()
            notification.success({
              message: 'Success',
              description: 'Reverse Auction Lot created successfully!'
            })
            break
          default:
            notification.warning({
              message: 'Warning',
              description: 'Invalid lot type selected'
            })
            break
        }
        setModalVisible(false)
        setEditingLot(null)
      } catch (error: any) {
        notification.error({
          message: 'Error',
          description: error.data?.message || 'Failed to create lot. Please try again.'
        })
      }
    }
    setModalVisible(false)
    setEditingLot(null)
  }

  const filteredLots =
    lotsData?.data.filter(
      (lot) =>
        lot.lotType.toLowerCase().includes(searchText.toLowerCase()) ||
        lot.id.toString().includes(searchText.toLowerCase())
    ) || []

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className='p-5 rounded-lg bg-slate-50'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold'>{auctionData?.data.name} - Lots List</h2>
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
        <Table columns={columns} dataSource={filteredLots} rowKey='id' pagination={{ pageSize: 5 }} size='small' />
      </div>
      {auctionData && (
        <AddLotModal
          isLoading={loadingFixedPrice || loadingSecret || loadingPublice || loadingReduce}
          auctionData={auctionData.data}
          visible={modalVisible}
          onCancel={handleModalCancel}
          onSubmit={handleModalSubmit}
          initialValues={editingLot || ({} as Lot)}
        />
      )}
    </>
  )
}

export default LotList
