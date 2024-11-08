import React, { useState } from 'react'
import { Button, Modal, Select, Input, Spin, notification } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useViewListLotTypeQuery } from '../../../../../services/bidtype.services'
import { useRequestFinalValuationForManagerMutation } from '../../../../../services/valuation.services'
import { Image as AntImage } from 'antd'

const { Option } = Select

interface FinalDetailProps {
  isVisible: boolean
  onCancel: () => void
  onUpdate: () => void
  record: any
  setStatus: (status: any) => void
}

const FinalDetail: React.FC<FinalDetailProps> = ({ isVisible, onCancel, onUpdate, record, setStatus }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = record?.jewelry?.imageJewelries?.map((img: any) => img.imageLink) || [
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
  const openModal = () => setIsModalVisible(true)
  const closeModal = () => setIsModalVisible(false)
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
      width={1200}
      style={{ padding: '24px' }}
    >
      <div className='grid grid-cols-2 gap-6 mt-10'>
        <div className='relative'>
          <div className='flex items-center justify-center mb-4'>
            <img
              src={images[currentImageIndex]}
              alt='product'
              onClick={openModal}
              className='w-[450px] h-[500px] object-cover rounded-lg'
            />
          </div>

          <div className='absolute top-56 left-0 flex items-center justify-center pl-3'>
            <Button icon={<LeftOutlined />} onClick={prevImage} className='bg-gray-300 hover:bg-gray-400' />
          </div>
          <div className='absolute top-56 right-0 flex items-center justify-center pr-3'>
            <Button icon={<RightOutlined />} onClick={nextImage} className='bg-gray-300 hover:bg-gray-400' />
          </div>

          <div className='flex ml-10 mt-10'>
            {images.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={`thumb-${index}`}
                className='w-[100px] h-[100px] object-cover rounded-lg mx-2 cursor-pointer border'
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        <Modal open={isModalVisible} footer={null} onCancel={closeModal} width='40%'>
          <img src={images[currentImageIndex]} alt='product zoomed' className='w-full h-auto object-contain' />
        </Modal>
        <div>
          <p className='mb-2 text-xl font-bold'>{record?.id}</p>
          <p className='mb-6 text-xl font-bold'>{record?.jewelry?.name}</p>

          {record?.seller?.firstName && record?.seller?.lastName && (
            <div className='flex mb-4'>
              <strong className='w-1/3'>Customer Name:</strong>
              <span>
                {record?.seller?.firstName} {record?.seller?.lastName}
              </span>
            </div>
          )}

          {record?.seller?.accountDTO?.email && (
            <div className='flex mb-4'>
              <strong className='w-1/3'>Email:</strong>
              <span>{record?.seller?.accountDTO?.email}</span>
            </div>
          )}

          {record?.seller?.accountDTO?.phoneNumber && (
            <div className='flex mb-4'>
              <strong className='w-1/3'>Phone:</strong>
              <span>{record?.seller?.accountDTO?.phoneNumber}</span>
            </div>
          )}

          {record?.jewelry?.artist?.name && (
            <div className='flex mb-4'>
              <strong className='w-1/3'>Artist:</strong>
              <span className='text-blue-800'>{record?.jewelry?.artist?.name}</span>
            </div>
          )}

          {record?.jewelry?.category?.name && (
            <div className='flex mb-4'>
              <strong className='w-1/3'>Category:</strong>
              <span className='text-blue-800'>{record?.jewelry?.category?.name}</span>
            </div>
          )}

          {(record?.jewelry?.estimatePriceMin || record?.jewelry?.estimatePriceMax) && (
            <div className='flex mb-4'>
              <strong className='w-1/3'>Estimated Price:</strong>
              <span>
                {record?.jewelry?.estimatePriceMin} - {record?.jewelry?.estimatePriceMax} VND
              </span>
            </div>
          )}

          {record?.jewelry?.startingPrice && (
            <div className='flex mb-4'>
              <strong className='w-1/3'>Starting Price:</strong>
              <span>{record?.jewelry?.startingPrice} VND</span>
            </div>
          )}

          {record?.jewelry?.specificPrice && (
            <div className='flex mb-4'>
              <strong className='w-1/3'>Final Price:</strong>
              <span className='font-bold text-red-800'>{record?.jewelry?.specificPrice} VND</span>
            </div>
          )}

          {record?.jewelry?.keyCharacteristicDetails?.length > 0 && (
            <div>
              <strong className='w-full block mb-4'>Key Characteristics</strong>
              {record?.jewelry?.keyCharacteristicDetails.map((detail: any) => (
                <div key={detail.id} className='flex mb-2 ml-10'>
                  <div className='w-1/4 font-medium'>{detail.keyCharacteristic.name}:</div>
                  <span className='w-2/3'>{detail.description}</span>
                </div>
              ))}
            </div>
          )}

          {record?.jewelry?.mainDiamonds?.length && (
            <div>
              <div className='w-full block mb-4 font-bold'>Main Diamonds</div>
              {record?.jewelry?.mainDiamonds.map((diamond: any) => (
                <div key={diamond.id} className='mb-4 ml-10'>
                  {diamond.name && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Name:</div>
                      <span className='w-2/3'>{diamond.name}</span>
                    </div>
                  )}

                  {diamond.color && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Color:</div>
                      <span className='w-2/3'>{diamond.color}</span>
                    </div>
                  )}

                  {diamond.cut && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Cut:</div>
                      <span className='w-2/3'>{diamond.cut}</span>
                    </div>
                  )}

                  {diamond.clarity && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Clarity:</div>
                      <span className='w-2/3'>{diamond.clarity}</span>
                    </div>
                  )}

                  {diamond.quantity && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Quantity:</div>
                      <span className='w-2/3'>{diamond.quantity}</span>
                    </div>
                  )}

                  {diamond.settingType && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Setting Type:</div>
                      <span className='w-2/3'>{diamond.settingType}</span>
                    </div>
                  )}

                  {diamond.dimension && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Dimension:</div>
                      <span className='w-2/3'>{diamond.dimension}</span>
                    </div>
                  )}

                  {diamond.shape && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Shape:</div>
                      <span className='w-2/3'>{diamond.shape}</span>
                    </div>
                  )}

                  {diamond.certificate && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Certificate:</div>
                      <span className='w-2/3'>{diamond.certificate}</span>
                    </div>
                  )}

                  {diamond.fluorescence && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Fluorescence:</div>
                      <span className='w-2/3'>{diamond.fluorescence}</span>
                    </div>
                  )}

                  {diamond.lengthWidthRatio && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Length/Width Ratio:</div>
                      <span className='w-2/3'>{diamond.lengthWidthRatio}</span>
                    </div>
                  )}

                  {diamond.imageDiamonds?.length > 0 && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Images:</div>
                      <div className='w-2/3'>
                        {diamond.imageDiamonds.map((image: any, index: number) =>
                          image.imageLink ? (
                            <AntImage
                              key={index}
                              src={image.imageLink}
                              alt={`diamond-image-${index}`}
                              className='mb-2'
                              style={{ maxWidth: '80px', borderRadius: '15px', border: '6px solid gray' }}
                              preview={{ src: image.imageLink }}
                            />
                          ) : null
                        )}
                      </div>
                    </div>
                  )}

                  {diamond.documentDiamonds?.length > 0 && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Documents:</div>
                      <div className='w-2/3'>
                        {diamond.documentDiamonds.map((document: any, index: number) =>
                          document.documentLink ? (
                            <a
                              key={index}
                              href={document.documentLink}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-500'
                            >
                              Document {index + 1}
                            </a>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {record?.jewelry?.secondaryDiamonds?.length > 0 && (
            <div>
              <span className='w-full block mb-4 font-bold'>Secondary Diamonds</span>
              {record?.jewelry?.secondaryDiamonds.map((diamond: any) => (
                <div key={diamond.id} className='mb-4 ml-10'>
                  {diamond.name && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Name:</div>
                      <span className='w-2/3'>{diamond.name}</span>
                    </div>
                  )}

                  {diamond.color && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Color:</div>
                      <span className='w-2/3'>{diamond.color}</span>
                    </div>
                  )}

                  {diamond.cut && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Cut:</div>
                      <span className='w-2/3'>{diamond.cut}</span>
                    </div>
                  )}

                  {diamond.clarity && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Clarity:</div>
                      <span className='w-2/3'>{diamond.clarity}</span>
                    </div>
                  )}

                  {diamond.quantity && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Quantity:</div>
                      <span className='w-2/3'>{diamond.quantity}</span>
                    </div>
                  )}

                  {diamond.settingType && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Setting Type:</div>
                      <span className='w-2/3'>{diamond.settingType}</span>
                    </div>
                  )}

                  {diamond.dimension && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Dimension:</div>
                      <span className='w-2/3'>{diamond.dimension}</span>
                    </div>
                  )}

                  {diamond.shape && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Shape:</div>
                      <span className='w-2/3'>{diamond.shape}</span>
                    </div>
                  )}

                  {diamond.certificate && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Certificate:</div>
                      <span className='w-2/3'>{diamond.certificate}</span>
                    </div>
                  )}

                  {diamond.fluorescence && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Fluorescence:</div>
                      <span className='w-2/3'>{diamond.fluorescence}</span>
                    </div>
                  )}

                  {diamond.lengthWidthRatio && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Length/Width Ratio:</div>
                      <span className='w-2/3'>{diamond.lengthWidthRatio}</span>
                    </div>
                  )}

                  {diamond.imageDiamonds?.length > 0 && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Images:</div>
                      <div className='w-2/3'>
                        {diamond.imageDiamonds.map((image: any, index: number) =>
                          image.imageLink ? (
                            <AntImage
                              key={index}
                              src={image.imageLink}
                              alt={`diamond-image-${index}`}
                              className='mb-2'
                              style={{ maxWidth: '80px' }}
                              preview={{ src: image.imageLink }}
                            />
                          ) : null
                        )}
                      </div>
                    </div>
                  )}

                  {diamond.documentDiamonds?.length > 0 && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Documents:</div>
                      <div className='w-2/3'>
                        {diamond.documentDiamonds.map((document: any, index: number) =>
                          document.documentLink ? (
                            <a
                              key={index}
                              href={document.documentLink}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-500'
                            >
                              Document {index + 1}
                            </a>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {record?.jewelry?.mainShaphies?.length > 0 && (
            <div>
              <span className='w-full block mb-4 font-bold'>Main Sapphires</span>
              {record?.jewelry?.mainShaphies.map((sapphire: any) => (
                <div key={sapphire.id} className='mb-4 ml-10'>
                  {sapphire.name && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Name:</div>
                      <span className='w-2/3'>{sapphire.name}</span>
                    </div>
                  )}
                  {sapphire.color && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Color:</div>
                      <span className='w-2/3'>{sapphire.color}</span>
                    </div>
                  )}
                  {sapphire.carat && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Carat:</div>
                      <span className='w-2/3'>{sapphire.carat}</span>
                    </div>
                  )}
                  {sapphire.enhancementType && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Enhancement Type:</div>
                      <span className='w-2/3'>{sapphire.enhancementType}</span>
                    </div>
                  )}
                  {sapphire.quantity && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Quantity:</div>
                      <span className='w-2/3'>{sapphire.quantity}</span>
                    </div>
                  )}
                  {sapphire.settingType && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Setting Type:</div>
                      <span className='w-2/3'>{sapphire.settingType}</span>
                    </div>
                  )}
                  {sapphire.dimension && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Dimension:</div>
                      <span className='w-2/3'>{sapphire.dimension}</span>
                    </div>
                  )}
                  {sapphire.imageShaphies?.length > 0 && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Images:</div>
                      <div className='w-2/3'>
                        {sapphire.imageShaphies.map((image: any, index: number) =>
                          image.imageLink ? (
                            <AntImage
                              key={index}
                              src={image.imageLink}
                              alt={`diamond-image-${index}`}
                              className='mb-2'
                              style={{ maxWidth: '80px' }}
                              preview={{ src: image.imageLink }}
                            />
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                  {sapphire.documentShaphies?.length > 0 && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Documents:</div>
                      <div className='w-2/3'>
                        {sapphire.documentShaphies.map((document: any, index: number) =>
                          document.documentLink ? (
                            <a
                              key={index}
                              href={document.documentLink}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-500'
                            >
                              Document {index + 1}
                            </a>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {record?.jewelry?.secondaryShaphies?.length > 0 && (
            <div>
              <span className='w-full block mb-4 font-bold'>Secondary Sapphires</span>
              {record?.jewelry?.secondaryShaphies.map((sapphire: any) => (
                <div key={sapphire.id} className='mb-4 ml-10'>
                  {sapphire.name && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Name:</div>
                      <span className='w-2/3'>{sapphire.name}</span>
                    </div>
                  )}
                  {sapphire.color && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Color:</div>
                      <span className='w-2/3'>{sapphire.color}</span>
                    </div>
                  )}
                  {sapphire.carat && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Carat:</div>
                      <span className='w-2/3'>{sapphire.carat}</span>
                    </div>
                  )}
                  {sapphire.enhancementType && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Enhancement Type:</div>
                      <span className='w-2/3'>{sapphire.enhancementType}</span>
                    </div>
                  )}
                  {sapphire.quantity && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Quantity:</div>
                      <span className='w-2/3'>{sapphire.quantity}</span>
                    </div>
                  )}
                  {sapphire.settingType && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Setting Type:</div>
                      <span className='w-2/3'>{sapphire.settingType}</span>
                    </div>
                  )}
                  {sapphire.dimension && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Dimension:</div>
                      <span className='w-2/3'>{sapphire.dimension}</span>
                    </div>
                  )}
                  {sapphire.imageShaphies?.length > 0 && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Images:</div>
                      <div className='w-2/3'>
                        {sapphire.imageShaphies.map((image: any, index: number) =>
                          image.imageLink ? (
                            <AntImage
                              key={index}
                              src={image.imageLink}
                              alt={`diamond-image-${index}`}
                              className='mb-2'
                              style={{ maxWidth: '80px' }}
                              preview={{ src: image.imageLink }}
                            />
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                  {sapphire.documentShaphies?.length > 0 && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Documents:</div>
                      <div className='w-2/3'>
                        {sapphire.documentShaphies.map((document: any, index: number) =>
                          document.documentLink ? (
                            <a
                              key={index}
                              href={document.documentLink}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-500'
                            >
                              Document {index + 1}
                            </a>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {record?.status && (
            <div className='flex mb-4'>
              <strong className='w-1/3'>Status:</strong>
              <span className='font-bold text-red-800'>{record?.status}</span>
            </div>
          )}

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
