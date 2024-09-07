import React from 'react'
import { Layout, Menu, Typography, Space } from 'antd'
import { HomeOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

const { Header } = Layout
const { Title } = Typography

export default function CustomHeader() {
  return (
    <Header style={{ backgroundColor: '#001529', padding: '0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '64px' }}>
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          Jewelry Auction
        </Title>
        <Menu theme='dark' mode='horizontal' style={{ lineHeight: '64px', marginLeft: 'auto' }}>
          <Menu.Item key='home' icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key='search' icon={<SearchOutlined />}>
            Search
          </Menu.Item>
          <Menu.Item key='cart' icon={<ShoppingCartOutlined />}>
            Cart
          </Menu.Item>
          <Menu.Item key='profile' icon={<UserOutlined />}>
            Profile
          </Menu.Item>
        </Menu>
      </div>
    </Header>
  )
}
