import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, DatePicker, InputNumber, Checkbox, Button, Image } from 'antd'
import { CreateLot, ListLot } from '../../../../../types/Lot.type'
import { useGetJewelriesNoSlotQuery } from '../../../../../services/jewelry.services'
import { useGetFilterByRoleQuery } from '../../../../../services/account.services'
import { Jewelry } from '../../../../../types/Jewelry.type'
import { Auction } from '../../../../../types/Auction.type'
import dayjs from 'dayjs'

const { Option } = Select

interface AddLotModalProps {
  isLoading: boolean
  auctionData: Auction
  visible: boolean
  onCancel: () => void
  onSubmit: (values: Partial<ListLot>) => void
  initialValues: ListLot
}

type AuctionType = 'Private Bid' | 'Random Draw Auction' | 'Dutch Auction' | 'Incremental Bidding Auction'

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

  const { data: listStaff, isFetching: staffLoading } = useGetFilterByRoleQuery(3, {
    skip: !visible
  })

  const getBidTypeFromBidForm = (bidForm: string | undefined): string => {
    switch (bidForm) {
      case 'Fixed_Price':
        return '1'
      case 'Secret_Auction':
        return '2'
      case 'Public_Auction':
        return '3'
      case 'Auction_Price_GraduallyReduced':
        return '4'
      default:
        return ''
    }
  }

  useEffect(() => {
    if (chooseJewelry !== null && data) {
      form.setFieldValue('type', null)
      const selectedJewelry = data.data.dataResponse.find((jewelry) => jewelry.id === chooseJewelry)
      setJewelryData(selectedJewelry)

      const newAuctionType = getBidTypeFromBidForm(selectedJewelry?.bidForm)
      console.log('ándasnd', selectedJewelry?.bidForm)

      setAuctionType(newAuctionType)
      form.setFieldValue('type', newAuctionType)
    }
  }, [chooseJewelry, data])

  useEffect(() => {
    if (visible) {
      form.resetFields()

      if (initialValues) {
        form.setFieldsValue(initialValues)
        setIsEditing(true)
        setAuctionType(initialValues.lotType as AuctionType)
      } else {
        setIsEditing(false)
        setAuctionType('1')
      }
    }
  }, [visible, form, initialValues])

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const FormatValues: CreateLot = {
        title: values.title,
        deposit: values.deposit,
        buyNowPrice: values.buyNowPrice,
        isExtend: values.extendTime,
        haveFinancialProof: values.proofFinance,
        staffId: values.staffCare,
        jewelryId: values.jewelry,
        auctionId: auctionData.id,
        startPrice: values.startPrice,
        finalPriceSold: values.finalPriceSold,
        bidIncrement: values.priceStep,
        lotTypeValue: Number(auctionType),
        bidIncrementTime: values.bidIncrementTime
      }
      onSubmit(FormatValues)
      form.resetFields()
    })
  }

  const handleJewelryChange = (value: number) => {
    setChooseJewelry(value)
  }

  const renderAuctionTypeSpecificFields = () => {
    switch (auctionType) {
      case '1': // fixed price auction
        return (
          <Form.Item
            name='buyNowPrice'
            label='buyNowPrice'
            rules={[{ required: true, message: 'Please input the price' }]}
            className='w-full'
          >
            <InputNumber className='w-full' />
          </Form.Item>
        )
      case '2': // secret auction
        return (
          <div className='flex justify-between'>
            <Form.Item
              name='startPrice'
              label='Price Min'
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
            >
              <Input
                type='number'
                onBlur={() => {
                  form.validateFields(['finalPriceSold'])
                }}
              />
            </Form.Item>

            <Form.Item
              name='finalPriceSold'
              label='Price Max'
              validateFirst={true}
              rules={[
                { required: true, message: 'Please input the maximum price' },
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
                      : Promise.reject(new Error('Maximum price must be greater than minimum price'))
                  }
                })
              ]}
              className='w-[48%]'
            >
              <Input
                type='number'
                onBlur={() => {
                  form.validateFields(['startPrice'])
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
                label='Price Min'
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
              >
                <Input
                  type='number'
                  onBlur={() => {
                    form.validateFields(['finalPriceSold'])
                  }}
                />
              </Form.Item>

              <Form.Item
                name='finalPriceSold'
                label='Price Max'
                validateFirst={true}
                rules={[
                  { required: true, message: 'Please input the maximum price' },
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
                        : Promise.reject(new Error('Maximum price must be greater than minimum price'))
                    }
                  })
                ]}
                className='w-[48%]'
              >
                <Input
                  type='number'
                  onBlur={() => {
                    form.validateFields(['startPrice'])
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
              <InputNumber className='w-full' />
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
                  label='Price Max' // Giá khởi điểm - cao nhất
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
                >
                  <Input
                    type='number'
                    onBlur={() => {
                      form.validateFields(['finalPriceSold'])
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name='finalPriceSold'
                  label='Price Min' // Giá mục tiêu - thấp nhất
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
                  <Input
                    type='number'
                    onBlur={() => {
                      form.validateFields(['startPrice'])
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
                  <InputNumber className='w-full' />
                </Form.Item>

                <Form.Item
                  name='bidIncrementTime'
                  label='Bid Decrease Time (minute)'
                  rules={[{ required: true, message: 'Please input the decreate amout' }]}
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

  return (
    <Modal
      forceRender
      open={visible}
      title={isEditing ? 'Edit Lot Auction' : 'Add Lot Auction'}
      onCancel={onCancel}
      loading={jewelryLoading && staffLoading}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleSubmit} loading={isLoading}>
          {isEditing ? 'Save Changes' : '+ Add Lots'}
        </Button>
      ]}
      width={600}
    >
      <Form form={form} layout='vertical'>
        <Form.Item name='title' label='Title Lots' rules={[{ required: true, message: 'Please input the title' }]}>
          <Input />
        </Form.Item>

        <Form.Item name='jewelry' label='Jewelry' rules={[{ required: true, message: 'Please select the Jewelry' }]}>
          <Select onChange={handleJewelryChange}>
            {data?.data.dataResponse.map((jewelry) => (
              <Option key={jewelry.id} value={jewelry.id}>
                {jewelry.id} - <Image width={30} src={jewelry.imageJewelries[0]?.imageLink || 'default-image-url'} />-{' '}
                {jewelry.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Input
          disabled
          placeholder='Est price from jewelry'
          value={
            jewelryData ? `${jewelryData.estimatePriceMin} - ${jewelryData.estimatePriceMax}` : 'No jewelry selected'
          }
        />

        <Form.Item name='deposit' label='Deposit' rules={[{ required: true, message: 'Please input the Deposit' }]}>
          <Input />
        </Form.Item>

        <div className='flex justify-between'>
          <Form.Item
            name='startTime'
            label='Start Time(expected):'
            initialValue={dayjs(auctionData.startTime)}
            rules={[{ required: true, message: 'Please select the start time' }]}
            className='w-[48%]'
          >
            <DatePicker disabled showTime className='w-full' />
          </Form.Item>

          <Form.Item
            name='endTime'
            label='End Time(expected):'
            initialValue={dayjs(auctionData.endTime)}
            rules={[{ required: true, message: 'Please select the end time' }]}
            className='w-[48%]'
          >
            <DatePicker disabled showTime className='w-full' />
          </Form.Item>
        </div>

        <Form.Item name='type' label='Type' rules={[{ required: true, message: 'Please select the type' }]}>
          <Select
            value={auctionType}
            onChange={(value) => setAuctionType(value)}
            disabled={!auctionType == null ? true : false}
          >
            <Option value='1'>Fixed Price Auction</Option>
            <Option value='2'>Secret Auction</Option>
            <Option value='3'>Public Auction</Option>
            <Option value='4'>Auction Price GraduallyReduced</Option>
          </Select>
        </Form.Item>

        {renderAuctionTypeSpecificFields()}

        {auctionType ? (
          <div className='flex justify-start gap-5 mb-4'>
            {auctionType === '3' || auctionType === '4' ? (
              <Form.Item initialValue={true} name='extendTime' valuePropName='checked' className='mb-0'>
                <Checkbox defaultChecked>Extend time</Checkbox>
              </Form.Item>
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
