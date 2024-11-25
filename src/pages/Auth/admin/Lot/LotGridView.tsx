import React from 'react'
import { Card, Tag, Row, Col, Tooltip, Typography, Space } from 'antd'
import { ShoppingOutlined, LockOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography

interface ListLot {
  id: number
  startPrice: number
  currentPrice: number
  finalPriceSold: number
  status: string
  bidIncrement: number
  deposit: number
  buyNowPrice: number
  floorFeePercent: number
  startTime: string
  endTime: string
  actualEndTime: string
  isExtend: boolean
  haveFinancialProof: boolean
  lotType: string
  imageLinkJewelry: string
  sellerId: number
  staffId: number
  jewelryId: number
  auctionId: number
  title: string
}

interface LotTypeConfig {
  label: string
  color: string
  icon: React.ReactNode
  description: string
}

interface LotGridViewProps {
  lots: ListLot[]
  onEdit: (lot: ListLot) => void
  roleId: number
}

const LotGridView: React.FC<LotGridViewProps> = ({ lots, onEdit }) => {
  //roleid sau
  const getLotTypeConfig = (lotType: string): LotTypeConfig => {
    const config: Record<string, LotTypeConfig> = {
      Fixed_Price: {
        label: 'Fixed Price',
        color: 'success',
        icon: <ShoppingOutlined />,
        description: 'Buy instantly at a set price'
      },
      Secret_Auction: {
        label: 'Secret Auction',
        color: 'processing',
        icon: <LockOutlined />,
        description: 'Bid within price range'
      },
      Public_Auction: {
        label: 'Public Auction',
        color: 'error',
        icon: <RiseOutlined />,
        description: 'Bid openly with increments'
      },
      Auction_Price_GraduallyReduced: {
        label: 'Reverse Auction',
        color: 'purple',
        icon: <FallOutlined />,
        description: 'Price reduces until someone buys'
      }
    }
    return config[lotType] || { label: lotType, color: 'default', icon: null, description: '' }
  }

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      WAITING: 'warning',
      AUCTIONING: 'processing',
      READY: 'success',
      SOLD: 'success',
      PASSED: 'error',
      UPCOMING: 'blue'
    }
    return colors[status.toUpperCase()] || 'default'
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const PriceDisplay: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className='mb-4 last:mb-0'>
      <Text className='block mb-1 text-sm text-gray-500'>{label}</Text>
      <Tooltip title={`${formatPrice(value)} đ`}>
        <Text className='block overflow-hidden text-xl font-semibold whitespace-nowrap text-ellipsis max-w-[150px] cursor-help'>
          {formatPrice(value)} đ
        </Text>
      </Tooltip>
    </div>
  )

  const renderPriceInfo = (lot: ListLot) => {
    switch (lot.lotType) {
      case 'Fixed_Price':
        return (
          <Card size='small' className='bg-gray-50'>
            <PriceDisplay label='Buy Now Price' value={lot.buyNowPrice} />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className='mb-4 last:mb-0'>
                  <Text className='block mb-1 text-sm text-gray-500'>Floor Fee</Text>
                  <Text className='block text-xl font-semibold'>{lot.floorFeePercent}%</Text>
                </div>
              </Col>
            </Row>
            <Row gutter={[16, 16]} className='mt-4'>
              <Col span={12}>
                <Text className='block mb-1 text-sm text-gray-500'>Extendable</Text>
                <Text>{lot.isExtend ? 'Yes' : 'No'}</Text>
              </Col>
              <Col span={12}>
                <Text className='block mb-1 text-sm text-gray-500'>Financial Proof</Text>
                <Text>{lot.haveFinancialProof ? 'Yes' : 'No'}</Text>
              </Col>
            </Row>
          </Card>
        )

      case 'Secret_Auction':
        return (
          <Card size='small' className='bg-gray-50'>
            <PriceDisplay label='Start Price' value={lot.startPrice} />
            <PriceDisplay label='Max Price' value={lot.finalPriceSold} />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className='mb-4 last:mb-0'>
                  <Text className='block mb-1 text-sm text-gray-500'>Floor Fee</Text>
                  <Text className='block text-xl font-semibold'>{lot.floorFeePercent}%</Text>
                </div>
              </Col>
            </Row>
            <Row gutter={[16, 16]} className='mt-4'>
              <Col span={12}>
                <Text className='block mb-1 text-sm text-gray-500'>Extendable</Text>
                <Text>{lot.isExtend ? 'Yes' : 'No'}</Text>
              </Col>
              <Col span={12}>
                <Text className='block mb-1 text-sm text-gray-500'>Financial Proof</Text>
                <Text>{lot.haveFinancialProof ? 'Yes' : 'No'}</Text>
              </Col>
            </Row>
          </Card>
        )

      case 'Public_Auction':
        return (
          <Card size='small' className='bg-gray-50'>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <PriceDisplay label='Start Price' value={lot.startPrice} />
              </Col>
              <Col span={12}>
                <PriceDisplay label='Buy Now Price' value={lot.finalPriceSold} />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <PriceDisplay label='Step Bid Increment' value={lot.bidIncrement} />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className='mb-4 last:mb-0'>
                  <Text className='block mb-1 text-sm text-gray-500'>Floor Fee</Text>
                  <Text className='block text-xl font-semibold'>{lot.floorFeePercent}%</Text>
                </div>
              </Col>
            </Row>
            <Row gutter={[16, 16]} className='mt-4'>
              <Col span={12}>
                <Text className='block mb-1 text-sm text-gray-500'>Extendable</Text>
                <Text>{lot.isExtend ? 'Yes' : 'No'}</Text>
              </Col>
              <Col span={12}>
                <Text className='block mb-1 text-sm text-gray-500'>Financial Proof</Text>
                <Text>{lot.haveFinancialProof ? 'Yes' : 'No'}</Text>
              </Col>
            </Row>
          </Card>
        )

      case 'Auction_Price_GraduallyReduced':
        return (
          <Card size='small' className='bg-gray-50'>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <PriceDisplay label='Start Price' value={lot.startPrice} />
              </Col>
              <Col span={12}>
                <PriceDisplay label='Min decrease' value={lot.finalPriceSold} />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <PriceDisplay label='Price Decrease' value={lot.bidIncrement} />
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className='mb-4 last:mb-0'>
                  <Text className='block mb-1 text-sm text-gray-500'>Floor Fee</Text>
                  <Text className='block text-xl font-semibold'>{lot.floorFeePercent}%</Text>
                </div>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className='mt-4'>
              <Col span={12}>
                <Text className='block mb-1 text-sm text-gray-500'>Extendable</Text>
                <Text>{lot.isExtend ? 'Yes' : 'No'}</Text>
              </Col>
              <Col span={12}>
                <Text className='block mb-1 text-sm text-gray-500'>Financial Proof</Text>
                <Text>{lot.haveFinancialProof ? 'Yes' : 'No'}</Text>
              </Col>
            </Row>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <Row gutter={[16, 16]}>
      {lots.map((lot) => (
        <Col xs={24} sm={12} lg={8} xl={6} key={lot.id}>
          <Card
            hoverable
            actions={[
              <Link to={''}>
                <EyeOutlined key='view' />
              </Link>,
              <EditOutlined key='edit' />,
              <DeleteOutlined key='delete' />
            ]}
          >
            <Space direction='vertical' size='middle' className='w-full'>
              {/* Header */}
              <div className='flex items-start justify-between'>
                <Tooltip title={getLotTypeConfig(lot.lotType).description}>
                  <Tag icon={getLotTypeConfig(lot.lotType).icon} color={getLotTypeConfig(lot.lotType).color}>
                    {getLotTypeConfig(lot.lotType).label}
                  </Tag>
                </Tooltip>
                <Tag color={getStatusColor(lot.status)}>{lot.status}</Tag>
              </div>

              {/* Title */}
              <div>
                <Title level={5} className='m-0'>
                  {lot.title}
                </Title>
                <Text type='secondary'>ID: {lot.id}</Text>
              </div>

              {/* Price Information */}
              {renderPriceInfo(lot)}

              {/* Deposit */}
              <Card size='small' className='bg-gray-50'>
                <PriceDisplay label='Deposit Required' value={lot.deposit} />
              </Card>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default LotGridView
