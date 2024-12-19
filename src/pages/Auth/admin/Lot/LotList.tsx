import { AppstoreOutlined, DeleteOutlined, EditOutlined, UnorderedListOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import { Button, Input, notification, Radio, Space, Table, Tag, Tooltip } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { useGetAuctionByIdQuery } from '../../../../services/auction.services'
import {
  useCreateLotAuctionPriceGraduallyReducedMutation,
  useCreateLotFixedPriceMutation,
  useCreateLotPublicAuctionMutation,
  useCreateLotSecretAuctionMutation,
  useGetLotByAuctionIdRawQuery,
  useUpdateAuctionPriceGraduallyReducedLotMutation,
  useUpdateFixPriceLotMutation,
  useUpdatePublicLotMutation,
  useUpdateSecretLotMutation
} from '../../../../services/lot.services'
import { RoleType } from '../../../../slice/authLoginAPISlice'
import { RootState } from '../../../../store'
import { CreateLot, ListLot } from '../../../../types/Lot.type'
import { parseDate, parsePriceVND } from '../../../../utils/convertTypeDayjs'
import LotGridView from './LotGridView'
import AddLotModal from './modal/AddLotModal'

const getLotTypeConfig = (lotType: string): { label: string; color: string } => {
  const config: Record<string, { label: string; color: string }> = {
    Fixed_Price: { label: 'Fixed Price', color: 'green' },
    Secret_Auction: { label: 'Secret Auction', color: 'blue' },
    Public_Auction: { label: 'Public Auction', color: 'red' },
    Auction_Price_GraduallyReduced: { label: 'Reverse Auction', color: 'purple' }
  }
  return config[lotType] || { label: lotType, color: 'default' }
}

const LotList = () => {
  const [searchText, setSearchText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingLot, setEditingLot] = useState<ListLot | null>(null)

  const { id } = useParams<{ id: string }>()
  const auctionId = parseInt(id || '0', 10)

  const { data: lotsData, isLoading } = useGetLotByAuctionIdRawQuery(auctionId)
  const { data: auctionData } = useGetAuctionByIdQuery(auctionId)
  const [createFixed, { isLoading: loadingFixedPrice }] = useCreateLotFixedPriceMutation()
  const [createSerect, { isLoading: loadingSecret }] = useCreateLotSecretAuctionMutation()
  const [createPublic, { isLoading: loadingPublice }] = useCreateLotPublicAuctionMutation()
  const [createPriceGraduallyReduced, { isLoading: loadingReduce }] = useCreateLotAuctionPriceGraduallyReducedMutation()
  const [updateFixPriceLot, { isLoading: loadingUpdateFixPriceLot }] = useUpdateFixPriceLotMutation()
  const [updateSecretLot, { isLoading: loadingUpdateSecretLot }] = useUpdateSecretLotMutation()
  const [updatePublicLot, { isLoading: loadingUpdatePublic }] = useUpdatePublicLotMutation()
  const [updatePriceGraduallyReduced, { isLoading: loadingUpdateReveres }] =
    useUpdateAuctionPriceGraduallyReducedLotMutation()
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const roleId = useSelector((state: RootState) => state.authLoginAPI.roleId)

  const columns: TableProps<ListLot>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      fixed: 'left'
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      ellipsis: {
        showTitle: true
      },
      render: (text, record: ListLot) => {
        let linkPath = ''
        switch (roleId) {
          case RoleType.MANAGER:
            linkPath = `/manager/lotdetailmanager/${record.id}`
            break
          case RoleType.STAFFC:
            linkPath = `/staff/lotdetailmanager/${record.id}`
            break
          default:
            linkPath = `/staff/lotdetailmanager/${record.id}`
        }
        return (
          <Tooltip title={text}>
            <div className='whitespace-normal'>
              <Link to={linkPath}>{text}</Link>
            </div>
          </Tooltip>
        )
      }
    },
    {
      title: 'Start Price',
      dataIndex: 'startPrice',
      key: 'startPrice',
      width: 100,
      render: (value) => parsePriceVND(value)
    },
    {
      title: 'Buy Now Price',
      key: 'finalPriceSold',
      width: 100,
      render: (_value, record) => {
        // Chỉ hiển thị nếu KHÔNG phải là Reverse Auction
        if (record.lotType === 'Auction_Price_GraduallyReduced') {
          return '-'
        }
        if (record.lotType === 'Fixed_Price') {
          return parsePriceVND(record.buyNowPrice)
        }
        if (record.lotType === 'Secret_Auction') {
          return '-'
        }
        return parsePriceVND(record.finalPriceSold)
      }
    },
    {
      title: 'Max Price',
      key: 'finalPriceSold',
      width: 100,
      render: (_value, record) => {
        // Chỉ hiển thị nếu KHÔNG phải là Reverse Auction

        if (record.lotType === 'Secret_Auction') {
          return parsePriceVND(record.finalPriceSold)
        }
        return '-'
      }
    },
    {
      title: 'Bid Decrease',
      key: 'bidIncrement',
      width: 200,
      render: (_value, record) => {
        if (record.lotType === 'Auction_Price_GraduallyReduced') {
          return parsePriceVND(record.bidIncrement)
        } else {
          return '-'
        }
      }
    },
    {
      title: 'Bid Increment',
      dataIndex: 'bidIncrement',
      key: 'bidIncrement',
      width: 200,
      render: (value, record) => {
        if (record.lotType !== 'Auction_Price_GraduallyReduced') {
          return parsePriceVND(value)
        } else {
          return '-'
        }
      }
    },
    {
      title: 'Deposit',
      dataIndex: 'deposit',
      key: 'deposit',
      width: 100,
      render: (value) => parsePriceVND(value)
    },
    {
      title: 'Minimum Price (Reverse)',
      dataIndex: 'finalPriceSold',
      key: 'minimumPrice',
      width: 140,
      render: (value, record) => {
        // Chỉ hiển thị cho Reverse Auction
        if (record.lotType === 'Auction_Price_GraduallyReduced') {
          return parsePriceVND(value)
        }
        return '-'
      }
    },
    {
      title: 'Bid Decrement Time (Seconds)',
      dataIndex: 'bidIncrementTime',
      key: 'bidIncrementTime',
      width: 140,
      render: (value, record) => {
        if (record.lotType === 'Auction_Price_GraduallyReduced') {
          return value
        }
        return '-'
      }
    },
    {
      title: 'Actual End',
      width: 140,
      render: (_value, record) => {
        return <span> {parseDate(record.actualEndTime, 'dd/mm/yyyy hh:mm:ss')}</span>
      }
    },
    {
      title: 'Financial Proof',
      dataIndex: 'haveFinancialProof',
      key: 'haveFinancialProof',
      width: 80,
      align: 'center',
      render: (value) => (value ? 'Yes' : 'No')
    },
    {
      title: 'Extend',
      key: 'isExtend',
      align: 'center',
      render: (_, record) =>
        record.isExtend ? (
          <div className='flex flex-col items-center'>
            <div>Yes</div>
            {record.round && <div>Round: {record.round}</div>}
          </div>
        ) : (
          'No'
        )
    },
    {
      title: 'Lot Type',
      dataIndex: 'lotType',
      key: 'lotType',
      width: 100,
      render: (lotType) => {
        const { label, color } = getLotTypeConfig(lotType)
        return <Tag color={color}>{label}</Tag>
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status) => {
        let color = 'default'
        switch (status.toUpperCase()) {
          case 'WAITING':
            color = 'yellow'
            break
          case 'AUCTIONING':
            color = 'indigo'
            break
          case 'READY':
            color = 'green'
            break
          case 'SOLD':
            color = 'success'
            break
          case 'PASSED':
            color = 'error'
            break
          case 'UPCOMING':
            color = 'blue'
            break
          default:
            color = 'gray'
        }
        return <Tag color={color}>{status}</Tag>
      }
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => {
        if (roleId === RoleType.MANAGER) {
          if (auctionData?.data.status === 'Waiting' || auctionData?.data.status === 'UpComing') {
            return (
              <Space size='small'>
                <Button icon={<EditOutlined />} size='small' onClick={() => handleEdit(record)} />
                <Button icon={<DeleteOutlined />} size='small' danger />
              </Space>
            )
          }
          return null
        }
      }
    }
  ]
  const handleAdd = () => {
    setEditingLot(null)
    setModalVisible(true)
  }

  const handleEdit = (lot: ListLot) => {
    console.log('Edit lot:', lot)

    setEditingLot(lot)
    setModalVisible(true)
  }

  const handleModalCancel = () => {
    setModalVisible(false)
    setEditingLot(null)
  }

  const handleModalSubmit = async (values: Partial<CreateLot>) => {
    if (editingLot) {
      try {
        // Handle edit logic based on lot type
        switch (editingLot.lotType) {
          case 'Fixed_Price':
            await updateFixPriceLot({
              id: editingLot.id,
              title: values.title,
              deposit: values.deposit || 0,
              buyNowPrice: values.buyNowPrice || 0,
              haveFinancialProof: values.haveFinancialProof,
              staffId: values.staffId,
              jewelryId: values.jewelryId || editingLot.jewelryId,
              auctionId: values.auctionId || editingLot.auctionId
            }).unwrap()
            notification.success({
              message: 'Success',
              description: 'Fixed Price Lot updated successfully!'
            })
            break

          case 'Secret_Auction':
            await updateSecretLot({
              id: editingLot.id,
              title: values.title,
              round: values.round || 0,
              startPrice: values.startPrice || 0,
              haveFinancialProof: values.haveFinancialProof || false,
              staffId: values.staffId,
              auctionId: values.auctionId || editingLot.auctionId,
              jewelryId: values.jewelryId || editingLot.jewelryId,
              deposit: values.deposit || editingLot.deposit
            }).unwrap()
            notification.success({
              message: 'Success',
              description: 'Secret Auction Lot updated successfully!'
            })
            break

          case 'Public_Auction':
            await updatePublicLot({
              id: editingLot.id,
              title: values.title,
              startPrice: values.startPrice || 0,
              finalPriceSold: values.finalPriceSold || 0,
              bidIncrement: values.bidIncrement || 0,
              haveFinancialProof: values.haveFinancialProof || false,
              staffId: values.staffId,
              auctionId: values.auctionId || editingLot.auctionId,
              jewelryId: values.jewelryId || editingLot.jewelryId,
              deposit: values.deposit || editingLot.deposit,
              isHaveFinalPrice: values.isHaveFinalPrice || false,
              round: values.round || 0,
              isExtend: values.isExtend
            }).unwrap()
            notification.success({
              message: 'Success',
              description: 'Public Auction Lot updated successfully!'
            })
            break
          case 'Auction_Price_GraduallyReduced':
            await updatePriceGraduallyReduced({
              id: editingLot.id,
              title: values.title,
              startPrice: values.startPrice,
              finalPriceSold: values.finalPriceSold,
              bidIncrement: values.bidIncrement,
              deposit: values.deposit,
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
              description: 'Invalid lot type for editing'
            })
            break
        }
      } catch (error: any) {
        notification.error({
          message: 'Error',
          description: error.data?.message || 'Failed to update lot. Please try again.'
        })
      }
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
            }).unwrap()
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
              auctionId: values.auctionId,
              round: values.round,
              isHaveFinalPrice: values.isHaveFinalPrice
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
    Array.isArray(lotsData?.data) && lotsData.data.length > 0
      ? lotsData.data.filter((lot) => lot.title?.includes(searchText))
      : []

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className='p-5 rounded-lg bg-slate-50'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-xl font-semibold'>{auctionData?.data.name} - Lots List</h1>
          <Space>
            <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
              <Radio.Button value='table'>
                <UnorderedListOutlined /> Table
              </Radio.Button>
              <Radio.Button value='grid'>
                <AppstoreOutlined /> Grid
              </Radio.Button>
            </Radio.Group>
            <Input.Search
              placeholder='Search lots'
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            {auctionData?.data.status === 'Waiting' && (
              <Button type='primary' onClick={handleAdd}>
                + Add
              </Button>
            )}
          </Space>
        </div>

        {viewMode === 'table' ? (
          <Table
            columns={columns}
            dataSource={filteredLots || []}
            scroll={{ x: 'max-content' }}
            bordered
            rowKey='id'
            pagination={{
              pageSize: 5
            }}
            size='middle'
            loading={isLoading}
          />
        ) : (
          <LotGridView lots={filteredLots} onEdit={handleEdit} roleId={roleId as unknown as number} />
        )}
      </div>

      {auctionData && (
        <AddLotModal
          isLoading={
            loadingFixedPrice ||
            loadingSecret ||
            loadingPublice ||
            loadingReduce ||
            loadingUpdateFixPriceLot ||
            loadingUpdateSecretLot ||
            loadingUpdatePublic ||
            loadingUpdateReveres
          }
          auctionData={auctionData.data}
          visible={modalVisible}
          onCancel={handleModalCancel}
          onSubmit={handleModalSubmit}
          initialValues={editingLot || ({} as ListLot)}
        />
      )}
    </>
  )
}

export default LotList
