import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Image as AntImage, Button, Modal, Spin } from 'antd'
import React, { useState } from 'react'
import { useViewListLotTypeQuery } from '../../../../../../services/bidtype.services'

interface FinalDetailModalProps {
  isVisible: boolean
  onCancel: () => void
  onUpdate: () => void
  record: any
  setStatus: (status: any) => void
}

const FinalDetailModal: React.FC<FinalDetailModalProps> = ({ isVisible, onCancel, record }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = record?.jewelry?.imageJewelries?.map((img: any) => img.imageLink) || [
    'https://via.placeholder.com/150?text=No+Image'
  ]

  const { isLoading, isError } = useViewListLotTypeQuery(undefined)

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

  return (
    <Modal
      title='Final Valuation Details'
      open={isVisible}
      onCancel={onCancel}
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
            <img
              src={images[currentImageIndex]}
              alt='product'
              onClick={openModal}
              className='w-[450px] h-[500px] object-cover rounded-lg'
            />
          </div>

          <div className='absolute left-0 flex items-center justify-center pl-3 top-56'>
            <Button icon={<LeftOutlined />} onClick={prevImage} className='bg-gray-300 hover:bg-gray-400' />
          </div>
          <div className='absolute right-0 flex items-center justify-center pr-3 top-56'>
            <Button icon={<RightOutlined />} onClick={nextImage} className='bg-gray-300 hover:bg-gray-400' />
          </div>

          <div className='flex mt-10 ml-10'>
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
          <img src={images[currentImageIndex]} alt='product zoomed' className='object-contain w-full h-auto' />
        </Modal>
        <div>
          <p className='mb-2 text-xl font-bold'>{record?.id}</p>
          <p className='mb-6 text-xl font-bold'>{record?.jewelry?.name}</p>

          <div className='flex mb-4'>
            <strong className='w-1/3'>Customer Name:</strong>
            <span>
              {record?.seller?.firstName} {record?.seller?.lastName}
            </span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Email:</strong>
            <span>{record?.seller?.accountDTO?.email}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Phone:</strong>
            <span>{record?.seller?.accountDTO?.phoneNumber}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Artist:</strong>
            <span className='text-blue-800 '>{record?.jewelry?.artist?.name}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Category:</strong>
            <span className='text-blue-800 '>{record?.jewelry?.category?.name}</span>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Video Link:</strong>
            <a
              href={record?.jewelry?.videoLink || '#'}
              className='text-blue-800'
              target='_blank'
              rel='noopener noreferrer'
            >
              {record?.jewelry?.videoLink || 'No link available'}
            </a>
          </div>
          <div className='flex mb-4'>
            <strong className='w-1/3'>Estimated Price:</strong>
            <span>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                record?.jewelry?.estimatePriceMin || 0
              )}{' '}
              -
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                record?.jewelry?.estimatePriceMax || 0
              )}
            </span>
          </div>

          <div className='flex mb-4'>
            <strong className='w-1/3'>Starting Price:</strong>
            <span>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                record?.jewelry?.startingPrice || 0
              )}
            </span>
          </div>

          <div className='flex mb-4'>
            <strong className='w-1/3'>Final Price:</strong>
            <span className='font-bold text-red-800'>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                record?.jewelry?.specificPrice || 0
              )}
            </span>
          </div>

          <div>
            <strong className='block w-full mb-4'>Key Characteristics</strong>
            {record?.jewelry?.keyCharacteristicDetails?.map((detail: any) => (
              <div key={detail.id} className='flex mb-2 ml-10'>
                <div className='w-1/4 font-medium'>{detail.keyCharacteristic.name}:</div>
                <span className='w-2/3'>{detail.description}</span>
              </div>
            ))}
          </div>
          {record?.jewelry?.mainDiamonds?.length > 0 && (
            <div>
              <span className='block w-full mb-4 font-bold'>Main Diamonds</span>

              {record?.jewelry?.mainDiamonds.map((diamond: any) => (
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

          {record?.jewelry?.secondaryDiamonds?.length > 0 && (
            <div>
              <span className='block w-full mb-4 font-bold'>Secondary Diamonds</span>
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
              <span className='block w-full mb-4 font-bold'>Main Sapphires</span>
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
              <span className='block w-full mb-4 font-bold'>Secondary Sapphires</span>
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

          <div className='flex mb-4'>
            <strong className='w-1/3'>Status:</strong>
            <span className='font-bold text-red-800'>{record?.status}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default FinalDetailModal
