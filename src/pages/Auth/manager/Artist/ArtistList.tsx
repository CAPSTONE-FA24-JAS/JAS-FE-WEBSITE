import { Button, Form, Input, Modal, notification, Table } from 'antd'
import { useState } from 'react'
import { useCreateArtistMutation, useViewArtistsQuery } from '../../../../services/manageother.services'

const ArtistList = () => {
  const { data, error, isLoading, refetch } = useViewArtistsQuery()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [createArtist, { isLoading: isCreating }] = useCreateArtistMutation()

  if (isLoading) return <p className='py-4 text-lg text-center'>Loading artists...</p>
  if (error) return <p className='py-4 text-lg text-center text-red-500'>Error loading artists.</p>

  const artists = data?.data || []

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
      const response = await createArtist({ name: values.artistName }).unwrap()
      console.log('Created artist:', response)
      form.resetFields()
      setIsModalVisible(false)
      refetch() // Refresh the artist list after creation

      notification.success({
        message: 'Success',
        description: `Artist "${values.artistName}" created successfully.`,
        placement: 'topRight'
      })
    } catch (error) {
      console.error('Failed to create artist:', error)
      notification.error({
        message: 'Error',
        description: 'Failed to create artist. Please try again.',
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
        <h2 className='text-2xl font-bold'>Artists</h2>
        <Button type='primary' onClick={showModal}>
          Create Artist
        </Button>
      </div>
      <Table dataSource={artists} columns={columns} pagination={false} rowKey='id' bordered className='min-w-full' />

      <Modal
        title='Create New Artist'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isCreating}
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Artist Name'
            name='artistName'
            rules={[{ required: true, message: 'Please input the artist name!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ArtistList
