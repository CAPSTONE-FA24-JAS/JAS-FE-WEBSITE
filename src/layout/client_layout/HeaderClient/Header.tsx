import React from 'react'
import { Menu } from 'antd'
import { HomeOutlined, TrophyOutlined, FileTextOutlined, InfoCircleOutlined, LoginOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

export default function CustomHeader() {
  return (
    <header className='bg-white p-6 shadow-md'>
      <div className='flex items-center h-12 mx-28'>
        {/* Logo on the top left with two lines */}
        <div className='flex flex-col items-center justify-center text-[#000000] text-2xl font-bold uppercase'>
          <span>JAS</span>
          <span className='text-base font-normal'>Auctions</span>
        </div>

        <Menu theme='light' mode='horizontal' className='ml-auto bg-transparent uppercase'>
          <Menu.Item key='home' icon={<HomeOutlined />}>
            <Link to='/'>Home</Link>
          </Menu.Item>
          <Menu.SubMenu key='auction' icon={<TrophyOutlined />} title='Auction'>
            <Menu.Item key='upcoming'>
              <Link to='/upcoming-auctions'>Upcoming Auctions</Link>
            </Menu.Item>
            <Menu.Item key='past'>
              <Link to='/pastauction'>Past Auctions</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key='blog' icon={<FileTextOutlined />}>
            <Link to='/blog'>Blog</Link>
          </Menu.Item>
          <Menu.Item key='about' icon={<InfoCircleOutlined />}>
            <Link to='/about'>About Us</Link>
          </Menu.Item>
          <Menu.Item key='login' icon={<LoginOutlined />}>
            <Link to='/login'>Login</Link>
          </Menu.Item>
        </Menu>
      </div>
    </header>
  )
}
