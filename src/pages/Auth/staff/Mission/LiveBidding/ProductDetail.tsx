import React, { useEffect, useState } from 'react'
import { Carousel, Descriptions, Typography, Collapse, Image, Space, Tag } from 'antd'
import { LotDetail } from '../../../../../types/Lot.type'
import { Link } from 'react-router-dom'
import { convertArrayImages } from '../../../../../utils/convertTypeDayjs'

const { Title } = Typography
const { Panel } = Collapse

interface ProductDetailProps {
  item: LotDetail
}

const ImageSlider: React.FC<{ images: string[] }> = ({ images }) => {
  const [listImage, setImages] = useState<string[]>([])

  useEffect(() => {
    setImages(images) // Set the images from props
  }, [images])

  return (
    <div className='flex justify-center w-full image-slider'>
      <Carousel autoplay dots arrows className='w-full max-w-lg'>
        {Array.isArray(listImage) && listImage.length > 0 ? (
          listImage.map((image, index) => (
            <div key={index} className='flex items-center justify-center'>
              <Image
                src={image}
                alt={`Product image ${index + 1}`}
                style={{ width: '100%', height: '500px', objectFit: 'contain' }}
                preview={{ mask: 'Click to view' }}
                className='rounded-lg'
              />
            </div>
          ))
        ) : (
          <div>No images available</div> // Fallback for no images
        )}
      </Carousel>
    </div>
  )
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString()
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const ProductDetail: React.FC<ProductDetailProps> = ({ item }) => {
  const basicInfo = [
    { label: 'Lot ID', children: item.id },
    { label: 'Status', children: <Tag>{item.status}</Tag> },
    { label: 'Type', children: item.lotType },
    { label: 'Artist', children: item.jewelry.artist?.name || 'N/A' },
    { label: 'Category', children: item.jewelry.category?.name || 'N/A' },
    { label: 'Start Price', children: item.startPrice !== undefined ? formatCurrency(item.startPrice) : 'N/A' },
    { label: 'Final Price', children: item.finalPriceSold !== undefined ? formatCurrency(item.finalPriceSold) : 'N/A' },
    { label: 'Deposit', children: item.deposit !== undefined ? formatCurrency(item.deposit) : 'N/A' },
    { label: 'Floor Fee', children: `${item.floorFeePercent}%` },
    { label: 'Start Time', children: formatDate(item.startTime) },
    { label: 'End Time', children: formatDate(item.endTime) },
    { label: 'Actual End Time', children: formatDate(item.actualEndTime) },
    { label: 'Is Extend', children: item.isExtend ? 'Yes' : 'No' },
    { label: 'Have Financial Proof', children: item.haveFinancialProof ? 'Yes' : 'No' },
    {
      label: 'Seller',
      children: item.jewelry.valuation?.seller
        ? `${item.jewelry.valuation.seller.id} - ${item.jewelry.valuation.seller.firstName} ${item.jewelry.valuation.seller.lastName}`
        : 'N/A'
    }
  ]

  const listImage: string[] = convertArrayImages(item)

  return (
    <Space direction='vertical' size='large' style={{ width: '100%' }}>
      <ImageSlider images={listImage} />
      <Title level={2}>{item.jewelry.name}</Title>
      <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }} items={basicInfo} />
      <Title level={5}>
        Price Range:
        {item.jewelry.estimatePriceMin !== undefined ? formatCurrency(item.jewelry.estimatePriceMin) : 'N/A'} -{' '}
        {item.jewelry.estimatePriceMax !== undefined ? formatCurrency(item.jewelry.estimatePriceMax) : 'N/A'}
      </Title>
      <Collapse>
        <Panel header='Key Characteristics' key='1'>
          <Descriptions
            bordered
            column={1}
            items={item.jewelry.keyCharacteristicDetails.map((detail) => ({
              label: detail.keyCharacteristic.name,
              children: detail.description
            }))}
          />
        </Panel>
        {item.jewelry.mainDiamonds.length > 0 && (
          <Panel header='Main Diamonds' key='2'>
            {item.jewelry.mainDiamonds.map((diamond, index) => (
              <Descriptions
                key={index}
                title={diamond.name}
                bordered
                column={1}
                items={[
                  { label: 'Color', children: diamond.color },
                  { label: 'Cut', children: diamond.cut },
                  { label: 'Clarity', children: diamond.clarity },
                  { label: 'Quantity', children: diamond.quantity },
                  { label: 'Certificate', children: diamond.certificate },
                  { label: 'Fluorescence', children: diamond.fluorescence },
                  { label: 'Length Width Ratio', children: diamond.lengthWidthRatio },
                  { label: 'Type', children: diamond.type },
                  { label: 'Shape', children: diamond.shape },
                  {
                    label: 'Document',
                    children: diamond.documentDiamonds.map((doc, docIndex) => (
                      <div key={docIndex}>
                        <Link to={doc.documentLink} target='_blank' rel='noopener noreferrer'>
                          {doc.documentLink}
                        </Link>
                      </div>
                    ))
                  }
                ]}
              />
            ))}
          </Panel>
        )}

        {item.jewelry.secondaryDiamonds.length > 0 && (
          <Panel header='Secondary Diamonds' key='3'>
            {item.jewelry.secondaryDiamonds.map((diamond, index) => (
              <Descriptions
                key={index}
                title={diamond.name}
                bordered
                column={1}
                items={[
                  { label: 'Color', children: diamond.color },
                  { label: 'Cut', children: diamond.cut },
                  { label: 'Clarity', children: diamond.clarity },
                  { label: 'Quantity', children: diamond.quantity },
                  { label: 'Certificate', children: diamond.certificate },
                  { label: 'Fluorescence', children: diamond.fluorescence },
                  { label: 'Length Width Ratio', children: diamond.lengthWidthRatio },
                  { label: 'Type', children: diamond.type },
                  { label: 'Shape', children: diamond.shape },
                  {
                    label: 'Document',
                    children: diamond.documentDiamonds.map((doc, docIndex) => (
                      <div key={docIndex}>
                        <Link to={doc.documentLink} target='_blank' rel='noopener noreferrer'>
                          {doc.documentLink}
                        </Link>
                      </div>
                    ))
                  }
                ]}
              />
            ))}
          </Panel>
        )}

        {item.jewelry.mainShaphies.length > 0 && (
          <Panel header='Main Shaphies' key='4'>
            {item.jewelry.mainShaphies.map((Shaphies, index) => (
              <Descriptions
                key={index}
                title={Shaphies.name}
                bordered
                column={1}
                items={[
                  { label: 'Color', children: Shaphies.color },
                  { label: 'Carat', children: Shaphies.carat },
                  { label: 'Dimesion', children: Shaphies.dimension },
                  { label: 'Enhancement Type', children: Shaphies.enhancementType },
                  { label: 'Quantity', children: Shaphies.quantity },
                  {
                    label: 'Document',
                    children: Shaphies.documentShaphies.map((doc, docIndex) => (
                      <div key={docIndex}>
                        <Link to={doc.documentLink} target='_blank' rel='noopener noreferrer'>
                          {doc.documentLink}
                        </Link>
                      </div>
                    ))
                  }
                ]}
              />
            ))}
          </Panel>
        )}

        {item.jewelry.valuation && (
          <Panel header='Valuation Information' key='4'>
            <Descriptions
              bordered
              column={1}
              items={[
                { label: 'Valuation Date', children: formatDate(item.jewelry.valuation.pricingTime) },
                { label: 'Status', children: item.jewelry.valuation.status },
                { label: 'Actual Status', children: item.jewelry.valuation.actualStatusOfJewelry },
                {
                  label: 'Dimensions',
                  children: `${item.jewelry.valuation.height}h x ${item.jewelry.valuation.width}w x ${item.jewelry.valuation.depth}d`
                }
              ]}
            />
          </Panel>
        )}
      </Collapse>
    </Space>
  )
}

export default ProductDetail
