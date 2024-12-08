import { ArrowLeftOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Descriptions, Form, Image, Input, InputNumber, message, Select, Spin } from 'antd'
import { useEffect, useId, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useGetArtistQuery,
  useGetCategoriesQuery,
  useGetEnumClaritiesQuery,
  useGetEnumColorDiamondsQuery,
  useGetEnumColorShapphiesQuery,
  useGetEnumCutsQuery,
  useGetKeyCharacteristicsQuery
} from '../../../../services/createfinalvaluation.services'
import { useGetJewelryByIdQuery, useUpdateJewelryMutation } from '../../../../services/jewelry.services'
import { UpdateJewelryRequest } from '../../../../types/Jewelry.type'

export const JewelryDetail = () => {
  const idkey = useId()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)
  const [showValuation, setShowValuation] = useState(false)

  const { data: jewelry, isLoading } = useGetJewelryByIdQuery(Number(id))

  const { data: categories } = useGetCategoriesQuery()
  const { data: artists } = useGetArtistQuery()
  const { data: colorShapphies } = useGetEnumColorShapphiesQuery()
  const { data: colorDiamonds } = useGetEnumColorDiamondsQuery()
  const { data: cuts } = useGetEnumCutsQuery()
  const { data: clarities } = useGetEnumClaritiesQuery()
  const { data: keyCharacteristics } = useGetKeyCharacteristicsQuery()

  const [updateJewelry, { isLoading: isUpdating }] = useUpdateJewelryMutation()

  useEffect(() => {
    if (jewelry?.data) {
      form.setFieldsValue({
        name: jewelry?.data?.name,
        description: jewelry?.data?.description,
        title: jewelry?.data?.title,
        forGender: jewelry?.data?.forGender,
        videoLink: jewelry?.data?.videoLink,
        estimatePriceMin: jewelry?.data?.estimatePriceMin,
        estimatePriceMax: jewelry?.data?.estimatePriceMax,
        startingPrice: jewelry?.data?.startingPrice,
        specificPrice: jewelry?.data?.specificPrice,
        bidForm: jewelry?.data?.bidForm,
        time_Bidding: jewelry?.data?.time_Bidding,
        artistId: jewelry?.data?.artistId,
        categoryId: jewelry?.data?.categoryId,
        imageJewelries: jewelry?.data?.imageJewelries,
        keyCharacteristicDetails: jewelry?.data?.keyCharacteristicDetails,
        mainDiamonds:
          jewelry?.data?.mainDiamonds?.map((diamond) => ({
            ...diamond,
            documentDiamonds: diamond.documentDiamonds || [],
            imageDiamonds: diamond.imageDiamonds || []
          })) || [],
        secondaryDiamonds:
          jewelry?.data?.secondaryDiamonds?.map((diamond) => ({
            ...diamond,
            documentDiamonds: diamond.documentDiamonds || [],
            imageDiamonds: diamond.imageDiamonds || []
          })) || [],
        mainShaphies:
          jewelry?.data?.mainShaphies?.map((shaphy) => ({
            ...shaphy,
            documentShaphies: shaphy.documentShaphies || [],
            imageShaphies: shaphy.imageShaphies || []
          })) || [],
        secondaryShaphies:
          jewelry?.data?.secondaryShaphies?.map((shaphy) => ({
            ...shaphy,
            documentShaphies: shaphy.documentShaphies || [],
            imageShaphies: shaphy.imageShaphies || []
          })) || [],
        valuation: jewelry?.data?.valuation
      })
    }
  }, [jewelry, form])

  const handleEdit = () => {
    if (jewelry?.data) {
      form.setFieldsValue({
        // Basic Information
        name: jewelry.data.name,
        description: jewelry.data.description,
        title: jewelry.data.title,
        forGender: jewelry.data.forGender,
        videoLink: jewelry.data.videoLink,

        // Price Information
        estimatePriceMin: jewelry.data.estimatePriceMin,
        estimatePriceMax: jewelry.data.estimatePriceMax,
        startingPrice: jewelry.data.startingPrice,
        specificPrice: jewelry.data.specificPrice,
        bidForm: jewelry.data.bidForm,
        time_Bidding: jewelry.data.time_Bidding,

        // Classification
        artistId: jewelry.data.artistId,
        categoryId: jewelry.data.categoryId,

        // Images
        imageJewelries: jewelry.data.imageJewelries,

        // Characteristics
        keyCharacteristicDetails: jewelry.data.keyCharacteristicDetails,

        // Main Diamonds
        mainDiamonds: jewelry.data.mainDiamonds.map((diamond) => ({
          ...diamond,
          documentDiamonds: diamond.documentDiamonds || [],
          imageDiamonds: diamond.imageDiamonds || []
        })),

        // Secondary Diamonds
        secondaryDiamonds: jewelry.data.secondaryDiamonds.map((diamond) => ({
          ...diamond,
          documentDiamonds: diamond.documentDiamonds || [],
          imageDiamonds: diamond.imageDiamonds || []
        })),

        // Main Shaphies
        mainShaphies: jewelry.data.mainShaphies.map((shaphy) => ({
          ...shaphy,
          documentShaphies: shaphy.documentShaphies || [],
          imageShaphies: shaphy.imageShaphies || []
        })),

        // Secondary Shaphies
        secondaryShaphies: jewelry.data.secondaryShaphies.map((shaphy) => ({
          ...shaphy,
          documentShaphies: shaphy.documentShaphies || [],
          imageShaphies: shaphy.imageShaphies || []
        })),

        // Valuation
        valuation: jewelry.data.valuation
      })
    }
    setIsEditing(true)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsEditing(false)
  }

  const handleAddMainDiamond = () => {
    const newDiamond = {
      name: '',
      color: '',
      cut: '',
      clarity: '',
      quantity: 0,
      settingType: '',
      dimension: '',
      shape: '',
      certificate: '',
      fluorescence: '',
      lengthWidthRatio: '',
      type: '',
      documentDiamonds: [],
      imageDiamonds: []
    }
    const currentDiamonds = form.getFieldValue('mainDiamonds') || []
    form.setFieldsValue({
      mainDiamonds: [...currentDiamonds, newDiamond]
    })
  }

  const handleAddSecondaryDiamond = () => {
    const newDiamond = {
      name: '',
      color: '',
      cut: '',
      clarity: '',
      quantity: 0,
      settingType: '',
      dimension: '',
      shape: '',
      certificate: '',
      fluorescence: '',
      lengthWidthRatio: '',
      type: '',
      totalCarat: 0,
      documentDiamonds: [],
      imageDiamonds: []
    }
    const currentDiamonds = form.getFieldValue('secondaryDiamonds') || []
    form.setFieldsValue({
      secondaryDiamonds: [...currentDiamonds, newDiamond]
    })
  }

  const handleAddMainShaphy = () => {
    const newShaphy = {
      name: '',
      color: '',
      carat: 0,
      enhancementType: '',
      quantity: 0,
      settingType: '',
      dimension: '',
      documentShaphies: [],
      imageShaphies: []
    }
    const currentShaphies = form.getFieldValue('mainShaphies') || []
    form.setFieldsValue({
      mainShaphies: [...currentShaphies, newShaphy]
    })
  }

  const handleAddSecondaryShaphy = () => {
    const newShaphy = {
      name: '',
      color: '',
      carat: 0,
      enhancementType: '',
      quantity: 0,
      settingType: '',
      dimension: '',
      totalCarat: 0,
      documentShaphies: [],
      imageShaphies: []
    }
    const currentShaphies = form.getFieldValue('secondaryShaphies') || []
    form.setFieldsValue({
      secondaryShaphies: [...currentShaphies, newShaphy]
    })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      console.log('Form values:', values)

      // Xử lý và định dạng lại data trước khi gửi lên server
      const formattedData = {
        id: Number(id), // ID của trang sức
        name: values.name,
        description: values.description,
        title: values.title,
        forGender: values.forGender,
        videoLink: values.videoLink,
        estimatePriceMin: values.estimatePriceMin,
        estimatePriceMax: values.estimatePriceMax,
        startingPrice: values.startingPrice,
        specificPrice: values.specificPrice,
        bidForm: values.bidForm,
        time_Bidding: values.time_Bidding,
        artistId: values.artistId,
        categoryId: values.categoryId,
        UpdateImageJewelryDTOs: values.imageJewelries.map(
          (jewelry: { jewelryId: any; imageLink: any; title: any; thumbnailImage: any }) => ({
            id: jewelry.jewelryId,
            imageLink: jewelry.imageLink,
            title: jewelry.title,
            thumbnailImage: jewelry.thumbnailImage
          })
        ),

        // Xử lý đá quý
        UpdateMainDiamondDTOs:
          values.mainDiamonds?.map(
            (
              diamond: { quantity: any; documentDiamonds: any; imageDiamonds: { imageLink: any; id: any } },
              _index: any
            ) => ({
              ...diamond,
              quantity: Number(diamond.quantity),
              documentDiamonds: diamond.documentDiamonds || [],
              imageDiamonds: {
                imageLink: diamond.imageDiamonds?.imageLink || '',
                id: diamond.imageDiamonds?.id || null
              }
            })
          ) || [],

        UpdateSecondaryDiamondDTOs:
          values.secondaryDiamonds?.map(
            (
              diamond: {
                quantity: any
                totalCarat: any
                documentDiamonds: any
                imageDiamonds: { imageLink: any; id: any }
              },
              _index: any
            ) => ({
              ...diamond,
              quantity: Number(diamond.quantity),
              totalCarat: Number(diamond.totalCarat),
              documentDiamonds: diamond.documentDiamonds || [],
              imageDiamonds: {
                imageLink: diamond.imageDiamonds?.imageLink || '',
                id: diamond.imageDiamonds?.id || null
              }
            })
          ) || [],

        UpdateMainShaphieDTOs:
          values.mainShaphies?.map(
            (
              shaphy: { carat: any; quantity: any; documentShaphies: any; imageShaphies: { imageLink: any; id: any } },
              _index: any
            ) => ({
              ...shaphy,
              carat: Number(shaphy.carat),
              quantity: Number(shaphy.quantity),
              documentShaphies: shaphy.documentShaphies || [],
              imageShaphies: {
                imageLink: shaphy.imageShaphies?.imageLink || '',
                id: shaphy.imageShaphies?.id || null
              }
            })
          ) || [],

        UpdateSecondaryShaphieDTOs:
          values.secondaryShaphies?.map(
            (
              shaphy: {
                carat: any
                quantity: any
                totalCarat: any
                documentShaphies: any
                imageShaphies: { imageLink: any; id: any }
              },
              _index: any
            ) => ({
              ...shaphy,
              carat: Number(shaphy.carat),
              quantity: Number(shaphy.quantity),
              totalCarat: Number(shaphy.totalCarat),
              documentShaphies: shaphy.documentShaphies || [],
              imageShaphies: {
                imageLink: shaphy.imageShaphies?.imageLink || '',
                id: shaphy.imageShaphies?.id || null
              }
            })
          ) || [],

        // Xử lý đặc điểm
        UpdateKeyCharacteristicDetailDTOs:
          values.keyCharacteristicDetails?.map((char: { id: any; description: any; keyCharacteristicId: any }) => ({
            id: char.id,
            description: char.description,
            keyCharacteristicId: Number(char.keyCharacteristicId)
          })) || []

        // Xử lý thông tin định giá
      } as unknown as UpdateJewelryRequest
      console.log('Formatted data:', formattedData)

      // Gọi mutation để cập nhật
      const result = await updateJewelry(formattedData).unwrap()

      if (result.isSuccess) {
        message.success('Jewelry updated successfully')
        setIsEditing(false)
      } else {
        message.error('Failed to update jewelry')
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(`Error: ${error.message}`)
      } else {
        message.error('An error occurred while updating')
      }
      console.error('Update error:', error)
    }
  }

  const renderGemstoneSections = () => {
    return (
      <>
        <Card
          title={
            <div className='flex items-center justify-between'>
              <span>Main Diamonds</span>
              {isEditing && (
                <Button icon={<PlusOutlined />} onClick={handleAddMainDiamond}>
                  Add Main Diamond
                </Button>
              )}
            </div>
          }
          className='shadow-sm'
        >
          <Form.List name='mainDiamonds'>
            {(fields) =>
              fields.map((field) => (
                <div key={field.key} className='p-4 mb-4 border rounded'>
                  <Form.Item {...field} name={[field.name, 'name']} label='Name'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'color']} label='Color'>
                    <Select disabled={!isEditing}>
                      {colorDiamonds?.data?.map((color) => (
                        <Select.Option key={idkey} value={color.name}>
                          {color.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item {...field} name={[field.name, 'cut']} label='Cut'>
                    <Select disabled={!isEditing}>
                      {cuts?.data?.map((cut) => (
                        <Select.Option key={idkey} value={cut.name}>
                          {cut.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item {...field} name={[field.name, 'clarity']} label='Clarity'>
                    <Select disabled={!isEditing}>
                      {clarities?.data?.map((clarity) => (
                        <Select.Option key={idkey} value={clarity.name}>
                          {clarity.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'quantity']} label='Quantity'>
                    <InputNumber disabled={!isEditing} min={0} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'settingType']} label='Setting Type'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'dimension']} label='Dimension'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'shape']} label='Shape'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'certificate']} label='Certificate'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'fluorescence']} label='Fluorescence'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'lengthWidthRatio']} label='Length/Width Ratio'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'type']} label='Type'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  {/* Diamond Documents */}
                  <div className='mb-4'>
                    <h4 className='mb-2 font-medium'>Documents</h4>
                    <Form.List name={[field.name, 'documentDiamonds']}>
                      {(docFields) =>
                        docFields.map((docField) => (
                          <div key={idkey} className='mb-2'>
                            <Form.Item {...docField} name={[docField.name, 'documentLink']} label='Document Link'>
                              <Input disabled={!isEditing} />
                            </Form.Item>
                            <Form.Item {...docField} name={[docField.name, 'documentTitle']} label='Document Title'>
                              <Input disabled={!isEditing} />
                            </Form.Item>
                          </div>
                        ))
                      }
                    </Form.List>
                  </div>
                  {/* Diamond Images */}
                  <div>
                    <h4 className='mb-2 font-medium'>Images</h4>
                    <Form.List name={[field.name, 'imageDiamonds']}>
                      {(imgFields) =>
                        imgFields.map((imgField) => (
                          <div key={idkey} className='mb-2'>
                            <Form.Item {...imgField} name={[imgField.name, 'imageLink']} label='Image Link'>
                              <Input disabled={!isEditing} />
                            </Form.Item>
                            {!isEditing &&
                              jewelry?.data?.mainDiamonds[field.name]?.imageDiamonds?.map((img, imgIndex) => (
                                <Image
                                  key={idkey}
                                  src={img.imageLink}
                                  alt={`Diamond ${field.name + 1} Image ${imgIndex + 1}`}
                                  className='mt-2'
                                />
                              ))}
                          </div>
                        ))
                      }
                    </Form.List>
                  </div>
                </div>
              ))
            }
          </Form.List>
        </Card>

        {/* Secondary Diamonds */}
        <Card
          title={
            <div className='flex items-center justify-between'>
              <span>Secondary Diamonds</span>
              {isEditing && (
                <Button icon={<PlusOutlined />} onClick={handleAddSecondaryDiamond}>
                  Add Secondary Diamond
                </Button>
              )}
            </div>
          }
          className='shadow-sm'
        >
          <Form.List name='secondaryDiamonds'>
            {(fields) =>
              fields.map((field) => (
                <div key={idkey} className='p-4 mb-4 border rounded'>
                  <Form.Item {...field} name={[field.name, 'name']} label='Name'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'color']} label='Color'>
                    <Select disabled={!isEditing}>
                      {colorDiamonds?.data?.map((color) => (
                        <Select.Option key={idkey} value={color.name}>
                          {color.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item {...field} name={[field.name, 'cut']} label='Cut'>
                    <Select disabled={!isEditing}>
                      {cuts?.data?.map((cut) => (
                        <Select.Option key={idkey} value={cut.name}>
                          {cut.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item {...field} name={[field.name, 'clarity']} label='Clarity'>
                    <Select disabled={!isEditing}>
                      {clarities?.data?.map((clarity) => (
                        <Select.Option key={idkey} value={clarity.name}>
                          {clarity.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'quantity']} label='Quantity'>
                    <InputNumber disabled={!isEditing} min={0} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'settingType']} label='Setting Type'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'dimension']} label='Dimension'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'shape']} label='Shape'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'certificate']} label='Certificate'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'fluorescence']} label='Fluorescence'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'lengthWidthRatio']} label='Length/Width Ratio'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'type']} label='Type'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'totalCarat']} label='Total Carat'>
                    <InputNumber disabled={!isEditing} min={0} step={0.01} />
                  </Form.Item>

                  {/* Diamond Documents */}
                  <div className='mb-4'>
                    <h4 className='mb-2 font-medium'>Documents</h4>
                    <Form.List name={[field.name, 'documentDiamonds']}>
                      {(docFields) =>
                        docFields.map((docField) => (
                          <div key={idkey} className='mb-2'>
                            <Form.Item {...docField} name={[docField.name, 'documentLink']} label='Document Link'>
                              <Input disabled={!isEditing} />
                            </Form.Item>
                            <Form.Item {...docField} name={[docField.name, 'documentTitle']} label='Document Title'>
                              <Input disabled={!isEditing} />
                            </Form.Item>
                          </div>
                        ))
                      }
                    </Form.List>
                  </div>

                  {/* Diamond Images */}
                  <div>
                    <h4 className='mb-2 font-medium'>Images</h4>
                    <Form.List name={[field.name, 'imageDiamonds']}>
                      {(imgFields) =>
                        imgFields.map((imgField) => (
                          <div key={idkey} className='mb-2'>
                            <Form.Item {...imgField} name={[imgField.name, 'imageLink']} label='Image Link'>
                              <Input disabled={!isEditing} />
                            </Form.Item>
                            {!isEditing &&
                              jewelry?.data.secondaryDiamonds[field.name]?.imageDiamonds?.map((img, imgIndex) => (
                                <Image
                                  key={idkey}
                                  src={img.imageLink}
                                  alt={`Diamond ${field.name + 1} Image ${imgIndex + 1}`}
                                  className='mt-2'
                                />
                              ))}
                          </div>
                        ))
                      }
                    </Form.List>
                  </div>
                </div>
              ))
            }
          </Form.List>
        </Card>

        {/* Main Shaphies */}
        <Card
          title={
            <div className='flex items-center justify-between'>
              <span>Main Shaphies</span>
              {isEditing && (
                <Button icon={<PlusOutlined />} onClick={handleAddMainShaphy}>
                  Add Main Shaphy
                </Button>
              )}
            </div>
          }
          className='shadow-sm'
        >
          <Form.List name='mainShaphies'>
            {(fields) =>
              fields.map((field) => {
                const { key, ...restField } = field

                return (
                  <div key={key} className='p-4 mb-4 border rounded'>
                    <Form.Item key={`name-${key}`} {...restField} name={[field.name, 'name']} label='Name'>
                      <Input disabled={!isEditing} />
                    </Form.Item>
                    <Form.Item key={`color-${key}`} {...restField} name={[field.name, 'color']} label='Color'>
                      <Select disabled={!isEditing}>
                        {colorShapphies?.data?.map((color) => (
                          <Select.Option key={color.value} value={color.name}>
                            {color.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item key={`carat-${key}`} {...restField} name={[field.name, 'carat']} label='Carat'>
                      <InputNumber disabled={!isEditing} min={0} step={0.01} />
                    </Form.Item>
                    <Form.Item
                      key={`enhancement-${key}`}
                      {...restField}
                      name={[field.name, 'enhancementType']}
                      label='Enhancement Type'
                    >
                      <Input disabled={!isEditing} />
                    </Form.Item>
                    <Form.Item key={`quantity-${key}`} {...restField} name={[field.name, 'quantity']} label='Quantity'>
                      <InputNumber disabled={!isEditing} min={0} />
                    </Form.Item>
                    <Form.Item
                      key={`setting-${key}`}
                      {...restField}
                      name={[field.name, 'settingType']}
                      label='Setting Type'
                    >
                      <Input disabled={!isEditing} />
                    </Form.Item>
                    <Form.Item
                      key={`dimension-${key}`}
                      {...restField}
                      name={[field.name, 'dimension']}
                      label='Dimension'
                    >
                      <Input disabled={!isEditing} />
                    </Form.Item>

                    {/* Shaphy Documents */}
                    <div className='mb-4'>
                      <h4 className='mb-2 font-medium'>Documents</h4>
                      <Form.List name={[field.name, 'documentShaphies']}>
                        {(docFields) =>
                          docFields.map((docField) => {
                            const { key: docKey, ...restDocField } = docField

                            return (
                              <div key={docKey} className='mb-2'>
                                <Form.Item
                                  key={`doc-link-${docKey}`}
                                  {...restDocField}
                                  name={[docField.name, 'documentLink']}
                                  label='Document Link'
                                >
                                  <Input disabled={!isEditing} />
                                </Form.Item>
                                <Form.Item
                                  key={`doc-title-${docKey}`}
                                  {...restDocField}
                                  name={[docField.name, 'documentTitle']}
                                  label='Document Title'
                                >
                                  <Input disabled={!isEditing} />
                                </Form.Item>
                              </div>
                            )
                          })
                        }
                      </Form.List>
                    </div>

                    {/* Shaphy Images */}
                    <div>
                      <h4 className='mb-2 font-medium'>Images</h4>
                      <Form.List name={[field.name, 'imageShaphies']}>
                        {(imgFields) =>
                          imgFields.map((imgField) => {
                            const { key: imgKey, ...restImgField } = imgField

                            return (
                              <div key={imgKey} className='mb-2'>
                                <Form.Item
                                  key={`img-link-${imgKey}`}
                                  {...restImgField}
                                  name={[imgField.name, 'imageLink']}
                                  label='Image Link'
                                >
                                  <Input disabled={!isEditing} />
                                </Form.Item>
                                {!isEditing && (
                                  <Image
                                    src={jewelry?.data.mainShaphies[field.name].imageShaphies[imgField.name].imageLink}
                                    alt={`Shaphy ${field.name + 1}`}
                                    className='mt-2'
                                  />
                                )}
                              </div>
                            )
                          })
                        }
                      </Form.List>
                    </div>
                  </div>
                )
              })
            }
          </Form.List>
        </Card>

        {/* Secondary Shaphies */}
        <Card
          title={
            <div className='flex items-center justify-between'>
              <span>Secondary Shaphies</span>
              {isEditing && (
                <Button icon={<PlusOutlined />} onClick={handleAddSecondaryShaphy}>
                  Add Secondary Shaphy
                </Button>
              )}
            </div>
          }
          className='shadow-sm'
        >
          <Form.List name='secondaryShaphies'>
            {(fields) =>
              fields.map((field) => (
                <div key={idkey} className='p-4 mb-4 border rounded'>
                  <Form.Item {...field} name={[field.name, 'name']} label='Name'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'color']} label='Color'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'carat']} label='Carat'>
                    <InputNumber disabled={!isEditing} min={0} step={0.01} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'enhancementType']} label='Enhancement Type'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'quantity']} label='Quantity'>
                    <InputNumber disabled={!isEditing} min={0} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'settingType']} label='Setting Type'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'dimension']} label='Dimension'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'totalCarat']} label='Total Carat'>
                    <InputNumber disabled={!isEditing} min={0} step={0.01} />
                  </Form.Item>

                  {/* Shaphy Documents */}
                  <div className='mb-4'>
                    <h4 className='mb-2 font-medium'>Documents</h4>
                    <Form.List name={[field.name, 'documentShaphies']}>
                      {(docFields) =>
                        docFields.map((docField) => (
                          <div key={idkey} className='mb-2'>
                            <Form.Item {...docField} name={[docField.name, 'documentLink']} label='Document Link'>
                              <Input disabled={!isEditing} />
                            </Form.Item>
                            <Form.Item {...docField} name={[docField.name, 'documentTitle']} label='Document Title'>
                              <Input disabled={!isEditing} />
                            </Form.Item>
                          </div>
                        ))
                      }
                    </Form.List>
                  </div>

                  {/* Shaphy Images */}
                  <div>
                    <h4 className='mb-2 font-medium'>Images</h4>
                    <Form.List name={[field.name, 'imageShaphies']}>
                      {(imgFields) =>
                        imgFields.map((imgField) => (
                          <div key={idkey} className='mb-2'>
                            <Form.Item {...imgField} name={[imgField.name, 'imageLink']} label='Image Link'>
                              <Input disabled={!isEditing} />
                            </Form.Item>
                            {!isEditing && (
                              <Image
                                src={jewelry?.data.secondaryShaphies[field.name].imageShaphies[imgField.name].imageLink}
                                alt={`Shaphy ${field.name + 1}`}
                                className='mt-2'
                              />
                            )}
                          </div>
                        ))
                      }
                    </Form.List>
                  </div>
                </div>
              ))
            }
          </Form.List>
        </Card>
      </>
    )
  }

  const renderMainInfo = () => (
    <Form form={form} layout='vertical'>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Left Column - Images */}
        <div>
          <h3 className='mb-4 text-lg font-medium'>Images</h3>
          <div className='grid grid-cols-2 gap-4'>
            {jewelry?.data.imageJewelries.map((img) => (
              <div key={idkey} className='space-y-2'>
                <Form.Item name='imageJewelries'>
                  <Image src={img.imageLink} alt={img.title} className='object-cover rounded aspect-square' />
                </Form.Item>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Information */}
        <div className='space-y-6'>
          {/* Basic Information */}
          <Card title='Basic Information' className='shadow-sm'>
            <Form.Item name='name' label='Name' rules={[{ required: true }]}>
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item name='title' label='Title'>
              <Input disabled={!isEditing} />
            </Form.Item>
            <Form.Item name='description' label='Description'>
              <Input.TextArea disabled={!isEditing} />
            </Form.Item>
            <Form.Item name='forGender' label='Gender'>
              <Select disabled={!isEditing}>
                <Select.Option value='Male'>Male</Select.Option>
                <Select.Option value='Female'>Female</Select.Option>
                <Select.Option value='Unisex'>Unisex</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name='videoLink' label='Video Link'>
              <Input disabled={!isEditing} />
            </Form.Item>
          </Card>

          {/* Price & Auction Information */}
          <Card title='Price & Auction Information' className='shadow-sm'>
            <Form.Item name='estimatePriceMin' label='Minimum Estimate Price'>
              <InputNumber disabled={!isEditing} className='w-full' />
            </Form.Item>
            <Form.Item name='estimatePriceMax' label='Maximum Estimate Price'>
              <InputNumber disabled={!isEditing} className='w-full' />
            </Form.Item>
            <Form.Item name='startingPrice' label='Starting Price'>
              <InputNumber disabled={!isEditing} className='w-full' />
            </Form.Item>
            <Form.Item name='specificPrice' label='Specific Price'>
              <InputNumber disabled={!isEditing} className='w-full' />
            </Form.Item>
            <Form.Item name='bidForm' label='Bid Form'>
              <Select disabled={!isEditing}>
                <Select.Option value='Fixed_Price'>Fixed Price</Select.Option>
                <Select.Option value='Secret_Auction'>Secret Auction</Select.Option>
                <Select.Option value='Public_Auction'>Public Auction</Select.Option>
                <Select.Option value='Auction_Price_GraduallyReduced'>Gradually Reduced Price</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name='time_Bidding' label='Bidding Time'>
              <Input disabled={!isEditing} />
            </Form.Item>
          </Card>

          {/* Classification */}
          <Card title='Classification' className='shadow-sm'>
            <Form.Item name='categoryId' label='Category'>
              <Select disabled={!isEditing}>
                {categories?.data?.map((category) => (
                  <Select.Option key={idkey} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name='artistId' label='Artist'>
              <Select disabled={!isEditing}>
                {artists?.data?.map((artist) => (
                  <Select.Option key={idkey} value={artist.id}>
                    {artist.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Card>

          {/* Key Characteristics */}
          {jewelry?.data.keyCharacteristicDetails && jewelry.data.keyCharacteristicDetails.length > 0 && (
            <Card title='Characteristics' className='shadow-sm'>
              <Form.List name='keyCharacteristicDetails'>
                {(fields) =>
                  fields.map((field) => {
                    // Tách các props của field
                    const { key, ...restField } = field

                    return (
                      <div key={idkey} className='mb-4'>
                        <Form.Item
                          key={`char-${key}`}
                          {...restField}
                          name={[field.name, 'keyCharacteristicId']}
                          label='Characteristic'
                        >
                          <Select disabled={!isEditing}>
                            {keyCharacteristics?.data?.map((char) => (
                              <Select.Option key={char.id} value={char.id}>
                                {char.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          key={`desc-${key}`}
                          {...restField}
                          name={[field.name, 'description']}
                          label='Description'
                        >
                          <Input.TextArea disabled={!isEditing} />
                        </Form.Item>
                      </div>
                    )
                  })
                }
              </Form.List>
            </Card>
          )}

          {/* Gemstone Sections */}
          {renderGemstoneSections()}

          {/* Show More Button */}
          <Button type='link' className='w-full' onClick={() => setShowValuation(!showValuation)}>
            {showValuation ? 'Show Less' : 'Show More Valuation Information'}
          </Button>

          {/* Valuation Information */}
          {showValuation && (
            <Card title='Valuation Information' className='shadow-sm'>
              {/* Basic Valuation Info */}
              <Form.Item name={['valuation', 'name']} label='Name'>
                <Input disabled={!isEditing} />
              </Form.Item>
              <Form.Item name={['valuation', 'description']} label='Description'>
                <Input.TextArea disabled={!isEditing} />
              </Form.Item>
              <Form.Item name={['valuation', 'height']} label='Height (mm)'>
                <InputNumber disabled={!isEditing} min={0} step={0.1} />
              </Form.Item>
              <Form.Item name={['valuation', 'width']} label='Width (mm)'>
                <InputNumber disabled={!isEditing} min={0} step={0.1} />
              </Form.Item>
              <Form.Item name={['valuation', 'depth']} label='Depth (mm)'>
                <InputNumber disabled={!isEditing} min={0} step={0.1} />
              </Form.Item>
              <Form.Item name={['valuation', 'estimatePriceMin']} label='Minimum Estimate Price'>
                <InputNumber disabled={!isEditing} className='w-full' />
              </Form.Item>
              <Form.Item name={['valuation', 'estimatePriceMax']} label='Maximum Estimate Price'>
                <InputNumber disabled={!isEditing} className='w-full' />
              </Form.Item>
              <Form.Item name={['valuation', 'actualStatusOfJewelry']} label='Actual Status'>
                <Input disabled={!isEditing} />
              </Form.Item>

              {/* Valuation Images */}
              {jewelry?.data.valuation.imageValuations && jewelry.data.valuation.imageValuations.length > 0 && (
                <div className='mt-4'>
                  <h4 className='mb-2 font-medium'>Valuation Images</h4>
                  <div className='grid grid-cols-2 gap-4'>
                    {jewelry?.data.valuation.imageValuations.map((img) => (
                      <Image
                        key={idkey}
                        src={img.imageLink}
                        alt='Valuation Image'
                        className='object-cover rounded aspect-square'
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Valuation Documents */}
              {jewelry?.data.valuation.valuationDocuments && jewelry?.data.valuation.valuationDocuments.length > 0 && (
                <div className='mt-4'>
                  <h4 className='mb-2 font-medium'>Documents</h4>
                  <div className='space-y-2'>
                    {jewelry.data.valuation.valuationDocuments.map((doc) => (
                      <div key={idkey} className='flex items-center gap-2'>
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

              {/* People Information */}
              <div className='mt-4 space-y-4'>
                {/* Seller Information */}
                <div>
                  <h4 className='mb-2 font-medium'>Seller Information</h4>
                  <Descriptions column={2}>
                    <Descriptions.Item label='Name'>
                      {jewelry?.data.valuation.seller.firstName} {jewelry?.data.valuation.seller.lastName}
                    </Descriptions.Item>
                    <Descriptions.Item label='Gender'>{jewelry?.data.valuation.seller.gender}</Descriptions.Item>
                    <Descriptions.Item label='Email'>
                      {jewelry?.data.valuation.seller.accountDTO.email}
                    </Descriptions.Item>
                    <Descriptions.Item label='Phone'>
                      {jewelry?.data.valuation.seller.accountDTO.phoneNumber}
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                {/* Staff Information */}
                <div>
                  <h4 className='mb-2 font-medium'>Staff Information</h4>
                  <Descriptions column={2}>
                    <Descriptions.Item label='Name'>
                      {jewelry?.data.valuation.staff.firstName} {jewelry?.data.valuation.staff.lastName}
                    </Descriptions.Item>
                    <Descriptions.Item label='Email'>
                      {jewelry?.data.valuation.staff.accountDTO.email}
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                {/* Appraiser Information if exists */}
                {jewelry?.data.valuation.appraiser && (
                  <div>
                    <h4 className='mb-2 font-medium'>Appraiser Information</h4>
                    <Descriptions column={2}>
                      <Descriptions.Item label='Name'>
                        {jewelry.data.valuation.appraiser.firstName} {jewelry?.data.valuation.appraiser.lastName}
                      </Descriptions.Item>
                      <Descriptions.Item label='Email'>
                        {jewelry.data.valuation.appraiser.accountDTO.email}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </Form>
  )

  if (isLoading) return <Spin size='large' className='flex justify-center mt-10' />
  if (!jewelry?.data) return <div>Jewelry not found</div>

  return (
    <div className='p-5'>
      <div className='flex items-center justify-between mb-4'>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back to List
        </Button>

        {isEditing ? (
          <div className='space-x-2'>
            <Button
              type='primary'
              icon={<SaveOutlined />}
              onClick={() => {
                handleSave()
              }}
              loading={isUpdating}
            >
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

export default JewelryDetail
