import { FacebookOutlined, GithubOutlined, InstagramOutlined, TwitterOutlined } from '@ant-design/icons'
import { Layout, Space, Typography } from 'antd'

const { Footer } = Layout
const { Text } = Typography

export default function CustomFooter() {
  return (
    <Footer className='p-5 text-center bg-black'>
      <Space direction='vertical' size='large'>
        {/* Platform Name */}
        <Text className='text-lg text-white'>Jewelry Auction System</Text>
        {/* Copyright */}
        <Text className='text-gray-400'>© 2024 Jewelry Auction Inc. All rights reserved.</Text>
        {/* Social Media Icons */}
        <Space size='large'>
          <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
            <FacebookOutlined className='text-2xl text-white' />
          </a>
          <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
            <TwitterOutlined className='text-2xl text-white' />
          </a>
          <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
            <InstagramOutlined className='text-2xl text-white' />
          </a>
          <a href='https://github.com' target='_blank' rel='noopener noreferrer'>
            <GithubOutlined className='text-2xl text-white' />
          </a>
        </Space>
      </Space>
    </Footer>
  )
}
