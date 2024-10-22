import React, { useState } from 'react'
import { Button, Modal, Select, Input, Spin, notification } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useViewListLotTypeQuery } from '../../../../../services/bidtype.services'
import { useRequestFinalValuationForManagerMutation } from '../../../../../services/valuation.services'

const { Option } = Select

interface FinalDetailProps {
  isVisible: boolean
  onCancel: () => void
  onUpdate: () => void
  record: any
  setStatus: (status: any) => void
}

const FinalDetail: React.FC<FinalDetailProps> = ({ isVisible, onCancel, onUpdate, record, setStatus }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = record?.imageValuations?.map((img: any) => img.imageLink) || [
    'https://via.placeholder.com/150?text=No+Image'
  ]

  const [startingPrice, setStartingPrice] = useState<number | undefined>(undefined)
  const [bidForm, setBidForm] = useState<number | undefined>(undefined)
  const [timeBidding, setTimeBidding] = useState<string | undefined>(undefined)

  const { data: auctionMethods, isLoading, isError, refetch } = useViewListLotTypeQuery(undefined)
  const [requestFinalValuationForManager] = useRequestFinalValuationForManagerMutation()

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  if (isLoading) return <Spin />
  if (isError) return <div>Error loading auction methods. Please try again later.</div>

  const lotTypes = auctionMethods?.data || []

  const handleUpdate = async () => {
    if (startingPrice === undefined || bidForm === undefined || !timeBidding) {
      notification.error({ message: 'Error', description: 'Please fill in all fields before sending.' })
      return
    }

    const requestData = {
      startingPrice,
      bidForm,
      time_Bidding: timeBidding,
      jewelryId: record?.jewelry?.id
    }

    try {
      await requestFinalValuationForManager(requestData).unwrap()
      notification.success({ message: 'Success', description: 'Final valuation requested successfully.' })

      await refetch()
      onUpdate()
      onCancel()
    } catch (error) {
      notification.error({ message: 'Error', description: 'Error requesting final valuation. Please try again.' })
    }
  }

  return (
    <Modal
      title='Final Valuation Details'
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='update' type='primary' onClick={handleUpdate}>
          Send
        </Button>
      ]}
      width={1100}
    >
      <div className='grid grid-cols-2 gap-6'>
        <div className='relative'>
          <div className='flex items-center justify-center mb-4'>
            <img src={images[currentImageIndex]} alt='product' className='max-w-full rounded-lg' />
          </div>
          <div className='absolute inset-y-0 left-0 flex items-center justify-center pl-3'>
            <Button icon={<LeftOutlined />} onClick={prevImage} className='bg-gray-300 hover:bg-gray-400' />
          </div>
          <div className='absolute inset-y-0 right-0 flex items-center justify-center pr-3'>
            <Button icon={<RightOutlined />} onClick={nextImage} className='bg-gray-300 hover:bg-gray-400' />
          </div>
        </div>

        <div>
          <p className='mb-2 text-xl font-bold'>{record?.id}</p>
          <p className='mb-6 text-xl font-bold'>{record?.jewelry?.name}</p>

          <p className='mb-4'>
            <strong>Customer Name:</strong> {record?.seller?.firstName} {record?.seller?.lastName}
          </p>
          <p className='mb-4'>
            <strong>Email:</strong> {record?.seller?.accountDTO?.email}
          </p>
          <p className='mb-4'>
            <strong>Phone:</strong> {record?.seller?.accountDTO?.phoneNumber}
          </p>

          <p className='mb-4'>
            <strong>Estimated Price:</strong> {record?.jewelry?.estimatePriceMin} - {record?.jewelry?.estimatePriceMax}{' '}
            VND
          </p>

          <p className='mb-4'>
            <strong>Starting Price:</strong> {record?.jewelry?.startingPrice} VND
          </p>

          <p className='mb-4'>
            <strong>Artist:</strong> {record?.jewelry?.artist?.name}
          </p>
          <p className='mb-4'>
            <strong>Category:</strong> {record?.jewelry?.category?.name}
          </p>

          <p className='mb-4'>
            <strong>Final Price:</strong>
            <span className='font-bold text-red-800'> {record?.jewelry?.specificPrice} VND</span>
          </p>
          <p className='mt-4 font-bold'>
            <strong>Status:</strong> {record?.status}
          </p>

          {record?.status === 'FinalValuated' && (
            <>
              <div className='mb-4'>
                <strong>Giá khởi điểm:</strong>
                <Input
                  placeholder='Nhập giá khởi điểm'
                  className='mt-2'
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(Number(e.target.value))}
                />
              </div>

              <div className='mb-4'>
                <strong>Phương thức đấu giá:</strong>
                <br />
                <Select placeholder='Chọn phương thức đấu giá' className='mt-2' onChange={(value) => setBidForm(value)}>
                  {lotTypes.map((method: any) => (
                    <Option key={method.value} value={method.value}>
                      {method.name}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className='mb-4'>
                <strong>Thời điểm đấu giá:</strong>
                <Input
                  type='datetime-local'
                  className='mt-2'
                  value={timeBidding}
                  onChange={(e) => setTimeBidding(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default FinalDetail
