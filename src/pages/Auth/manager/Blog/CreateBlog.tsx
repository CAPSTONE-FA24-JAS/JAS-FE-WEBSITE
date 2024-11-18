import { UploadOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Space, Upload } from 'antd'
import { RcFile } from 'antd/es/upload/interface'
import { Moment } from 'moment'
import { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const CreateBlogPage = () => {
  const [form] = Form.useForm()
  const [image, setImage] = useState<RcFile | null>(null)
  const [createDate, setCreateDate] = useState<Moment | null>(null)
  const [content, setContent] = useState('')

  const handleImageUpload = (file: RcFile) => {
    setImage(file)
    return false
  }

  // const handleCreateBlog = (values: any) => {
  //   const newBlog = {
  //     ...values,
  //     image: image ? (image as RcFile).originFileObj : null, // Cast image to RcFile
  //     createDate: createDate ? createDate.format('YYYY-MM-DD') : null, // Safely access format()
  //     content, // Add the rich text content
  //   }
  //   console.log('New Blog:', newBlog)

  //   // You can call your API to save the blog here
  //   message.success('Blog created successfully!')
  //   form.resetFields()
  // }

  return (
    <div className='container mx-auto mt-10'>
      <Form
        form={form}
        layout='vertical'
        // onFinish={handleCreateBlog}
        className='w-full  '
      >
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
          <Upload beforeUpload={handleImageUpload} showUploadList={false} accept='image/*' maxCount={1}>
            <Button icon={<UploadOutlined />}>Click to Upload Image</Button>
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

        <Form.Item
          label='Create Date'
          name='createDate'
          rules={[{ required: true, message: 'Please select the date!' }]}
        >
          <DatePicker
            // onChange={(date) => setCreateDate(date)}
            placeholder='Select the create date'
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type='primary' htmlType='submit'>
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
