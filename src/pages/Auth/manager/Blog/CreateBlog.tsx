import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Space, Upload, message } from 'antd'
import { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useCreateBlogMutation } from '../../../../services/manageother.services'

const CreateBlogPage = () => {
  const [form] = Form.useForm()
  const [image, setImage] = useState<any[]>([]) // Store the uploaded images as an array with file information
  const [content, setContent] = useState('')

  const [createBlog, { isLoading }] = useCreateBlogMutation()

  // Handle image upload
  const handleImageUpload = (file: File) => {
    const fileWithPreview = {
      uid: file.name, // Unique ID for the file
      name: file.name,
      status: 'done', // Mark the file as uploaded
      url: URL.createObjectURL(file), // Create a URL for previewing the image
      originFileObj: file // Store the original file
    }
    // Prevent automatic upload and return false to manage upload manually
    return false
  }

  // Handle blog creation
  const handleCreateBlog = async (values: any) => {
    const { title, content } = values
    const accountId = 61 // Example AccountId, this should come from logged-in user data or context

    // Ensure image is not empty
    if (!image || image.length === 0) {
      message.error('Please upload at least one image!')
      return
    }

    // Create FormData to send as multipart/form-data
    const formData = new FormData()
    formData.append('Title', title)
    formData.append('Content', String(content)) // Ensure content is a string
    formData.append('AccountId', String(accountId)) // AccountId as a string

    // Append each image file to the FormData object
    image.forEach((file) => {
      formData.append('fileImages', file.originFileObj)
    })

    // Log the FormData for debugging
    console.log('FormData:', formData)

    // Validate data before calling the API
    if (!title || !content || image.length === 0) {
      message.error('Please make sure all fields are filled and at least one image is uploaded!')
      return
    }

    try {
      // Call the mutation with the FormData payload
      await createBlog({
        Title: title,
        Content: String(content),
        AccountId: accountId,
        fileImages: image.map((file) => file.originFileObj)
      }).unwrap()

      message.success('Blog created successfully!')
      form.resetFields() // Reset the form after successful submission
      setImage([]) // Reset image state after successful creation
    } catch (error) {
      message.error('Failed to create blog. Please try again later.')
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
            beforeUpload={handleImageUpload} // Custom image upload handler
            showUploadList={{ showRemoveIcon: true }} // Show remove icon in the upload list
            accept='image/*'
            maxCount={5}
            onChange={handleFileListChange} // Update file list on change
            fileList={image} // Pass the state as the fileList to display the uploaded images
            listType='picture-card' // Set the list type to "picture-card" for image previews
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item label='Content' name='content' rules={[{ required: true, message: 'Please input the content!' }]}>
          <ReactQuill
            value={content}
            onChange={setContent}
            placeholder='Enter the blog content'
            modules={{
              toolbar: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['bold', 'italic', 'underline'],
                ['link'],
                ['blockquote', 'code-block'],
                [{ align: [] }],
                [{ color: [] }, { background: [] }],
                ['image', 'video'],
                ['clean']
              ]
            }}
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
