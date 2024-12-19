import { Button, Checkbox, DatePicker, Form, Image, Input, InputNumber, Modal, notification, Select } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useGetFilterByRoleQuery } from '../../../../../services/account.services'
import { useGetJewelriesNoSlotQuery, useGetJewelryByIdQuery } from '../../../../../services/jewelry.services'
import { Auction } from '../../../../../types/Auction.type'
import { Jewelry } from '../../../../../types/Jewelry.type'
import { CreateLot, ListLot } from '../../../../../types/Lot.type'
import { parsePriceVND } from '../../../../../utils/convertTypeDayjs'

const { Option } = Select

interface AddLotModalProps {
  isLoading: boolean
  auctionData: Auction
  visible: boolean
  onCancel: () => void
  onSubmit: (values: Partial<ListLot>) => void
  initialValues: ListLot
}

const AddLotModal: React.FC<AddLotModalProps> = ({
  auctionData,
  visible,
  onCancel,
  onSubmit,
  initialValues,
  isLoading
}) => {
  const [form] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)
  const [auctionType, setAuctionType] = useState<string>('')
  const { data, isFetching: jewelryLoading } = useGetJewelriesNoSlotQuery(undefined, { skip: !visible })
  const [chooseJewelry, setChooseJewelry] = useState<number | null>(null)
  const [jewelryData, setJewelryData] = useState<Jewelry>()
  const [isExtendTimeEnabled, setIsExtendTimeEnabled] = useState(true)
  const [selectedPercentage, setSelectedPercentage] = useState<number>(0)

  const { data: jewelryDataDetail, isFetching: jewelryLoadingDetail } = useGetJewelryByIdQuery(chooseJewelry ?? 0, {
    skip: !visible || !chooseJewelry
  })

  const { data: listStaff, isFetching: staffLoading } = useGetFilterByRoleQuery(3, {
    skip: !visible
  })

  const getLotTypeValue = (lotType: string): string => {
    const lotTypeMap: { [key: string]: string } = {
      Fixed_Price: '1',
      Secret_Auction: '2',
      Public_Auction: '3',
      Auction_Price_GraduallyReduced: '4'
    }
    return lotTypeMap[lotType] || ''
  }

  const getBidTypeFromBidForm = (bidForm: string | undefined): string => {
    switch (bidForm) {
      case 'Fixed Price':
        return '1'
      case 'Secret Auction':
        return '2'
      case 'Public Auction':
        return '3'
      case 'Auction Price GraduallyReduced':
        return '4'
      default:
        return ''
    }
  }

  // Effect for handling jewelry selection in Add mode
  useEffect(() => {
    if (chooseJewelry !== null && data && !isEditing) {
      const selectedJewelry = data.data.dataResponse.find((jewelry) => jewelry.id === chooseJewelry)
      if (selectedJewelry) {
        setJewelryData(selectedJewelry)
        form.setFieldValue('staffCare', selectedJewelry?.staffId)
        const newAuctionType = getBidTypeFromBidForm(selectedJewelry?.bidForm)
        setAuctionType(newAuctionType)
        form.setFieldValue('type', newAuctionType)
      }
    }
  }, [chooseJewelry, data, isEditing])

  // Effect for modal visibility and initialization
  useEffect(() => {
    if (visible) {
      form.resetFields()
      setChooseJewelry(null)
      setJewelryData({} as Jewelry)
      setIsExtendTimeEnabled(true)
      setSelectedPercentage(0)

      if (initialValues && Object.keys(initialValues).length > 0) {
        // Set auction type first before other form values
        const lotTypeValue = getLotTypeValue(initialValues.lotType)
        setAuctionType(lotTypeValue)

        // Set all form values for editing
        const formValues = {
          ...initialValues,
          title: initialValues.title,
          jewelry: initialValues.jewelryId,
          deposit: initialValues.deposit,
          startTime: initialValues.startTime ? dayjs(initialValues.startTime) : null,
          endTime: initialValues.endTime ? dayjs(initialValues.endTime) : null,
          type: lotTypeValue,
          buyNowPrice: initialValues.buyNowPrice,
          startPrice: initialValues.startPrice,
          finalPriceSold: initialValues.finalPriceSold,
          priceStep: initialValues.bidIncrement,
          extendTime: initialValues.isExtend,
          round: initialValues.round,
          proofFinance: initialValues.haveFinancialProof,
          staffCare: initialValues.staffId,
          bidIncrementTime: initialValues.bidIncrementTime
        }

        form.setFieldsValue(formValues)
        setIsEditing(true)
        setChooseJewelry(initialValues.jewelryId)
        setIsExtendTimeEnabled(initialValues.isExtend)
      } else {
        form.resetFields()
        setChooseJewelry(null)
        setJewelryData(undefined)
        setIsExtendTimeEnabled(true)
        setSelectedPercentage(0)
        setAuctionType('')
        setIsEditing(false)
      }
    }
  }, [visible, form, initialValues])

  // Effect for handling jewelry detail data in Edit mode
  useEffect(() => {
    if (jewelryDataDetail && isEditing) {
      setJewelryData(jewelryDataDetail.data)

      // Calculate and set deposit percentage when jewelry data is loaded
      if (initialValues?.deposit && jewelryDataDetail.data.startingPrice) {
        const percentage = Math.round((initialValues.deposit / jewelryDataDetail.data.startingPrice) * 100)
        setSelectedPercentage(percentage)
      }
    }
  }, [jewelryDataDetail, isEditing, initialValues])

  const validatePriceStep = () => {
    if (isEditing) {
      setAuctionType(() => form.getFieldValue('type'))
    }

    if (auctionType === '3' && form.getFieldValue('priceStep') === 0) {
      notification.error({
        message: 'Price step must be greater than 0'
      })
      return false
    }

    if (
      auctionType === '3' &&
      form.getFieldValue('finalPriceSold') !== 0 &&
      form.getFieldValue('finalPriceSold') !== null
    ) {
      const valuesBetweenMinAndMax = form.getFieldValue('finalPriceSold') - form.getFieldValue('startPrice')
      if (valuesBetweenMinAndMax < form.getFieldValue('priceStep')) {
        notification.error({
          message: 'Step must be less than the difference between the starting price and the final price'
        })
        return false
      }
    }

    if (auctionType === '4') {
      const valuesBetweenMinAndMax = form.getFieldValue('startPrice') - form.getFieldValue('finalPriceSold')
      if (valuesBetweenMinAndMax < form.getFieldValue('priceStep')) {
        notification.error({
          message: 'Step must be less than the difference between the starting price and the final price'
        })
        return false
      }
    }

    return true
  }

  const handleCreate = async (values: any) => {
    const createValues: CreateLot = {
      title: values.title,
      deposit: values.deposit,
      buyNowPrice: values.buyNowPrice || 0,
      isExtend: values.extendTime,
      haveFinancialProof: values.proofFinance,
      staffId: values.staffCare,
      jewelryId: values.jewelry,
      auctionId: auctionData.id,
      startPrice: values.startPrice,
      finalPriceSold: values.finalPriceSold,
      bidIncrement: values.priceStep,
      lotTypeValue: Number(auctionType),
      bidIncrementTime: values.bidIncrementTime,
      round: values.round,
      isHaveFinalPrice: values.finalPriceSold !== 0 && values.finalPriceSold ? true : false
    }

    console.log('Create Values:', createValues)
    onSubmit(createValues)
    form.resetFields()
  }

  const handleEdit = async (values: any) => {
    console.log('edit Values:', values)

    const editValues: CreateLot = {
      title: values.title,
      deposit: values.deposit,
      buyNowPrice: values.buyNowPrice || 0,
      isExtend: values.extendTime,
      haveFinancialProof: values.proofFinance,
      staffId: values.staffCare,
      jewelryId: values.jewelry,
      auctionId: auctionData.id,
      startPrice: values.startPrice,
      finalPriceSold: values.finalPriceSold,
      bidIncrement: values.priceStep,
      lotTypeValue: Number(auctionType),
      bidIncrementTime: values.bidIncrementTime,
      round: values.round,
      isHaveFinalPrice: values.finalPriceSold !== 0 && values.finalPriceSold ? true : false
    }

    console.log('Edit Values:', editValues)
    onSubmit(editValues)
    form.resetFields()
  }

  const handleSubmit = () => {
    if (!validatePriceStep()) {
      return
    }

    form
      .validateFields()
      .then((values) => {
        if (isEditing) {
          handleEdit(values)
        } else {
          handleCreate(values)
        }
      })
      .catch((error) => {
        console.error('Validation failed:', error)
      })
  }

  const handleJewelryChange = (value: number) => {
    setChooseJewelry(value)
  }

  const handleExtendTimeChange = (e: any) => {
    setIsExtendTimeEnabled(e.target.checked)
  }

  const calculatePercentage = (depositAmount: number, startingPrice: number): number => {
    if (!startingPrice) return 0
    return Math.round((depositAmount / startingPrice) * 100)
  }

  const calculateDepositAmount = (percentage: number, startingPrice: number): number => {
    return Math.floor((percentage / 100) * startingPrice)
  }

  const renderAuctionTypeSpecificFields = () => {
    switch (auctionType) {
      case '1': // fixed price auction
        return (
          <Form.Item
            name='buyNowPrice'
            label='Buy now price'
            rules={[{ required: true, message: 'Please input the price' }]}
            className='w-full'
            initialValue={jewelryData?.startingPrice ? jewelryData.startingPrice : 0}
          >
            <InputNumber
              className='w-full'
              defaultValue={jewelryData?.startingPrice ? jewelryData.startingPrice : 0}
              formatter={(value) => parsePriceVND(Number(value) ?? 0).toString()}
              parser={(value) => {
                const numberValue = value?.replace(/\D/g, '')
                return Number(numberValue) as unknown as 1
              }}
            />
          </Form.Item>
        )
      case '2': // secret auction
        return (
          <div className='flex justify-between'>
            <Form.Item
              name='startPrice'
              label='Start price'
              validateFirst={true}
              rules={[
                { required: true, message: 'Please input the minimum price' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const maxPrice = getFieldValue('finalPriceSold')
                    if (!value || !maxPrice) {
                      return Promise.resolve()
                    }
                    const minValue = Number(value)
                    const maxValue = Number(maxPrice)
                    return minValue < maxValue
                      ? Promise.resolve()
                      : Promise.reject(new Error('Minimum price must be less than maximum price'))
                  }
                })
              ]}
              className='w-[48%]'
              initialValue={jewelryData?.startingPrice ? jewelryData.startingPrice : 0}
            >
              <InputNumber
                className='w-full'
                defaultValue={jewelryData?.startingPrice ? jewelryData.startingPrice : 0}
                onBlur={() => {
                  form.validateFields(['finalPriceSold'])
                }}
                formatter={(value) => parsePriceVND(Number(value) ?? 0).toString()}
                parser={(value) => {
                  const numberValue = value?.replace(/\D/g, '')
                  return Number(numberValue) as unknown as 1
                }}
              />
            </Form.Item>
          </div>
        )

      case '3': // public auction
        return (
          <div className='flex-col justify-between'>
            <div className='flex justify-between'>
              <Form.Item
                name='startPrice'
                label='Start price'
                validateFirst={true}
                rules={[
                  { required: true, message: 'Please input the minimum price' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const maxPrice = getFieldValue('finalPriceSold')
                      if (!value || !maxPrice) {
                        return Promise.resolve()
                      }
                      const minValue = Number(value)
                      const maxValue = Number(maxPrice)
                      return minValue < maxValue
                        ? Promise.resolve()
                        : Promise.reject(new Error('Minimum price must be less than maximum price'))
                    }
                  })
                ]}
                className='w-[48%]'
                initialValue={jewelryData?.startingPrice ? jewelryData.startingPrice : 0}
              >
                <InputNumber
                  className='w-full'
                  defaultValue={jewelryData?.startingPrice ? jewelryData.startingPrice : 0}
                  onBlur={() => {
                    form.validateFields(['finalPriceSold'])
                  }}
                  formatter={(value) => parsePriceVND(Number(value) ?? 0).toString()}
                  parser={(value) => {
                    const numberValue = value?.replace(/\D/g, '')
                    return Number(numberValue) as unknown as 1
                  }}
                />
              </Form.Item>

              <Form.Item
                name='finalPriceSold'
                label='Buy Now Price (Optional): Enter 0 when not in use.'
                validateFirst={true}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const minPrice = getFieldValue('startPrice')
                      if (!value || !minPrice) {
                        return Promise.resolve()
                      }
                      const maxValue = Number(value)
                      const minValue = Number(minPrice)
                      return maxValue > minValue
                        ? Promise.resolve()
                        : Promise.reject(new Error('Maximum price must be greater than minimumprice'))
                    }
                  })
                ]}
                className='w-[48%]'
              >
                <InputNumber
                  className='w-full'
                  onBlur={() => {
                    form.validateFields(['startPrice'])
                  }}
                  formatter={(value) => parsePriceVND(Number(value) ?? 0).toString()}
                  parser={(value) => {
                    const numberValue = value?.replace(/\D/g, '')
                    return Number(numberValue) as unknown as 1
                  }}
                />
              </Form.Item>
            </div>
            <Form.Item
              name='priceStep'
              label='Price step settings'
              rules={[{ required: true, message: 'Please input the start price' }]}
              className='w-[48%]'
            >
              <InputNumber
                className='w-full'
                formatter={(value) => parsePriceVND(Number(value) ?? 0).toString()}
                parser={(value) => {
                  const numberValue = value?.replace(/\D/g, '')
                  return Number(numberValue) as unknown as 1
                }}
              />
            </Form.Item>
          </div>
        )
      case '4': // auction price gradually reduced
        return (
          <>
            <div className='flex-col justify-between'>
              <div className='flex justify-between'>
                <Form.Item
                  name='startPrice'
                  label='Price Max'
                  validateFirst={true}
                  rules={[
                    { required: true, message: 'Please input the maximum price' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const minPrice = getFieldValue('finalPriceSold')
                        if (!value || !minPrice) {
                          return Promise.resolve()
                        }
                        const maxValue = Number(value)
                        const minValue = Number(minPrice)
                        return maxValue > minValue
                          ? Promise.resolve()
                          : Promise.reject(new Error('Maximum price must be greater than minimum price'))
                      }
                    })
                  ]}
                  className='w-[48%]'
                  initialValue={jewelryData?.startingPrice ? jewelryData.startingPrice : 0}
                >
                  <InputNumber
                    className='w-full'
                    onBlur={() => {
                      form.validateFields(['finalPriceSold'])
                    }}
                    formatter={(value) => parsePriceVND(Number(value) ?? 0).toString()}
                    parser={(value) => {
                      const numberValue = value?.replace(/\D/g, '')
                      return Number(numberValue) as unknown as 1
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name='finalPriceSold'
                  label='Price Min'
                  validateFirst={true}
                  rules={[
                    { required: true, message: 'Please input the minimum price' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const maxPrice = getFieldValue('startPrice')
                        if (!value || !maxPrice) {
                          return Promise.resolve()
                        }
                        const minValue = Number(value)
                        const maxValue = Number(maxPrice)
                        return minValue < maxValue
                          ? Promise.resolve()
                          : Promise.reject(new Error('Minimum price must be less than maximum price'))
                      }
                    })
                  ]}
                  className='w-[48%]'
                >
                  <InputNumber
                    className='w-full'
                    onBlur={() => {
                      form.validateFields(['startPrice'])
                    }}
                    formatter={(value) => parsePriceVND(Number(value) ?? 0).toString()}
                    parser={(value) => {
                      const numberValue = value?.replace(/\D/g, '')
                      return Number(numberValue) as unknown as 1
                    }}
                  />
                </Form.Item>
              </div>
              <div className='flex justify-between'>
                <Form.Item
                  name='priceStep'
                  label='Bid Decrease Amount'
                  rules={[{ required: true, message: 'Please input the decreate amout' }]}
                  className='w-[48%]'
                >
                  <InputNumber
                    className='w-full'
                    formatter={(value) => parsePriceVND(Number(value) ?? 0).toString()}
                    parser={(value) => {
                      const numberValue = value?.replace(/\D/g, '')
                      return Number(numberValue) as unknown as 1
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name='bidIncrementTime'
                  label='Bid Decrease Time (seconds)'
                  rules={[{ required: true, message: 'Please input the time decrease' }]}
                  className='w-[48%]'
                >
                  <InputNumber className='w-full' />
                </Form.Item>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  const JewelryOption: React.FC<{ jewelry: Jewelry }> = ({ jewelry }) => (
    <div className='flex items-center gap-2'>
      <div className='flex-shrink-0 w-8 h-8 overflow-hidden'>
        <Image
          width={32}
          height={32}
          src={jewelry.imageJewelries[0]?.imageLink || 'default-image-url'}
          className='object-cover'
          preview={false}
        />
      </div>
      <span className='truncate'>
        {jewelry.id} - {jewelry.name}
      </span>
    </div>
  )

  return (
    <Modal
      forceRender
      open={visible}
      title={isEditing ? 'Edit Lot Auction' : 'Add Lot Auction'}
      onCancel={onCancel}
      loading={jewelryLoading && staffLoading && jewelryLoadingDetail}
      footer={[
        <Button
          key='cancel'
          onClick={() => {
            form.resetFields()
            setChooseJewelry(null)
            setJewelryData(undefined)
            setIsExtendTimeEnabled(true)
            setSelectedPercentage(0)
            setAuctionType('')
            setIsEditing(false)
            onCancel()
          }}
        >
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleSubmit} loading={isLoading}>
          {isEditing ? 'Save Changes' : '+ Add Lots'}
        </Button>
      ]}
      width={600}
    >
      <Form form={form} layout='vertical'>
        <Form.Item name='title' label='Title lot' rules={[{ required: true, message: 'Please input the title' }]}>
          <Input />
        </Form.Item>
        <Form.Item name='jewelry' label='Jewelry' rules={[{ required: true, message: 'Please select the Jewelry' }]}>
          <Select onChange={handleJewelryChange} optionLabelProp='label' disabled={isEditing}>
            {data?.data.dataResponse.map((jewelry) => (
              <Option key={jewelry.id} value={jewelry.id} label={`${jewelry.id} - ${jewelry.name}`}>
                <JewelryOption jewelry={jewelry} />
              </Option>
            ))}
          </Select>
        </Form.Item>
        {jewelryData && jewelryData.imageJewelries && (
          <>
            <div className='p-2 mb-4 border rounded'>
              <div className='flex items-center gap-3'>
                <div className='flex-shrink-0 w-12 h-12 overflow-hidden'>
                  <Image
                    width={48}
                    height={48}
                    src={jewelryData.imageJewelries[0]?.imageLink || 'default-image-url'}
                    className='object-cover'
                    preview={false}
                  />
                </div>
                <div className='flex-grow'>
                  <div className='font-medium'>{jewelryData.name}</div>
                  <div className='text-sm text-gray-500'>
                    Est. Price: {jewelryData.estimatePriceMin ? parsePriceVND(jewelryData.estimatePriceMin) : 0} -
                    {jewelryData.estimatePriceMax ? parsePriceVND(jewelryData.estimatePriceMax) : 0}
                  </div>
                  <div className='text-sm text-gray-500'>
                    Start price: {jewelryData.startingPrice ? parsePriceVND(jewelryData.startingPrice) : 0} - Specific
                    price: {jewelryData.specificPrice ? parsePriceVND(jewelryData.specificPrice) : 0}
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-2'>
                <Form.Item label='Deposit' className='mb-0'>
                  <div className='flex gap-2 mb-2'>
                    {[10, 20, 30, 40, 50].map((percentage) => {
                      const startingPrice = jewelryData?.startingPrice || 0
                      return (
                        <Button
                          key={percentage}
                          type={selectedPercentage === percentage ? 'primary' : 'default'}
                          onClick={() => {
                            setSelectedPercentage(percentage)
                            const depositAmount = calculateDepositAmount(percentage, startingPrice)
                            form.setFieldValue('deposit', depositAmount)
                          }}
                          className='min-w-[60px]'
                        >
                          {percentage}%
                        </Button>
                      )
                    })}
                  </div>

                  <Form.Item
                    name='deposit'
                    rules={[{ required: true, message: 'Please input deposit amount' }]}
                    className='mb-0'
                  >
                    <InputNumber
                      className='w-1/3'
                      formatter={(value) => parsePriceVND(Number(value)).toString()}
                      parser={(value) => {
                        const numberValue = value?.replace(/\D/g, '')
                        return Number(numberValue) as unknown as 1
                      }}
                      min={1}
                      onChange={(value) => {
                        if (value) {
                          const startingPrice = jewelryData?.startingPrice || 0
                          const currentPercentage = calculatePercentage(Number(value), startingPrice)

                          // Update percentage selection
                          if ([10, 20, 30, 40, 50].includes(currentPercentage)) {
                            setSelectedPercentage(currentPercentage)
                          } else {
                            setSelectedPercentage(0)
                          }
                        }
                      }}
                    />
                  </Form.Item>
                </Form.Item>
              </div>
            </div>
          </>
        )}
        <div className='flex justify-between'>
          <Form.Item
            name='startTime'
            label='Start Time:'
            initialValue={auctionData.startTime ? dayjs(auctionData.startTime) : null}
            rules={[{ required: true, message: 'Please select the start time' }]}
            className='w-[48%]'
          >
            <DatePicker disabled showTime className='w-full' />
          </Form.Item>

          <Form.Item
            name='endTime'
            label='End Time(expected):'
            initialValue={auctionData.endTime ? dayjs(auctionData.endTime) : null}
            rules={[{ required: true, message: 'Please select the end time' }]}
            className='w-[48%]'
          >
            <DatePicker disabled showTime className='w-full' />
          </Form.Item>
        </div>
        <Form.Item name='type' label='Type' rules={[{ required: true, message: 'Please select the type' }]}>
          <Select value={auctionType} onChange={(value) => setAuctionType(value)} disabled={isEditing}>
            <Option value='1'>Fixed Price Auction</Option>
            <Option value='2'>Secret Auction</Option>
            <Option value='3'>Public Auction</Option>
            <Option value='4'>Reverse Auction</Option>
          </Select>
        </Form.Item>
        {renderAuctionTypeSpecificFields()}
        {auctionType ? (
          <div className='flex justify-start gap-5 mb-4'>
            {auctionType === '3' ? (
              <>
                <div className='flex-col'>
                  <Form.Item initialValue={true} name='extendTime' valuePropName='checked' className='mb-0'>
                    <Checkbox defaultChecked onChange={handleExtendTimeChange}>
                      Extend time
                    </Checkbox>
                  </Form.Item>
                  {isExtendTimeEnabled && (
                    <Form.Item name='round' label='Extend rounds' rules={[{ type: 'number' }]} className='mb-0'>
                      <InputNumber min={1} className='w-24' />
                    </Form.Item>
                  )}
                </div>
              </>
            ) : (
              ''
            )}

            <Form.Item initialValue={true} name='proofFinance' valuePropName='checked' className='mb-0'>
              <Checkbox defaultChecked>Proof finance</Checkbox>
            </Form.Item>
          </div>
        ) : (
          ''
        )}
        <Form.Item
          name='staffCare'
          label='Staff care'
          rules={[{ required: true, message: 'Please select the staff' }]}
          className='w-full'
          initialValue={jewelryData?.staffId}
        >
          <Select>
            {listStaff?.data.map((staff) => (
              <Option key={staff.staffDTO.id} value={staff.staffDTO.id}>
                {staff.staffDTO.firstName} {staff.staffDTO.lastName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddLotModal
