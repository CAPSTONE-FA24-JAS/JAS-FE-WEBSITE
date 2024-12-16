import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Space, Upload, notification } from 'antd'
import { useState } from 'react'
import { useCreateBlogMutation  } from '../../../../services/manageother.services'

const CreateBlogPage: React.FC<{ refetchBlogs: () => void; setIsModalVisible: (visible: boolean) => void }> = ({ refetchBlogs, setIsModalVisible }) => {
  const [form] = Form.useForm()
  const [image, setImage] = useState<any[]>([]) // Store the uploaded images as an array with file information
  const [content, setContent] = useState('')

  const [createBlog, { isLoading }] = useCreateBlogMutation()

  // Handle image upload
  const handleImageUpload = (file: File) => {
    console.log('File:', file)
    return false
  }

  const handleCreateBlog = async (values: any) => {
    const { title, content } = values
    const accountId = 61 

    if (!image || image.length === 0) {
      notification.error({
        message: 'Error',
        description: 'Please upload at least one image!',
      })
      return
    }

    const formData = new FormData()
    formData.append('Title', title)
    formData.append('Content', content) 
    formData.append('AccountId', String(accountId)) 

    image.forEach((file) => {
      formData.append('fileImages', file.originFileObj)
    })

    try {
      await createBlog({
        Title: title,
        Content: content,
        AccountId: accountId,
        fileImages: image.map((file) => file.originFileObj)
      }).unwrap()

      notification.success({
        message: 'Success',
        description: 'Blog created successfully!',
      })
      form.resetFields() 
      setImage([]) 

      refetchBlogs()
      setIsModalVisible(false)

    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to create blog. Please try again later.',
      })
      console.error('Error creating blog:', error)
    }
  }

  const handleFileListChange = ({ fileList }: { fileList: any[] }) => {
    setImage(fileList)
  }

  return (
    <div className='container mx-auto mt-10'>
      <Form form={form} layout='vertical' onFinish={handleCreateBlog} className='w-full'>
        <Form.Item
          label='Blog Title'
          name='title'
          rules={[{ required: true, message: 'Please input the blog title!' }]}
        >
          <Input placeholder='Enter the blog title' />
        </Form.Item>

        <Form.Item
          label='Image'
          name='image'
          rules={[{ required: true, message: 'Please upload an image for the blog!' }]}
        >
          <Upload
            beforeUpload={handleImageUpload} 
            showUploadList={{ showRemoveIcon: true }} 
            accept='image/*'
            maxCount={5}
            onChange={handleFileListChange} 
            fileList={image} 
            listType='picture-card' 
          >
            <Button icon={<UploadOutlined />}></Button>
          </Upload>
        </Form.Item>

        <Form.Item label='Content' name='content' rules={[{ required: true, message: 'Please input the content!' }]}>
          <Input.TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='Enter the blog content'
            rows={4} // Số dòng hiển thị của TextArea
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type='primary' htmlType='submit' loading={isLoading}>
              Create Blog
            </Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateBlogPage
