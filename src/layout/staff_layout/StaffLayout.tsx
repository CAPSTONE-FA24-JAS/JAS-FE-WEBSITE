import { Layout } from 'antd'
import React, { useState } from 'react'
import HeaderStaff from './HeaderStaff/HeaderStaff'
import ContentStaff from './ContentStaff/ContentStaff'
import FooterStaff from './FooterStaff/FooterStaff'
import SiderStaff from './SiderStaff/SiderStaff'

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Layout className='min-h-screen'>
      <Layout className='bg-white'>
        <SiderStaff onCollapse={setCollapsed} />
        <Layout>
          <HeaderStaff collapsed={collapsed} />
          <ContentStaff>{children}</ContentStaff>
        </Layout>
      </Layout>
      <FooterStaff />
    </Layout>
  )
}
