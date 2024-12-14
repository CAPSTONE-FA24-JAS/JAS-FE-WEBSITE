import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Image as AntImage, Button, Modal, notification, Spin } from 'antd'
import React, { useState } from 'react'
import {
  useGetValuationByIdQuery,
  useRejectJewelryByManagerMutation,
  useUpdateJewelryStatusByManagerMutation
} from '../../../../services/valuation.services'

interface RequestFinalDetailProps {
  recordId: number
  isVisible: boolean
  onClose: () => void
  setStatus: (status: string) => void
  refetch: () => void
}

const RequestFinalDetail: React.FC<RequestFinalDetailProps> = ({
  recordId,
  isVisible,
  onClose,
  setStatus,
  refetch
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const {
    data: valuationData,
    isLoading: valuationLoading,
    error: valuationError
  } = useGetValuationByIdQuery({ id: recordId })
  console.log('Valuation Data: ', valuationData)

  const images = valuationData?.data?.jewelry?.imageJewelries?.map((img: any) => img.imageLink) || [
    'https://via.placeholder.com/150?text=No+Image'
  ]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }
  const openModal = () => setIsModalVisible(true)
  const closeModal = () => setIsModalVisible(false)

  const [updateStatus, { isLoading }] = useUpdateJewelryStatusByManagerMutation()
  const [rejectStatus, { isLoading: isRejectLoading }] = useRejectJewelryByManagerMutation()

  const handleUpdateClick = async () => {
    const jewelryId = valuationData?.data?.jewelry?.id
    const status = 7

    console.log('Updating status with:', { jewelryId, status })

    if (!jewelryId) {
      notification.error({
        message: 'Update Failed',
        description: 'Invalid jewelry ID.'
      })
      return
    }

    try {
      await updateStatus({ jewelryId, status }).unwrap()
      notification.success({
        message: 'Status Updated',
        description: 'The status has been updated to Final Valuated'
      })
      setStatus('Evaluated')

      refetch()
      onClose()
    } catch (error) {
      console.error('Error updating status:', error)
      notification.error({
        message: 'Update Failed',
        description: 'There was an error updating the status.'
      })
    }
  }

  const handleRejectClick = async () => {
    const jewelryId = valuationData?.data?.jewelry?.id
    const status = 9

    console.log('Rejecting status with:', { jewelryId, status })

    if (!jewelryId) {
      notification.error({
        message: 'Reject Failed',
        description: 'Invalid jewelry ID.'
      })
      return
    }

    try {
      await rejectStatus({ jewelryId, status }).unwrap()
      notification.success({
        message: 'Status Rejected',
        description: 'The status has been rejected.'
      })
      setStatus('Rejected')

      refetch()
      onClose()
    } catch (error) {
      console.error('Error rejecting status:', error)
      notification.error({
        message: 'Reject Failed',
        description: 'There was an error rejecting the status.'
      })
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
      title='Request Final Valuation Details'
      open={isVisible}
      onCancel={onClose}
      footer={
        valuationData?.data?.status === 'Evaluated'
          ? [
              <Button key='reject' onClick={handleRejectClick} loading={isRejectLoading} danger>
                Reject
              </Button>,
              <Button key='update' type='primary' onClick={handleUpdateClick} loading={isLoading}>
                Approve
              </Button>
            ]
          : [
              <Button key='close' onClick={onClose}>
                Close
              </Button>
            ]
      }
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
            />{' '}
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
          <p className='mb-2 text-xl font-bold'>{valuationData?.data?.id || 'N/A'}</p>
          <p className='mb-6 text-xl font-bold'>{valuationData?.data?.jewelry?.name || 'No Name Available'}</p>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Customer Name:</strong>
            <span>
              {valuationData?.data?.seller?.firstName || ''} {valuationData?.data?.seller?.lastName || ''}
            </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Email:</strong>
            <span>{valuationData?.data?.seller?.accountDTO?.email || 'No Email Available'}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Phone:</strong>
            <span>{valuationData?.data?.seller?.accountDTO?.phoneNumber || 'No Phone Available'}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Artist:</strong>
            <span className=' text-blue-800'>{valuationData?.data?.jewelry?.artist?.name || 0} </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Category:</strong>
            <span className=' text-blue-800'>{valuationData?.data?.jewelry?.category?.name || 0} </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Video Link:</strong>
            <a
              href={valuationData?.data?.jewelry?.videoLink || '#'}
              className='text-blue-800 truncate max-w-xs'
              target='_blank'
              rel='noopener noreferrer'
              style={{ display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {valuationData?.data?.jewelry?.videoLink || 'No link available'}
            </a>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Estimated Price:</strong>
            <span>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                valuationData?.data?.jewelry?.estimatePriceMin || 0
              )}{' '}
              -{' '}
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                valuationData?.data?.jewelry?.estimatePriceMax || 0
              )}
            </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Starting Price:</strong>
            <span>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                valuationData?.data?.jewelry?.startingPrice || 0
              )}
            </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Final Price:</strong>
            <span className='text-red-700 font-bold'>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                valuationData?.data?.jewelry?.specificPrice || 0
              )}
            </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Bid Form:</strong>
            <span className='text-red-700 font-bold'>{valuationData?.data?.jewelry?.bidForm || 0} </span>
          </div>
          <div>
            <strong className='w-full block mb-4'>Key Characteristics</strong>
            {valuationData?.data?.jewelry?.keyCharacteristicDetails?.map((detail: any) => (
              <div key={detail.id} className='flex mb-2 ml-10'>
                <div className='w-1/4 font-medium'>{detail.keyCharacteristic.name}:</div>
                <span className='w-2/3'>{detail.description}</span>
              </div>
            ))}
          </div>
          {valuationData?.data?.jewelry?.mainDiamonds?.length > 0 && (
            <div>
              <span className='w-full block mb-4 font-bold'>Main Diamonds</span>

              {valuationData?.data?.jewelry?.mainDiamonds.map((diamond: any) => (
                <div key={diamond.id} className='mb-4 ml-10'>
                  {/* Name */}
                  {diamond.name && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Name:</div>
                      <span className='w-2/3'>{diamond.name}</span>
                    </div>
                  )}

                  {/* Color */}
                  {diamond.color && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Color:</div>
                      <span className='w-2/3'>{diamond.color}</span>
                    </div>
                  )}

                  {/* Cut */}
                  {diamond.cut && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Cut:</div>
                      <span className='w-2/3'>{diamond.cut}</span>
                    </div>
                  )}

                  {/* Clarity */}
                  {diamond.clarity && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Clarity:</div>
                      <span className='w-2/3'>{diamond.clarity}</span>
                    </div>
                  )}
                  {diamond.carat && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Carat:</div>
                      <span className='w-2/3'>{diamond.carat}</span>
                    </div>
                  )}
                  {/* Quantity */}
                  {diamond.quantity && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Quantity:</div>
                      <span className='w-2/3'>{diamond.quantity}</span>
                    </div>
                  )}

                  {/* Setting Type */}
                  {diamond.settingType && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Setting Type:</div>
                      <span className='w-2/3'>{diamond.settingType}</span>
                    </div>
                  )}

                  {/* Dimension */}
                  {diamond.dimension && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Dimension:</div>
                      <span className='w-2/3'>{diamond.dimension}</span>
                    </div>
                  )}

                  {/* Shape */}
                  {diamond.shape && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Shape:</div>
                      <span className='w-2/3'>{diamond.shape}</span>
                    </div>
                  )}

                  {/* Certificate */}
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
                              style={{ maxWidth: '80px', borderRadius: '15px' }}
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
          {valuationData?.data?.jewelry?.secondaryDiamonds?.length > 0 && (
            <div>
              <span className='w-full block mb-4 font-bold'>Secondary Diamonds</span>
              {valuationData?.data?.jewelry?.secondaryDiamonds.map((diamond: any) => (
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
                  {diamond.totalCarat && (
                    <div className='flex mb-2'>
                      <div className='w-1/4 font-medium'>Carat:</div>
                      <span className='w-2/3'>{diamond.carat}</span>
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
          {/* Main Sapphires */}
          {valuationData?.data?.jewelry?.mainShaphies?.length > 0 && (
            <div>
              <span className='w-full block mb-4 font-bold'>Main Sapphires</span>
              {valuationData?.data?.jewelry?.mainShaphies.map((sapphire: any) => (
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
          {/* Secondary Sapphires */}
          {valuationData?.data?.jewelry?.secondaryShaphies?.length > 0 && (
            <div>
              <span className='w-full block mb-4 font-bold'>Secondary Sapphires</span>
              {valuationData?.data?.jewelry?.secondaryShaphies.map((sapphire: any) => (
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

          <div className='mt-4 flex'>
            <strong className='w-1/3'>Status:</strong>
            <span className='text-red-700 font-bold'>{valuationData?.data?.status || 'Unknown Status'}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default RequestFinalDetail
