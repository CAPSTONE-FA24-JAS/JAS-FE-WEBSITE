import { Button, Form, Input, Modal, notification, Table } from 'antd' // Import notification
import { useState } from 'react'
import {  useCreateKeyCharacteristicMutation, useViewKeyCharacteristicQuery } from '../../../../services/manageother.services'

const KeyCharacteristicComponent = () => {
  const { data, error, isLoading, refetch } = useViewKeyCharacteristicQuery()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [createKeyCharacteristic, { isLoading: isCreating }] = useCreateKeyCharacteristicMutation()

  if (isLoading) return <p className='py-4 text-lg text-center'>Loading keyCharacteristic...</p>
  if (error) return <p className='py-4 text-lg text-center text-red-500'>Error loading keyCharacteristic.</p>

  const categories = data?.data || []

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '50%',
      align: 'center' as const,
      render: (text: number) => <span>{text}</span>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
      align: 'center' as const,
      render: (text: string) => <span>{text}</span>
    }
  ]

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      const response = await createKeyCharacteristic({ name: values.keyCharacteristicName }).unwrap()
      console.log('Created keyCharacteristic:', response)
      form.resetFields()
      setIsModalVisible(false)
      refetch() // Call refetch to update the categories after creation

      // Show success notification
      notification.success({
        message: 'Success',
        description: `keyCharacteristic "${values.keyCharacteristicName}" created successfully.`,
        placement: 'topRight'
      })
    } catch (error) {
      console.error('Failed to create category:', error)

      // Show error notification
      notification.error({
        message: 'Error',
        description: 'Failed to create category. Please try again.',
        placement: 'topRight'
      })
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <div className='p-4'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold'>Key Characteristic</h2>
        <Button type='primary' onClick={showModal}>
          Create KeyCharacteristic
        </Button>
      </div>
      <Table dataSource={categories} columns={columns} pagination={false} rowKey='id' bordered className='min-w-full' />

      <Modal
        title='Create New KeyCharacteristic'
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isCreating} // Show loading state on OK button
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Key Characteristic Name'
            name='keyCharacteristicName'
            rules={[{ required: true, message: 'Please input the keyCharacteristic name!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default KeyCharacteristicComponent
