import React from 'react'
import { Layout, Typography, Space } from 'antd'
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, GithubOutlined } from '@ant-design/icons'

const { Footer } = Layout
const { Text } = Typography

export default function CustomFooter() {
  return (
    <Footer className='bg-black text-center p-5'>
      <Space direction='vertical' size='large'>
        {/* Platform Name */}
        <Text className='text-white text-lg'>Jewelry Auction System</Text>
        {/* Copyright */}
        <Text className='text-gray-400'>© 2024 Jewelry Auction Inc. All rights reserved.</Text>
        {/* Social Media Icons */}
        <Space size='large'>
          <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
            <FacebookOutlined className='text-white text-2xl' />
          </a>
          <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
            <TwitterOutlined className='text-white text-2xl' />
          </a>
          <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
            <InstagramOutlined className='text-white text-2xl' />
          </a>
          <a href='https://github.com' target='_blank' rel='noopener noreferrer'>
            <GithubOutlined className='text-white text-2xl' />
          </a>
        </Space>
      </Space>
    </Footer>
  )
}
