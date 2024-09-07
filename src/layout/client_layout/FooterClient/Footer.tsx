import React from 'react'
import { Layout, Typography, Space } from 'antd'
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, GithubOutlined } from '@ant-design/icons'

const { Footer } = Layout
const { Text } = Typography

export default function CustomFooter() {
  return (
    <Footer style={{ backgroundColor: '#001529', color: '#fff', textAlign: 'center', padding: '20px 0' }}>
      <Space direction='vertical' size='large'>
        <Text style={{ color: '#fff', fontSize: '18px' }}>Jewelry Auction Platform</Text>
        <Text style={{ color: '#ccc' }}>© 2024 Jewelry Auction Inc. All rights reserved.</Text>
        <Space size='large'>
          <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
            <FacebookOutlined style={{ color: '#fff', fontSize: '24px' }} />
          </a>
          <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
            <TwitterOutlined style={{ color: '#fff', fontSize: '24px' }} />
          </a>
          <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
            <InstagramOutlined style={{ color: '#fff', fontSize: '24px' }} />
          </a>
          <a href='https://github.com' target='_blank' rel='noopener noreferrer'>
            <GithubOutlined style={{ color: '#fff', fontSize: '24px' }} />
          </a>
        </Space>
      </Space>
    </Footer>
  )
}
