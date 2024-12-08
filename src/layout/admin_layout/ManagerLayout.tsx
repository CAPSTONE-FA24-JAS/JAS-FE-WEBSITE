import React, { useState } from 'react'
import { Layout } from 'antd'
import SiderManager from './SiderManager/SiderManager'
import HeaderManager from './HeaderManager/HeaderManager'
import ContentManager from './ContentManager/ContentManager'
import FooterManager from './FooterManager/FooterManager'

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout className='min-h-screen'>
      <Layout className='bg-white'>
        <SiderManager onCollapse={setCollapsed} />
        <Layout>
          <HeaderManager collapsed={collapsed} />
          <ContentManager>{children}</ContentManager>
        </Layout>
      </Layout>
      <FooterManager />
    </Layout>
  )
}
