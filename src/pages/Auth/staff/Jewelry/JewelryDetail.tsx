import { ArrowLeftOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Descriptions, Form, Image, Spin, Tag, message } from 'antd'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetJewelryByIdQuery, useUpdateJewelryMutation } from '../../../../services/jewelry.services'
import { UpdateJewelryRequest } from '../../../../types/Jewelry.type'
import { parsePriceVND } from '../../../../utils/convertTypeDayjs'

export const JewelryDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)
  const [showValuation, setShowValuation] = useState(false)

  const { data: jewelry, isLoading } = useGetJewelryByIdQuery(Number(id))
  const [updateJewelry, { isLoading: isUpdating }] = useUpdateJewelryMutation()

  const handleEdit = () => {
    if (jewelry?.data) {
      form.setFieldsValue({
        name: jewelry.data.name,
        description: jewelry.data.description,
        estimatePriceMin: jewelry.data.estimatePriceMin,
        estimatePriceMax: jewelry.data.estimatePriceMax,
        startingPrice: jewelry.data.startingPrice,
        specificPrice: jewelry.data.specificPrice,
        videoLink: jewelry.data.videoLink,
        forGender: jewelry.data.forGender,
        title: jewelry.data.title,
        bidForm: jewelry.data.bidForm,
        time_Bidding: jewelry.data.time_Bidding,
        artistId: jewelry.data.artistId,
        categoryId: jewelry.data.categoryId,

        valuation: {
          name: jewelry.data.valuation.name,
          description: jewelry.data.valuation.description,
          height: jewelry.data.valuation.height,
          width: jewelry.data.valuation.width,
          depth: jewelry.data.valuation.depth,
          estimatePriceMin: jewelry.data.valuation.estimatePriceMin,
          estimatePriceMax: jewelry.data.valuation.estimatePriceMax,
          actualStatusOfJewelry: jewelry.data.valuation.actualStatusOfJewelry,

          seller: {
            firstName: jewelry.data.valuation.seller.firstName,
            lastName: jewelry.data.valuation.seller.lastName,
            email: jewelry.data.valuation.seller.accountDTO.email,
            phoneNumber: jewelry.data.valuation.seller.accountDTO.phoneNumber
          },
          staff: {
            firstName: jewelry.data.valuation.staff.firstName,
            lastName: jewelry.data.valuation.staff.lastName
          },
          appraiser: jewelry.data.valuation.appraiser
            ? {
                firstName: jewelry.data.valuation.appraiser.firstName,
                lastName: jewelry.data.valuation.appraiser.lastName
              }
            : undefined
        }
      })
    }
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      const updateData: UpdateJewelryRequest = {
        id: Number(id),
        name: values.name,
        description: values.description || '',
        estimatePriceMin: values.estimatePriceMin || 0,
        estimatePriceMax: values.estimatePriceMax || 0,
        startingPrice: values.startingPrice || 0,
        specificPrice: values.specificPrice || 0,
        videoLink: values.videoLink || '',
        forGender: values.forGender || '',
        title: values.title,
        bidForm: values.bidForm,
        time_Bidding: values.time_Bidding || '',
        artistId: values.artistId,
        categoryId: values.categoryId,

        // Chuyển đổi dữ liệu hiện tại sang format mới
        updateImageJewelryDTOs:
          jewelry?.data.imageJewelries?.map((img) => ({
            id: img.jewelryId,
            imageLink: img.imageLink,
            title: img.title,
            thumbnailImage: img.thumbnailImage
          })) || [],

        updateKeyCharacteristicDetailDTOs:
          jewelry?.data.keyCharacteristicDetails?.map((char) => ({
            id: char.id,
            description: char.description,
            keyCharacteristicId: char.keyCharacteristicId
          })) || [],

        updateMainDiamondDTOs:
          jewelry?.data.mainDiamonds?.map((diamond) => ({
            id: diamond.id,
            name: diamond.name || '',
            color: diamond.color || '',
            cut: diamond.cut || '',
            clarity: diamond.clarity || '',
            quantity: diamond.quantity,
            settingType: diamond.settingType,
            dimension: diamond.dimension || '',
            shape: diamond.shape || '',
            certificate: diamond.certificate || '',
            fluorescence: diamond.fluorescence || '',
            lengthWidthRatio: diamond.lengthWidthRatio || '',
            type: diamond.type || '',
            updateDocumentMainDiamondDTOs: (diamond.documentDiamonds ?? []).map((doc) => ({
              id: doc.diamondId || 0,
              documentLink: doc.documentLink,
              documentTitle: doc.documentTitle
            })),
            updateImageMainDiamondDTOs: (diamond.imageDiamonds ?? []).map((img) => ({
              id: img.diamondId || 0,
              imageLink: img.imageLink
            }))
          })) || [],

        // Similar mappings for secondary diamonds and shaphies...
        updateSecondaryDiamondDTOs: [],
        updateMainShaphieDTOs: [],
        updateSecondaryShaphieDTOs: []
      }

      await updateJewelry(updateData).unwrap()
      message.success('Updated successfully')
      setIsEditing(false)
    } catch (error) {
      console.error('Update failed:', error)
      message.error('Failed to update')
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setIsEditing(false)
  }

  if (isLoading) return <Spin size='large' className='flex justify-center mt-10' />
  if (!jewelry?.data) return <div>Jewelry not found</div>

  const renderMainInfo = () => (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      {/* Left Column - Images */}
      <div>
        <h3 className='mb-4 text-lg font-medium'>Images</h3>
        <div className='grid grid-cols-2 gap-4'>
          {jewelry.data.imageJewelries.map((img) => (
            <Image
              key={img.imageLink}
              src={img.imageLink}
              alt={img.title}
              className='object-cover rounded aspect-square'
            />
          ))}
        </div>
      </div>

      {/* Right Column - Information */}
      <div className='space-y-6'>
        {/* Basic Information */}
        <Card title='Basic Information' className='shadow-sm'>
          <Descriptions column={1}>
            <Descriptions.Item label='Name'>{jewelry.data.name}</Descriptions.Item>
            {jewelry.data.title && <Descriptions.Item label='Title'>{jewelry.data.title}</Descriptions.Item>}
            {jewelry.data.description && (
              <Descriptions.Item label='Description'>{jewelry.data.description}</Descriptions.Item>
            )}
            {jewelry.data.forGender && <Descriptions.Item label='Gender'>{jewelry.data.forGender}</Descriptions.Item>}
            <Descriptions.Item label='Status'>
              <Tag color={jewelry.data.status === 'Authorized' ? 'success' : 'default'}>{jewelry.data.status}</Tag>
            </Descriptions.Item>
            {jewelry.data.videoLink && (
              <Descriptions.Item label='Video'>
                <a href={jewelry.data.videoLink} target='_blank' rel='noopener noreferrer'>
                  View Video
                </a>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Price & Auction Information */}
        <Card title='Price & Auction Information' className='shadow-sm'>
          <Descriptions column={1}>
            <Descriptions.Item label='Estimate Price Range'>
              {parsePriceVND(jewelry.data.estimatePriceMin ?? 0)} - {parsePriceVND(jewelry.data.estimatePriceMax ?? 0)}
            </Descriptions.Item>
            <Descriptions.Item label='Starting Price'>
              {parsePriceVND(jewelry.data.startingPrice ?? 0)}
            </Descriptions.Item>
            <Descriptions.Item label='Specific Price'>
              {parsePriceVND(jewelry.data.specificPrice ?? 0)}
            </Descriptions.Item>
            <Descriptions.Item label='Bid Form'>
              <Tag color='blue'>{jewelry.data.bidForm}</Tag>
            </Descriptions.Item>
            {jewelry.data.time_Bidding && (
              <Descriptions.Item label='Bidding Time'>{jewelry.data.time_Bidding}</Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Classification */}
        <Card title='Classification' className='shadow-sm'>
          <Descriptions column={2}>
            <Descriptions.Item label='Category'>{jewelry.data.category.name}</Descriptions.Item>
            <Descriptions.Item label='Artist'>{jewelry.data.artist.name}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Characteristics */}
        {jewelry.data.keyCharacteristicDetails.length > 0 && (
          <Card title='Characteristics' className='shadow-sm'>
            <div className='space-y-4'>
              {jewelry.data.keyCharacteristicDetails.map((char) => (
                <div key={char.id} className='p-4 border rounded-lg'>
                  <p className='font-medium'>{char.keyCharacteristic.name}</p>
                  <p>{char.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Diamonds Information */}
        {(jewelry.data.mainDiamonds.length > 0 || jewelry.data.secondaryDiamonds.length > 0) && (
          <Card title='Diamonds Information' className='shadow-sm'>
            {/* Main Diamonds */}
            {jewelry.data.mainDiamonds.length > 0 && (
              <div className='mb-4'>
                <h4 className='mb-2 font-medium'>Main Diamonds</h4>
                <div className='space-y-4'>
                  {jewelry.data.mainDiamonds.map((diamond, index) => (
                    <div key={diamond.id} className='p-4 border rounded-lg'>
                      <Descriptions column={2} size='small'>
                        {diamond.name && <Descriptions.Item label='Name'>{diamond.name}</Descriptions.Item>}
                        {diamond.color && <Descriptions.Item label='Color'>{diamond.color}</Descriptions.Item>}
                        {diamond.cut && <Descriptions.Item label='Cut'>{diamond.cut}</Descriptions.Item>}
                        {diamond.clarity && <Descriptions.Item label='Clarity'>{diamond.clarity}</Descriptions.Item>}
                        <Descriptions.Item label='Quantity'>{diamond.quantity}</Descriptions.Item>
                        {diamond.shape && <Descriptions.Item label='Shape'>{diamond.shape}</Descriptions.Item>}
                        {diamond.lengthWidthRatio && (
                          <Descriptions.Item label='Length/Width Ratio'>{diamond.lengthWidthRatio}</Descriptions.Item>
                        )}
                      </Descriptions>
                      {/* Diamond Images */}
                      {(diamond.imageDiamonds ?? []).length > 0 && (
                        <div className='mt-2'>
                          <div className='grid grid-cols-2 gap-2'>
                            {diamond.imageDiamonds?.map((diamond) => (
                              <Image
                                key={diamond.diamondId}
                                src={diamond.imageLink}
                                alt={`Diamond ${index + 1}`}
                                className='object-cover rounded aspect-square'
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary Diamonds */}
            {jewelry.data.secondaryDiamonds.length > 0 && (
              <div>
                <h4 className='mb-2 font-medium'>Secondary Diamonds</h4>
                <div className='space-y-4'>
                  {jewelry.data.secondaryDiamonds.map((diamond, index) => (
                    <div key={diamond.id} className='p-4 border rounded-lg'>
                      <Descriptions column={2} size='small'>
                        {diamond.name && <Descriptions.Item label='Name'>{diamond.name}</Descriptions.Item>}
                        {diamond.color && <Descriptions.Item label='Color'>{diamond.color}</Descriptions.Item>}
                        {diamond.cut && <Descriptions.Item label='Cut'>{diamond.cut}</Descriptions.Item>}
                        {diamond.clarity && <Descriptions.Item label='Clarity'>{diamond.clarity}</Descriptions.Item>}
                        <Descriptions.Item label='Quantity'>{diamond.quantity}</Descriptions.Item>
                        {diamond.shape && <Descriptions.Item label='Shape'>{diamond.shape}</Descriptions.Item>}
                        {diamond.lengthWidthRatio && (
                          <Descriptions.Item label='Length/Width Ratio'>{diamond.lengthWidthRatio}</Descriptions.Item>
                        )}
                      </Descriptions>
                      {/* Diamond Images */}
                      {diamond.imageDiamonds.length > 0 && (
                        <div className='mt-2'>
                          <div className='grid grid-cols-2 gap-2'>
                            {diamond.imageDiamonds.map((img, imgIndex) => (
                              <Image
                                key={imgIndex}
                                src={img.imageLink}
                                alt={`Diamond ${index + 1}`}
                                className='object-cover rounded aspect-square'
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Shaphies Information */}
        {(jewelry.data.mainShaphies.length > 0 || jewelry.data.secondaryShaphies.length > 0) && (
          <Card title='Shaphies Information' className='shadow-sm'>
            {/* Main Shaphies */}
            {jewelry.data.mainShaphies.length > 0 && (
              <div className='mb-4'>
                <h4 className='mb-2 font-medium'>Main Shaphies</h4>
                <div className='space-y-4'>
                  {jewelry.data.mainShaphies.map((shaphie, index) => (
                    <div key={shaphie.id} className='p-4 border rounded-lg'>
                      <Descriptions column={2} size='small'>
                        {shaphie.name && <Descriptions.Item label='Name'>{shaphie.name}</Descriptions.Item>}
                        {shaphie.color && <Descriptions.Item label='Color'>{shaphie.color}</Descriptions.Item>}
                        {shaphie.carat && <Descriptions.Item label='Carat'>{shaphie.carat}</Descriptions.Item>}
                        <Descriptions.Item label='Quantity'>{shaphie.quantity}</Descriptions.Item>
                      </Descriptions>
                      {/* Shaphie Images */}
                      {shaphie.imageShaphies.length > 0 && (
                        <div className='mt-2'>
                          <div className='grid grid-cols-2 gap-2'>
                            {shaphie.imageShaphies.map((img, imgIndex) => (
                              <Image
                                key={imgIndex}
                                src={img.imageLink}
                                alt={`Shaphie ${index + 1}`}
                                className='object-cover rounded aspect-square'
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Show More Button */}
        <Button type='link' className='w-full' onClick={() => setShowValuation(!showValuation)}>
          {showValuation ? 'Show Less' : 'Show More Valuation Information'}
        </Button>

        {/* Valuation Information (Conditional Render) */}
        {showValuation && renderValuationInfo()}
      </div>
    </div>
  )

  const renderValuationInfo = () => (
    <Card title='Valuation Information' className='shadow-sm'>
      <>
        <Descriptions column={1}>
          <Descriptions.Item label='Name'>{jewelry.data.valuation.name}</Descriptions.Item>
          <Descriptions.Item label='Description'>{jewelry.data.valuation.description}</Descriptions.Item>
          <Descriptions.Item label='Dimensions'>
            {jewelry.data.valuation.height} × {jewelry.data.valuation.width} × {jewelry.data.valuation.depth} mm
          </Descriptions.Item>
          <Descriptions.Item label='Actual Status'>{jewelry.data.valuation.actualStatusOfJewelry}</Descriptions.Item>
          <Descriptions.Item label='Estimate Price Range'>
            {parsePriceVND(jewelry.data.valuation.estimatePriceMin ?? 0)} -
            {parsePriceVND(jewelry.data.valuation.estimatePriceMax ?? 0)}
          </Descriptions.Item>
          <Descriptions.Item label='Status'>
            <Tag color={jewelry.data.valuation.status === 'Authorized' ? 'success' : 'default'}>
              {jewelry.data.valuation.status}
            </Tag>
          </Descriptions.Item>
          {jewelry.data.valuation.cancelReason && (
            <Descriptions.Item label='Cancel Reason'>{jewelry.data.valuation.cancelReason}</Descriptions.Item>
          )}
        </Descriptions>

        {/* Common sections for both modes */}
        <div className='mt-4 space-y-4'>
          {/* Seller Information */}
          <div>
            <h4 className='mb-2 font-medium'>Seller Information</h4>
            <Descriptions column={2}>
              <Descriptions.Item label='Name'>
                {jewelry.data.valuation.seller.firstName} {jewelry.data.valuation.seller.lastName}
              </Descriptions.Item>
              <Descriptions.Item label='Gender'>{jewelry.data.valuation.seller.gender}</Descriptions.Item>
              <Descriptions.Item label='Email'>{jewelry.data.valuation.seller.accountDTO.email}</Descriptions.Item>
              <Descriptions.Item label='Phone'>
                {jewelry.data.valuation.seller.accountDTO.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label='ID Card'>
                {jewelry.data.valuation.seller.citizenIdentificationCard}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* Staff Information */}
          <div>
            <h4 className='mb-2 font-medium'>Staff Information</h4>
            <Descriptions column={2}>
              <Descriptions.Item label='Name'>
                {jewelry.data.valuation.staff.firstName} {jewelry.data.valuation.staff.lastName}
              </Descriptions.Item>
              <Descriptions.Item label='Email'>{jewelry.data.valuation.staff.accountDTO.email}</Descriptions.Item>
            </Descriptions>
          </div>

          {/* Appraiser Information if exists */}
          {jewelry.data.valuation.appraiser && (
            <div>
              <h4 className='mb-2 font-medium'>Appraiser Information</h4>
              <Descriptions column={2}>
                <Descriptions.Item label='Name'>
                  {jewelry.data.valuation.appraiser.firstName} {jewelry.data.valuation.appraiser.lastName}
                </Descriptions.Item>
                <Descriptions.Item label='Email'>{jewelry.data.valuation.appraiser.accountDTO.email}</Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </div>
      </>
      {/* Common sections for both modes */}
      {/* Valuation Images */}
      {jewelry.data.valuation.imageValuations.length > 0 && (
        <div className='mt-4'>
          <h4 className='mb-2 font-medium'>Valuation Images</h4>
          <div className='grid grid-cols-2 gap-4'>
            {jewelry.data.valuation.imageValuations.map((img) => (
              <Image
                key={img.id}
                src={img.imageLink}
                alt='Valuation Image'
                className='object-cover rounded aspect-square'
              />
            ))}
          </div>
        </div>
      )}
      {/* Valuation Documents */}
      {/* Valuation Documents */}
      {jewelry.data.valuation.valuationDocuments.length > 0 && (
        <div className='mt-4'>
          <h4 className='mb-2 font-medium'>Documents</h4>
          <div className='space-y-2'>
            {jewelry.data.valuation.valuationDocuments.map((doc) => (
              <div key={doc.id} className='flex items-center gap-2'>
                <a
                  href={doc.documentLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  {doc.valuationDocumentType}
                </a>
                <span className='text-sm text-gray-500'>{new Date(doc.creationDate).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )

  return (
    <div className='p-5'>
      <div className='flex items-center justify-between mb-4'>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back to List
        </Button>

        {isEditing ? (
          <div className='space-x-2'>
            <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={isUpdating}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        ) : (
          <Button type='primary' icon={<EditOutlined />} onClick={handleEdit}>
            Edit
          </Button>
        )}
      </div>

      <Card className='shadow-sm'>{renderMainInfo()}</Card>
    </div>
  )
}
