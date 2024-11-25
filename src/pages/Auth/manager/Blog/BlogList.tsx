import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Image, Modal, Table, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useViewBlogsQuery } from '../../../../services/manageother.services'
import CreateBlogPage from './CreateBlog'

type Blog = {
  id: number
  image: string
  nameBlog: string
  createDate: string
}

const BlogTable = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const navigate = useNavigate()

  const { data, error, isLoading } = useViewBlogsQuery()

  useEffect(() => {
    if (data?.isSuccess && data?.data) {
      const formattedBlogs: Blog[] = data.data.map((blog: any) => ({
        id: blog.id,
        image: blog.imageBlogDTOs?.[0]?.imageLink,
        nameBlog: blog.title,
        createDate: new Date().toLocaleDateString()
      }))
      setBlogs(formattedBlogs)
    }
  }, [data])

  const handleView = (id: number) => {
    navigate(`/admin/blog/${id}`)
  }

  const handleCreate = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '20%'
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => <Image src={image} alt='Blog Image' width={50} height={50} />,
      width: '20%'
    },
    {
      title: 'Name Blog',
      dataIndex: 'nameBlog',
      key: 'nameBlog',
      width: '20%'
    },
    {
      title: 'Create Date',
      dataIndex: 'createDate',
      key: 'createDate',
      width: '20%'
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: any) => (
        <div>
          <Tooltip title='View Blog'>
            <Button icon={<EyeOutlined />} onClick={() => handleView(record.id)} className='mr-2' />
          </Tooltip>
          <Tooltip title='Delete Blog'>
            <Button icon={<DeleteOutlined />} />
          </Tooltip>
        </div>
      ),
      width: '20%'
    }
  ]

  if (isLoading) {
    return <div>Loading blogs...</div>
  }

  if (error) {
    return <div>Error loading blogs</div>
  }

  return (
    <div className='container mx-auto'>
      <p className='text-2xl font-bold'>Blog List</p>
      <div className='mb-4 text-right'>
        <Tooltip title='Create Blog'>
          <Button type='primary' icon={<PlusOutlined />} onClick={handleCreate} />
        </Tooltip>
      </div>

      <Table columns={columns} dataSource={blogs} rowKey='id' pagination={false} style={{ tableLayout: 'fixed' }} />

      <Modal title='Create New Blog' open={isModalVisible} onCancel={handleCancel} footer={null} width={700}>
        <CreateBlogPage />
      </Modal>
    </div>
  )
}

export default BlogTable
