import React, { useState } from 'react'
import { Table, Button, Image, Modal, Tooltip } from 'antd'
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import CreateBlogPage from './CreateBlog'

const BlogTable = () => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      image: 'https://via.placeholder.com/100',
      nameBlog: 'Blog Post 1',
      createDate: '2024-11-01'
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/100',
      nameBlog: 'Blog Post 2',
      createDate: '2024-11-02'
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/100',
      nameBlog: 'Blog Post 3',
      createDate: '2024-11-03'
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/100',
      nameBlog: 'Blog Post 4',
      createDate: '2024-11-04'
    },
    {
      id: 5,
      image: 'https://via.placeholder.com/100',
      nameBlog: 'Blog Post 5',
      createDate: '2024-11-05'
    }
  ])

  const [isModalVisible, setIsModalVisible] = useState(false) // State for modal visibility

  const handleView = (id: any) => {
    console.log('Viewing blog with ID:', id)
  }

  const handleDelete = (id: any) => {
    const updatedBlogs = blogs.filter((blog) => blog.id !== id)
    setBlogs(updatedBlogs)
    console.log('Deleted blog with ID:', id)
  }

  const handleCreate = () => {
    setIsModalVisible(true) // Open the modal
  }

  const handleCancel = () => {
    setIsModalVisible(false) // Close the modal
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '20%' // Ensure each column takes equal width
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: any) => <Image src={image} alt='Blog Image' width={50} height={50} />,
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
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger />
          </Tooltip>
        </div>
      ),
      width: '20%'
    }
  ]

  return (
    <div className='container mx-auto'>
      <p className='text-2xl font-bold'>Blog List</p>
      <div className='text-right mb-4'>
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
