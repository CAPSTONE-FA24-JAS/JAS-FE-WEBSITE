import { Button, Form, Input, Modal, notification, Table } from 'antd' // Import notification
import { useState } from 'react'
import { useCreateCategoryMutation, useViewCategoriesQuery } from '../../../../services/manageother.services'

const CategoriesComponent = () => {
  const { data, error, isLoading, refetch } = useViewCategoriesQuery()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()

  if (isLoading) return <p className='py-4 text-lg text-center'>Loading categories...</p>
  if (error) return <p className='py-4 text-lg text-center text-red-500'>Error loading categories.</p>

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
      const response = await createCategory({ name: values.categoryName }).unwrap()
      console.log('Created category:', response)
      form.resetFields()
      setIsModalVisible(false)
      refetch() // Call refetch to update the categories after creation

      // Show success notification
      notification.success({
        message: 'Success',
        description: `Category "${values.categoryName}" created successfully.`,
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
        <h2 className='text-2xl font-bold'>Categories</h2>
        <Button type='primary' onClick={showModal}>
          Create Category
        </Button>
      </div>
      <Table dataSource={categories} columns={columns} pagination={false} rowKey='id' bordered className='min-w-full' />

      <Modal
        title='Create New Category'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isCreating} // Show loading state on OK button
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Category Name'
            name='categoryName'
            rules={[{ required: true, message: 'Please input the category name!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CategoriesComponent
