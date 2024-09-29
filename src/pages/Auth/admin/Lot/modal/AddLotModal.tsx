import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, DatePicker, TimePicker, InputNumber, Checkbox, Button } from 'antd'
import { Lot } from '../LotList'

const { Option } = Select

interface AddLotModalProps {
  visible: boolean
  onCancel: () => void
  onSubmit: (values: Partial<Lot>) => void
  initialValues?: Partial<Lot>
}

const AddLotModal: React.FC<AddLotModalProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm()
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (visible) {
      form.resetFields()
      if (initialValues) {
        form.setFieldsValue(initialValues)
        setIsEditing(true)
      } else {
        setIsEditing(false)
      }
    }
  }, [visible, form, initialValues])

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values)
      form.resetFields()
    })
  }

  return (
    <Modal
      open={visible}
      title={isEditing ? 'Edit Lot Auction' : 'Add Lot Auction'}
      onCancel={onCancel}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleSubmit}>
          {isEditing ? 'Save Changes' : '+ Add Lots'}
        </Button>
      ]}
      width={600}
    >
      <Form form={form} layout='vertical'>
        <Form.Item name='title' label='Title Lots' rules={[{ required: true, message: 'Please input the title' }]}>
          <Input />
        </Form.Item>

        <Form.Item name='product' label='Product' rules={[{ required: true, message: 'Please select the product' }]}>
          <Select>
            <Option value='Cartier 5566 Diamond'>Cartier 5566 Diamond</Option>
          </Select>
        </Form.Item>

        <Form.Item name='price' label='Price: ($)' rules={[{ required: true, message: 'Please input the price' }]}>
          <InputNumber className='w-full' />
        </Form.Item>

        <Form.Item
          name='auctionName'
          label='Auction'
          rules={[{ required: true, message: 'Please select the auction' }]}
        >
          <Select defaultActiveFirstOption>
            <Option value='Watches 27/08/2024'>Watches 27/08/2024</Option>
          </Select>
        </Form.Item>

        <div className='flex justify-between'>
          <Form.Item
            name='startTime'
            label='Start Time(expected):'
            rules={[{ required: true, message: 'Please select the start time' }]}
            className='w-[48%]'
          >
            <DatePicker showTime className='w-full' />
          </Form.Item>

          <Form.Item
            name='endTime'
            label='End Time(expected):'
            rules={[{ required: true, message: 'Please select the end time' }]}
            className='w-[48%]'
          >
            <DatePicker showTime className='w-full' />
          </Form.Item>
        </div>

        <Form.Item name='type' label='Type' rules={[{ required: true, message: 'Please select the type' }]}>
          <Select>
            <Option value='Incremental Bidding Auction'>Incremental Bidding Auction</Option>
          </Select>
        </Form.Item>

        <div className='flex justify-start gap-5 mb-0'>
          <Form.Item name='extendTime' valuePropName='checked' className='mb-0'>
            <Checkbox>Extend time</Checkbox>
          </Form.Item>

          <Form.Item name='proofFinance' valuePropName='checked' className='mb-0'>
            <Checkbox>Proof finance</Checkbox>
          </Form.Item>
        </div>

        <div className='flex justify-between'>
          <Form.Item
            name='estPrice'
            label='Est Price'
            rules={[{ required: true, message: 'Please input the estimated price range' }]}
            className='w-[48%]'
          >
            <Input placeholder='e.g. 2000 - 30000' />
          </Form.Item>

          <Form.Item
            name='buyNowPrice'
            label='Price buy it now'
            rules={[{ required: true, message: 'Please input the buy now price' }]}
            className='w-[48%]'
          >
            <InputNumber className='w-full' />
          </Form.Item>
        </div>

        <div className='flex justify-between'>
          <Form.Item
            name='priceStep'
            label='Price step settings'
            rules={[{ required: true, message: 'Please select the price step' }]}
            className='w-[48%]'
          >
            <Select>
              <Option value='100'>100</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name='staffCare'
            label='Staff care'
            rules={[{ required: true, message: 'Please select the staff' }]}
            className='w-[48%]'
          >
            <Select>
              <Option value='Default'>Default</Option>
              {/* Add more options as needed */}
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default AddLotModal
