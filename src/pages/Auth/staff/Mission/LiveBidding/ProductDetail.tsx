import React, { ReactNode, useEffect, useId, useState } from 'react'
import { Carousel, Descriptions, Typography, Collapse, Image, Space, Tag } from 'antd'
import { LotDetail } from '../../../../../types/Lot.type'
import { Link } from 'react-router-dom'
import { convertArrayImages, parsePriceVND } from '../../../../../utils/convertTypeDayjs'

const { Title } = Typography

interface ProductDetailProps {
  item: LotDetail
}

const ImageSlider: React.FC<{ images: string[] }> = ({ images }) => {
  const [listImage, setImages] = useState<string[]>([])
  const id = useId()

  useEffect(() => {
    setImages(images) // Set the images from props
  }, [images])

  return (
    <div className='flex justify-center w-full image-slider'>
      <Carousel autoplay dots arrows className='w-full max-w-lg'>
        {Array.isArray(listImage) && listImage.length > 0 ? (
          listImage.map((image, index) => (
            <div key={id} className='flex items-center justify-center'>
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

const ProductDetail: React.FC<ProductDetailProps> = ({ item }) => {
  const characteristicsId = useId()
  const mainDiamondsId = useId()
  const secondaryDiamondsId = useId()
  const mainShaphiesId = useId()
  const valuationId = useId()

  const basicInfo = [
    { label: 'Lot ID', children: item.id },
    { label: 'Status', children: <Tag>{item.status}</Tag> },
    { label: 'Type', children: item.lotType },
    { label: 'Artist', children: item.jewelry.artist?.name || 'N/A' },
    { label: 'Category', children: item.jewelry.category?.name || 'N/A' },
    { label: 'Start Price', children: item.startPrice !== undefined ? parsePriceVND(item.startPrice) : 'N/A' },
    { label: 'Final Price', children: item.finalPriceSold !== undefined ? parsePriceVND(item.finalPriceSold) : 'N/A' },
    { label: 'Deposit', children: item.deposit !== undefined ? parsePriceVND(item.deposit) : 'N/A' },
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

  const getCollapseItems = () => {
    const items: Array<{
      key: string
      label: string
      children: ReactNode
    }> = [
      {
        key: characteristicsId,
        label: 'Key Characteristics',
        children: (
          <Descriptions
            bordered
            column={1}
            items={item.jewelry.keyCharacteristicDetails.map((detail) => ({
              label: detail.keyCharacteristic.name,
              children: detail.description
            }))}
          />
        )
      }
    ]

    if (item.jewelry.mainDiamonds.length > 0) {
      items.push({
        key: mainDiamondsId,
        label: 'Main Diamonds',
        children: item.jewelry.mainDiamonds.map((diamond, index) => (
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
        ))
      })
    }

    if (item.jewelry.secondaryDiamonds.length > 0) {
      items.push({
        key: secondaryDiamondsId,
        label: 'Secondary Diamonds',
        children: item.jewelry.secondaryDiamonds.map((diamond, index) => (
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
        ))
      })
    }

    if (item.jewelry.mainShaphies.length > 0) {
      items.push({
        key: mainShaphiesId,
        label: 'Main Shaphies',
        children: item.jewelry.mainShaphies.map((Shaphies, index) => (
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
        ))
      })
    }

    if (item.jewelry.valuation) {
      items.push({
        key: valuationId,
        label: 'Valuation Information',
        children: (
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
        )
      })
    }

    return items
  }

  return (
    <Space direction='vertical' size='large' style={{ width: '100%' }}>
      <ImageSlider images={listImage} />
      <Title level={2}>{item.jewelry.name}</Title>
      <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }} items={basicInfo} />
      <Title level={5}>
        Price Range:
        {item.jewelry.estimatePriceMin !== undefined ? parsePriceVND(item.jewelry.estimatePriceMin) : 'N/A'} -{' '}
        {item.jewelry.estimatePriceMax !== undefined ? parsePriceVND(item.jewelry.estimatePriceMax) : 'N/A'}
      </Title>
      <Collapse items={getCollapseItems()} />
    </Space>
  )
}

export default ProductDetail
