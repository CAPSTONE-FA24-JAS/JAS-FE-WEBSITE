import { ArrowLeftOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Descriptions, Form, Image, Input, InputNumber, Select, Spin, Upload } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import { useEffect, useState } from 'react'
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
import { useGetJewelryByIdQuery } from '../../../../services/jewelry.services'

export const JewelryDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)
  const [showValuation, setShowValuation] = useState(false)

  // State for file management
  const [mainDiamondFiles, setMainDiamondFiles] = useState<{ [key: string]: UploadFile[] }>({})
  const [secondaryDiamondFiles, setSecondaryDiamondFiles] = useState<{ [key: string]: UploadFile[] }>({})
  const [mainShaphyFiles, setMainShaphyFiles] = useState<{ [key: string]: UploadFile[] }>({})
  const [secondaryShaphyFiles, setSecondaryShaphyFiles] = useState<{ [key: string]: UploadFile[] }>({})
  const [jewelryFiles, setJewelryFiles] = useState<UploadFile[]>([])

  const { data: jewelry, isLoading } = useGetJewelryByIdQuery(Number(id))
  const { data: categories } = useGetCategoriesQuery()
  const { data: artists } = useGetArtistQuery()
  const { data: colorShapphies } = useGetEnumColorShapphiesQuery()
  const { data: colorDiamonds } = useGetEnumColorDiamondsQuery()
  const { data: cuts } = useGetEnumCutsQuery()
  const { data: clarities } = useGetEnumClaritiesQuery()
  const { data: keyCharacteristics } = useGetKeyCharacteristicsQuery()

  // const [updateJewelry, { isLoading: isUpdating }] = useUpdateJewelryMutation()

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
        name: jewelry.data.name,
        description: jewelry.data.description,
        title: jewelry.data.title,
        forGender: jewelry.data.forGender,
        videoLink: jewelry.data.videoLink,
        estimatePriceMin: jewelry.data.estimatePriceMin,
        estimatePriceMax: jewelry.data.estimatePriceMax,
        startingPrice: jewelry.data.startingPrice,
        specificPrice: jewelry.data.specificPrice,
        bidForm: jewelry.data.bidForm,
        time_Bidding: jewelry.data.time_Bidding,
        artistId: jewelry.data.artistId,
        categoryId: jewelry.data.categoryId,
        imageJewelries: jewelry.data.imageJewelries,
        keyCharacteristicDetails: jewelry.data.keyCharacteristicDetails,
        mainDiamonds: jewelry.data.mainDiamonds.map((diamond) => ({
          ...diamond,
          documentDiamonds: diamond.documentDiamonds || [],
          imageDiamonds: diamond.imageDiamonds || []
        })),
        secondaryDiamonds: jewelry.data.secondaryDiamonds.map((diamond) => ({
          ...diamond,
          documentDiamonds: diamond.documentDiamonds || [],
          imageDiamonds: diamond.imageDiamonds || []
        })),
        mainShaphies: jewelry.data.mainShaphies.map((shaphy) => ({
          ...shaphy,
          documentShaphies: shaphy.documentShaphies || [],
          imageShaphies: shaphy.imageShaphies || []
        })),
        secondaryShaphies: jewelry.data.secondaryShaphies.map((shaphy) => ({
          ...shaphy,
          documentShaphies: shaphy.documentShaphies || [],
          imageShaphies: shaphy.imageShaphies || []
        })),
        valuation: jewelry.data.valuation
      })
    }
    setIsEditing(true)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsEditing(false)
    // Reset all file states
    setMainDiamondFiles({})
    setSecondaryDiamondFiles({})
    setMainShaphyFiles({})
    setSecondaryShaphyFiles({})
    setJewelryFiles([])
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
  // const handleSave = async () => {
  //   try {
  //     const values = await form.validateFields()
  //     const formData = new FormData()

  //     // Append basic jewelry data
  //     const jewelryData = {
  //       id: Number(id),
  //       name: values.name,
  //       description: values.description,
  //       title: values.title,
  //       forGender: values.forGender,
  //       videoLink: values.videoLink,
  //       estimatePriceMin: values.estimatePriceMin,
  //       estimatePriceMax: values.estimatePriceMax,
  //       startingPrice: values.startingPrice,
  //       specificPrice: values.specificPrice,
  //       bidForm: values.bidForm,
  //       time_Bidding: values.time_Bidding,
  //       artistId: values.artistId,
  //       categoryId: values.categoryId,
  //       keyCharacteristicDetails: values.keyCharacteristicDetails
  //     }
  //     formData.append('jewelryData', JSON.stringify(jewelryData))

  //     // Append jewelry images
  //     jewelryFiles.forEach((file, index) => {
  //       if (file.originFileObj) {
  //         formData.append(`jewelry_images_${index}`, file.originFileObj)
  //       }
  //     })

  //     // Handle main diamond files
  //     Object.entries(mainDiamondFiles).forEach(([key, files]) => {
  //       files.forEach((file, fileIndex) => {
  //         if (file.originFileObj) {
  //           const [, index, fileType] = key.split('-')
  //           formData.append(`mainDiamond_${index}_${fileType}_${fileIndex}`, file.originFileObj)
  //         }
  //       })
  //     })

  //     // Handle secondary diamond files
  //     Object.entries(secondaryDiamondFiles).forEach(([key, files]) => {
  //       files.forEach((file, fileIndex) => {
  //         if (file.originFileObj) {
  //           const [, index, fileType] = key.split('-')
  //           formData.append(`secondaryDiamond_${index}_${fileType}_${fileIndex}`, file.originFileObj)
  //         }
  //       })
  //     })

  //     // Handle main shaphy files
  //     Object.entries(mainShaphyFiles).forEach(([key, files]) => {
  //       files.forEach((file, fileIndex) => {
  //         if (file.originFileObj) {
  //           const [, index, fileType] = key.split('-')
  //           formData.append(`mainShaphy_${index}_${fileType}_${fileIndex}`, file.originFileObj)
  //         }
  //       })
  //     })

  //     // Handle secondary shaphy files
  //     Object.entries(secondaryShaphyFiles).forEach(([key, files]) => {
  //       files.forEach((file, fileIndex) => {
  //         if (file.originFileObj) {
  //           const [, index, fileType] = key.split('-')
  //           formData.append(`secondaryShaphy_${index}_${fileType}_${fileIndex}`, file.originFileObj)
  //         }
  //       })
  //     })

  //     // Send the formData to your API
  //     const updateRequest = {
  //       id: Number(id),
  //       name: values.name,
  //       description: values.description,
  //       title: values.title,
  //       forGender: values.forGender,
  //       videoLink: values.videoLink,
  //       estimatePriceMin: values.estimatePriceMin,
  //       estimatePriceMax: values.estimatePriceMax,
  //       startingPrice: values.startingPrice,
  //       specificPrice: values.specificPrice,
  //       bidForm: values.bidForm,
  //       time_Bidding: values.time_Bidding,
  //       artistId: values.artistId,
  //       categoryId: values.categoryId,
  //       updateKeyCharacteristicDetailDTOs: values.keyCharacteristicDetails,
  //       updateImageJewelryDTOs: jewelryFiles.map((file, index) => ({
  //         id: index, // Assuming you have an id for each image, replace with actual id if available
  //         imageLink: file.originFileObj,
  //         title: file.name,
  //         thumbnailImage: '' // Add the actual thumbnail image if available
  //       })),
  //       updateMainDiamondDTOs: values.mainDiamonds.map((diamond: any, index: any) => ({
  //         ...diamond,
  //         documentDiamonds:
  //           mainDiamondFiles[`mainDiamonds-${index}-docs`]?.map((file) => ({
  //             documentLink: file.originFileObj,
  //             documentTitle: file.name
  //           })) || [],
  //         imageDiamonds:
  //           mainDiamondFiles[`mainDiamonds-${index}-imgs`]?.map((file) => ({
  //             imageLink: file.originFileObj,
  //             imageTitle: file.name
  //           })) || []
  //       })),
  //       updateSecondaryDiamondDTOs: values.secondaryDiamonds.map((diamond: any, index: any) => ({
  //         ...diamond,
  //         documentDiamonds:
  //           secondaryDiamondFiles[`secondaryDiamonds-${index}-docs`]?.map((file) => ({
  //             documentLink: file.originFileObj,
  //             documentTitle: file.name
  //           })) || [],
  //         imageDiamonds:
  //           secondaryDiamondFiles[`secondaryDiamonds-${index}-imgs`]?.map((file) => ({
  //             imageLink: file.originFileObj,
  //             imageTitle: file.name
  //           })) || []
  //       })),
  //       updateMainShaphieDTOs: values.mainShaphies.map((shaphy: any, index: any) => ({
  //         ...shaphy,
  //         documentShaphies:
  //           mainShaphyFiles[`mainShaphies-${index}-docs`]?.map((file) => ({
  //             documentLink: file.originFileObj,
  //             documentTitle: file.name
  //           })) || [],
  //         imageShaphies:
  //           mainShaphyFiles[`mainShaphies-${index}-imgs`]?.map((file) => ({
  //             imageLink: file.originFileObj,
  //             imageTitle: file.name
  //           })) || []
  //       })),
  //       updateSecondaryShaphieDTOs: values.secondaryShaphies.map((shaphy: any, index: any) => ({
  //         ...shaphy,
  //         documentShaphies:
  //           secondaryShaphyFiles[`secondaryShaphies-${index}-docs`]?.map((file) => ({
  //             documentLink: file.originFileObj,
  //             documentTitle: file.name
  //           })) || [],
  //         imageShaphies:
  //           secondaryShaphyFiles[`secondaryShaphies-${index}-imgs`]?.map((file) => ({
  //             imageLink: file.originFileObj,
  //             imageTitle: file.name
  //           })) || []
  //       })),
  //       valuation: values.valuation
  //     }

  //     const result = await updateJewelry(updateRequest).unwrap()

  //     if (result.isSuccess) {
  //       message.success('Jewelry updated successfully')
  //       setIsEditing(false)
  //       // Reset file states after successful update
  //       setMainDiamondFiles({})
  //       setSecondaryDiamondFiles({})
  //       setMainShaphyFiles({})
  //       setSecondaryShaphyFiles({})
  //       setJewelryFiles([])
  //     } else {
  //       message.error('Failed to update jewelry')
  //     }
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       message.error(`Error: ${error.message}`)
  //     } else {
  //       message.error('An error occurred while updating')
  //     }
  //     console.error('Update error:', error)
  //   }
  // }
  const handleSave = async () => {
    console.log('form', form)
  }

  const renderDiamondDocuments = (field: any, fieldName: string, files: any, setFiles: any) => (
    <div className='mb-4'>
      <h4 className='mb-2 font-medium'>Documents</h4>
      {!isEditing ? (
        <div>
          {(jewelry?.data[fieldName as keyof typeof jewelry.data] as any)[field.name]?.documentDiamonds?.map(
            (doc: any, index: number) => (
              <div key={`${fieldName}-doc-${field.name}-${index}`} className='mb-2'>
                <a href={doc.documentLink} target='_blank' rel='noopener noreferrer'>
                  {doc.documentTitle || `Document ${index + 1}`}
                </a>
              </div>
            )
          )}
        </div>
      ) : (
        <Upload
          listType='text'
          multiple
          beforeUpload={() => false}
          fileList={files[`${fieldName}-${field.name}-docs`] || []}
          onChange={({ fileList }) => {
            setFiles((prev: any) => ({
              ...prev,
              [`${fieldName}-${field.name}-docs`]: fileList
            }))
          }}
        >
          <Button icon={<PlusOutlined />}>Upload Document</Button>
        </Upload>
      )}
    </div>
  )

  const renderDiamondImages = (field: any, fieldName: string, files: any, setFiles: any) => (
    <div className='mb-4'>
      <h4 className='mb-2 font-medium'>Images</h4>
      {!isEditing ? (
        <div className='grid grid-cols-2 gap-4'>
          {(jewelry?.data[fieldName as keyof typeof jewelry.data] as any)[field.name]?.imageDiamonds?.map(
            (img: any, index: number) => (
              <Image
                key={`${fieldName}-img-${index}`}
                src={img.imageLink}
                alt={`Diamond ${field.name + 1} Image ${index + 1}`}
                className='mt-2'
              />
            )
          )}
        </div>
      ) : (
        <Upload
          listType='picture-card'
          multiple
          beforeUpload={() => false}
          fileList={files[`${fieldName}-${field.name}-imgs`] || []}
          onChange={({ fileList }) => {
            setFiles((prev: any) => ({
              ...prev,
              [`${fieldName}-${field.name}-imgs`]: fileList
            }))
          }}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      )}
    </div>
  )

  const renderShaphyDocuments = (field: any, fieldName: string, files: any, setFiles: any) => (
    <div className='mb-4'>
      <h4 className='mb-2 font-medium'>Documents</h4>
      {!isEditing ? (
        <div>
          {(jewelry?.data[fieldName as keyof typeof jewelry.data] as any)[field.name]?.documentShaphies?.map(
            (doc: any, index: number) => (
              <div key={`${fieldName}-doc-${index}`} className='mb-2'>
                <a href={doc.documentLink} target='_blank' rel='noopener noreferrer'>
                  {doc.documentTitle || `Document ${index + 1}`}
                </a>
              </div>
            )
          )}
        </div>
      ) : (
        <Upload
          listType='text'
          multiple
          beforeUpload={() => false}
          fileList={files[`${fieldName}-${field.name}-docs`] || []}
          onChange={({ fileList }) => {
            setFiles((prev: any) => ({
              ...prev,
              [`${fieldName}-${field.name}-docs`]: fileList
            }))
          }}
        >
          <Button icon={<PlusOutlined />}>Upload Document</Button>
        </Upload>
      )}
    </div>
  )

  const renderShaphyImages = (field: any, fieldName: string, files: any, setFiles: any) => (
    <div className='mb-4'>
      <h4 className='mb-2 font-medium'>Images</h4>
      {!isEditing ? (
        <div className='grid grid-cols-2 gap-4'>
          {(jewelry?.data[fieldName as keyof typeof jewelry.data] as any)[field.name]?.imageShaphies?.map(
            (img: any, index: number) => (
              <Image
                key={`${fieldName}-img-${index}`}
                src={img.imageLink}
                alt={`Shaphy ${field.name + 1} Image ${index + 1}`}
                className='mt-2'
              />
            )
          )}
        </div>
      ) : (
        <Upload
          listType='picture-card'
          multiple
          beforeUpload={() => false}
          fileList={files[`${fieldName}-${field.name}-imgs`] || []}
          onChange={({ fileList }) => {
            setFiles((prev: any) => ({
              ...prev,
              [`${fieldName}-${field.name}-imgs`]: fileList
            }))
          }}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      )}
    </div>
  )

  const renderGemstoneSections = () => {
    return (
      <>
        {/* Main Diamonds */}
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
                        <Select.Option key={`color-${color.name}-${field.key}`} value={color.name}>
                          {color.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'cut']} label='Cut'>
                    <Select disabled={!isEditing}>
                      {cuts?.data?.map((cut) => (
                        <Select.Option key={`cut-${cut.name}-${field.key}`} value={cut.name}>
                          {cut.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'clarity']} label='Clarity'>
                    <Select disabled={!isEditing}>
                      {clarities?.data?.map((clarity) => (
                        <Select.Option key={`clarity-${clarity.name}-${field.key}`} value={clarity.name}>
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

                  {renderDiamondDocuments(field, 'mainDiamonds', mainDiamondFiles, setMainDiamondFiles)}
                  {renderDiamondImages(field, 'mainDiamonds', mainDiamondFiles, setMainDiamondFiles)}
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
                <div key={field.key} className='p-4 mb-4 border rounded'>
                  {/* Same fields as Main Diamonds */}
                  <Form.Item {...field} name={[field.name, 'name']} label='Name'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'color']} label='Color'>
                    <Select disabled={!isEditing}>
                      {colorDiamonds?.data?.map((color) => (
                        <Select.Option key={color.name} value={color.name}>
                          {color.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/* ... Other fields same as mainDiamonds ... */}
                  <Form.Item {...field} name={[field.name, 'totalCarat']} label='Total Carat'>
                    <InputNumber disabled={!isEditing} min={0} step={0.01} />
                  </Form.Item>

                  {renderDiamondDocuments(field, 'secondaryDiamonds', secondaryDiamondFiles, setSecondaryDiamondFiles)}
                  {renderDiamondImages(field, 'secondaryDiamonds', secondaryDiamondFiles, setSecondaryDiamondFiles)}
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
              fields.map((field) => (
                <div key={field.key} className='p-4 mb-4 border rounded'>
                  <Form.Item {...field} name={[field.name, 'name']} label='Name'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'color']} label='Color'>
                    <Select disabled={!isEditing}>
                      {colorShapphies?.data?.map((color) => (
                        <Select.Option key={color.name} value={color.name}>
                          {color.name}
                        </Select.Option>
                      ))}
                    </Select>
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

                  {renderShaphyDocuments(field, 'mainShaphies', mainShaphyFiles, setMainShaphyFiles)}
                  {renderShaphyImages(field, 'mainShaphies', mainShaphyFiles, setMainShaphyFiles)}
                </div>
              ))
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
                <div key={field.key} className='p-4 mb-4 border rounded'>
                  {/* Same fields as Main Shaphies */}
                  <Form.Item {...field} name={[field.name, 'name']} label='Name'>
                    <Input disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item {...field} name={[field.name, 'color']} label='Color'>
                    <Select disabled={!isEditing}>
                      {colorShapphies?.data?.map((color) => (
                        <Select.Option key={color.name} value={color.name}>
                          {color.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/* ... Other fields same as mainShaphies ... */}
                  <Form.Item {...field} name={[field.name, 'totalCarat']} label='Total Carat'>
                    <InputNumber disabled={!isEditing} min={0} step={0.01} />
                  </Form.Item>

                  {renderShaphyDocuments(field, 'secondaryShaphies', secondaryShaphyFiles, setSecondaryShaphyFiles)}
                  {renderShaphyImages(field, 'secondaryShaphies', secondaryShaphyFiles, setSecondaryShaphyFiles)}
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
          {!isEditing ? (
            <div className='grid grid-cols-2 gap-4'>
              {jewelry?.data.imageJewelries.map((img, index) => (
                <div key={`jewelry-img-${index}`} className='space-y-2'>
                  <Image src={img.imageLink} alt={img.title} className='object-cover rounded aspect-square' />
                </div>
              ))}
            </div>
          ) : (
            <Upload
              listType='picture-card'
              multiple
              beforeUpload={() => false}
              fileList={jewelryFiles}
              onChange={({ fileList }) => setJewelryFiles(fileList)}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          )}
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
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name='artistId' label='Artist'>
              <Select disabled={!isEditing}>
                {artists?.data?.map((artist) => (
                  <Select.Option key={artist.id} value={artist.id}>
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
                  fields.map((field) => (
                    <div key={field.key} className='mb-4'>
                      <Form.Item {...field} name={[field.name, 'keyCharacteristicId']} label='Characteristic'>
                        <Select disabled={!isEditing}>
                          {keyCharacteristics?.data?.map((char) => (
                            <Select.Option key={char.id} value={char.id}>
                              {char.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item {...field} name={[field.name, 'description']} label='Description'>
                        <Input.TextArea disabled={!isEditing} />
                      </Form.Item>
                    </div>
                  ))
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
          {showValuation && jewelry?.data.valuation && (
            <Card title='Valuation Information' className='shadow-sm'>
              <Form.Item name={['valuation', 'name']} label='Name'>
                <Input disabled={!isEditing} />
              </Form.Item>
              <Form.Item name={['valuation', 'description']} label='Description'>
                <Input.TextArea disabled={!isEditing} />
              </Form.Item>

              <div className='grid grid-cols-2 gap-4'>
                <Form.Item name={['valuation', 'height']} label='Height (mm)'>
                  <InputNumber disabled={!isEditing} min={0} step={0.1} />
                </Form.Item>
                <Form.Item name={['valuation', 'width']} label='Width (mm)'>
                  <InputNumber disabled={!isEditing} min={0} step={0.1} />
                </Form.Item>
                <Form.Item name={['valuation', 'depth']} label='Depth (mm)'>
                  <InputNumber disabled={!isEditing} min={0} step={0.1} />
                </Form.Item>
              </div>

              {/* Valuation Documents */}
              {jewelry.data.valuation.valuationDocuments && (
                <div className='mt-4'>
                  <h4 className='mb-2 font-medium'>Documents</h4>
                  <div className='space-y-2'>
                    {jewelry.data.valuation.valuationDocuments.map((doc, index) => (
                      <div key={`valuation-doc-${index}`} className='flex items-center gap-2'>
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
              {jewelry.data.valuation.seller && (
                <div className='mt-4'>
                  <h4 className='mb-2 font-medium'>Seller Information</h4>
                  <Descriptions column={2}>
                    <Descriptions.Item label='Name'>
                      {`${jewelry.data.valuation.seller.firstName} ${jewelry.data.valuation.seller.lastName}`}
                    </Descriptions.Item>
                    <Descriptions.Item label='Gender'>{jewelry.data.valuation.seller.gender}</Descriptions.Item>
                    <Descriptions.Item label='Email'>
                      {jewelry.data.valuation.seller.accountDTO.email}
                    </Descriptions.Item>
                    <Descriptions.Item label='Phone'>
                      {jewelry.data.valuation.seller.accountDTO.phoneNumber}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              )}
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
            {/* <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={isUpdating}> */}
            <Button type='primary' icon={<SaveOutlined />} onClick={handleSave}>
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
