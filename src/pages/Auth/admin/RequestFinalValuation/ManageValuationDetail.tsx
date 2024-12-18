import { FilePdfOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Modal, Spin } from 'antd'
import React, { useState } from 'react'
import { useGetValuationByIdQuery } from '../../../../services/valuation.services'

interface ManageValuationDetailProps {
  recordId: number
  isVisible: boolean
  onCancel: () => void
  setStatus: (status: string) => void
  refetch: () => void
}

const ManageValuationDetail: React.FC<ManageValuationDetailProps> = ({ recordId, isVisible, onCancel }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const {
    data: valuationData,
    isLoading: valuationLoading,
    error: valuationError
  } = useGetValuationByIdQuery({ id: recordId })
  console.log('Valuation Data: ', valuationData)

  const images = valuationData?.data?.imageValuations || [
    { imageLink: 'https://via.placeholder.com/150?text=No+Image', defaultImage: null }
  ]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }
  const openModal = () => setIsModalVisible(true)
  const closeModal = () => setIsModalVisible(false)
  const handleReceiptLinkClick = () => {
    if (valuationData?.data?.status === 'RecivedJewelry') {
      if (valuationData?.data?.valuationDocuments?.length > 0) {
        const receiptLink = valuationData?.data?.valuationDocuments[0]?.documentLink

        if (receiptLink) {
          window.open(receiptLink, '_blank')
        } else {
          console.error('No document link found.')
        }
      } else {
        console.error('No valuation documents found.')
      }
    } else {
      console.error('Access denied: Status is not RecivedJewelry.')
    }
  }
  const renderImageOrLink = (image: any, index: number) => {
    if (image.defaultImage === 'PDF') {
      return (
        <a
          key={index}
          href={image.imageLink}
          target='_blank'
          rel='noopener noreferrer'
          className='w-[100px] h-[100px] flex items-center justify-center bg-gray-200 rounded-lg mx-2 cursor-pointer border'
        >
          <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
        </a>
      )
    } else {
      return (
        <img
          key={index}
          src={image.imageLink}
          alt={`thumb-${index}`}
          className='w-[100px] h-[100px] object-cover rounded-lg mx-2 cursor-pointer border'
          onClick={() => setCurrentImageIndex(index)}
        />
      )
    }
  }
  if (valuationLoading) {
    return <Spin tip='Loading...' />
  }

  if (valuationError) {
    return <p>Error fetching valuation details</p>
  }

  return (
    <Modal
      title='Preliminary Valuation Detail'
      onCancel={onCancel}
      open={isVisible}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>
      ]}
      width={1200}
      style={{ padding: '24px' }}
    >
      <div className='grid grid-cols-2 gap-6 mt-10'>
        <div className='relative'>
          <div className='flex items-center justify-center mb-4'>
            {images[currentImageIndex]?.defaultImage === 'PDF' ? (
              <a
                href={images[currentImageIndex]?.imageLink}
                target='_blank'
                rel='noopener noreferrer'
                className='w-[450px] h-[500px] flex items-center justify-center bg-gray-200 rounded-lg cursor-pointer border font-bold'
              >
                <FilePdfOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
                GIA
              </a>
            ) : (
              <img
                src={images[currentImageIndex]?.imageLink}
                alt='product'
                onClick={openModal}
                className='w-[450px] h-[500px] object-cover rounded-lg'
              />
            )}
          </div>
          <div className='absolute top-56 left-0 flex items-center justify-center pl-3'>
            <Button icon={<LeftOutlined />} onClick={prevImage} className='bg-gray-300 hover:bg-gray-400' />
          </div>
          <div className='absolute top-56 right-0 flex items-center justify-center pr-3'>
            <Button icon={<RightOutlined />} onClick={nextImage} className='bg-gray-300 hover:bg-gray-400' />
          </div>
          <div className='flex ml-10 mt-10'>
            {valuationData?.data?.imageValuations?.map(renderImageOrLink) || <p>No images available</p>}
          </div>
        </div>
        <Modal open={isModalVisible} footer={null} onCancel={closeModal} width='40%'>
          <img
            src={images[currentImageIndex]?.imageLink}
            alt='product zoomed'
            className='w-full h-auto object-contain'
          />
        </Modal>
        <div>
          <p className='mb-2 text-xl font-bold'>{valuationData?.data?.id}</p>
          <p className='mb-6 text-xl font-bold'>{valuationData?.data?.name}</p>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Customer Name:</strong>
            <span>
              {valuationData?.data?.seller?.firstName} {valuationData?.data?.seller?.lastName}
            </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Email:</strong>
            <span>{valuationData?.data?.seller?.accountDTO?.email}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Phone:</strong>
            <span>{valuationData?.data?.seller?.accountDTO?.phoneNumber}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Height:</strong>
            <span>{valuationData?.data?.height} cm</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Width:</strong>
            <span>{valuationData?.data?.width} cm</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Depth:</strong>
            <span>{valuationData?.data?.depth} cm</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Description:</strong>
            <span>{valuationData?.data?.description}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Estimate Price:</strong>
            <span className='font-bold text-red-800'>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                valuationData?.data?.estimatePriceMin || 0
              )}{' '}
              -{' '}
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                valuationData?.data?.estimatePriceMax || 0
              )}
            </span>
          </div>

          <div className='flex mb-4'>
            <strong className='w-1/3'>Status:</strong>
            <span className='font-bold text-red-800'>{valuationData?.data?.status}</span>
          </div>
          {valuationData?.data?.status === 'RecivedJewelry' && (
            <div className='flex mb-4'>
              <strong className='w-1/3'>Receipt:</strong>
              <p className='italic text-blue-500 cursor-pointer' onClick={handleReceiptLinkClick}>
                Receipt Link
              </p>
            </div>
          )}
        </div>
      </div>

      <div className='mt-6'>
        <p className='italic font-bold text-red-500'>
          Note: If customers accept this price, please send jewelry to the address below.
        </p>
        <p className='italic font-bold text-red-500'>
          S10.05(VHGP), Nguyen Xien Street, Long Binh Ward, Thu Duc District, Ho Chi Minh City
        </p>
      </div>
    </Modal>
  )
}

export default ManageValuationDetail
