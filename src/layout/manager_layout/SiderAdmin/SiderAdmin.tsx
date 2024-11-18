import React, { useEffect, useState } from 'react'
import { Menu, MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import Sider from 'antd/es/layout/Sider'
import { MdOutlineMenu } from 'react-icons/md'
import { BarChartOutlined, UserOutlined, AppstoreAddOutlined, SmileOutlined, FileTextOutlined } from '@ant-design/icons'
import { cn } from '../../../utils/cn'

export default function SiderAdmin() {
  type MenuItem = Required<MenuProps>['items'][number]

  function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return {
      key,
      icon,
      children,
      label
    } as MenuItem
  }

  const [selectedKey, setSelectedKey] = useState<string>(() => {
    return sessionStorage.getItem('selectedKey') || ''
  })

  useEffect(() => {
    sessionStorage.setItem('selectedKey', selectedKey)
  }, [selectedKey])

  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1280)

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1280)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getConditionalItems = (): MenuItem[] => {
    return [
      getItem('OverView', 'overview', <BarChartOutlined />),
      getItem('Manage Account', 'manageAccount', <UserOutlined />, [
        getItem('Account List', 'accountList', <UserOutlined />),
        getItem('Create Account', 'createAccount', <UserOutlined />)
      ]),
      getItem('Manage Category', 'category', <AppstoreAddOutlined />),
      getItem('Manage Artist', 'artist', <SmileOutlined />),
      getItem('Manage Blog', 'bloglist', <FileTextOutlined />)
    ]
  }

  const navUrl = new Map<string, string>()
  navUrl
    .set('overview', '/admin/overview')
    .set('manageAccount', '/admin/AccountList')
    .set('createAccount', '/admin/createAccount')
    .set('category', '/admin/category')
    .set('artist', '/admin/artist')
    .set('bloglist', '/admin/bloglist')

  return (
    <Sider
      theme='light'
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className='overflow-hidden border-r-[1px]'
      trigger={
        <div className='w-full border-r-[1px] border-t-[1px] flex items-center justify-center text-2xl pt-2'>
          <MdOutlineMenu />
        </div>
      }
      width={256}
    >
      <div className='border-r-[1px] border-gray-200'>
        {/* Add image here before the div */}
        <div className='flex justify-center mb-4'>
          <img
            src='https://firebasestorage.googleapis.com/v0/b/voguary.appspot.com/o/Logo_Website%2Fsnapedit_1731943467578.png?alt=media&token=aab5b0d7-a6d1-4309-a9bc-c1fe6ecd2f01'
            alt='Logo'
            className='w-36 h-36 object-contain' // Adjust size as needed
          />
        </div>

        {/* <div
          className={cn('mx-auto text-center mb-6 mt-6 pb-6', {
            hidden: collapsed
          })}
        >
          <div className='text-2xl font-bold text-black'>JAS</div>
          <div className='text-lg font-normal text-black up'>Auctions</div>
        </div>
        <div
          className={cn('mx-auto text-center mb-4 mt-4 pb-4', {
            hidden: !collapsed
          })}
        >
          <div className='py-2 text-xl font-bold text-black'>JAS</div>
        </div> */}
      </div>

      <Menu
        defaultSelectedKeys={['overview']}
        defaultOpenKeys={[]}
        selectedKeys={[selectedKey]}
        mode='inline'
        items={getConditionalItems()}
        onSelect={(e) => {
          const link = navUrl.get(e.key)
          if (link) {
            navigate(link)
            setSelectedKey(e.key)
          }
        }}
        className='text-base'
      />
    </Sider>
  )
}
