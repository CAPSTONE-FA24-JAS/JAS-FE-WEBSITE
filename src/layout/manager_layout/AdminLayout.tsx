import { Layout } from 'antd'
import ContentAdmin from './ContentAdmin/ContentAdmin'
import FooterAdmin from './FooterAdmin/FooterAdmin'
import HeaderAdmin from './HeaderAdmin/HeaderAdmin'
import SiderAdmin from './SiderAdmin/SiderAdmin'
import { useState } from 'react'
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Layout className='min-h-screen'>
      <Layout className='bg-white '>
        <SiderAdmin onCollapse={setCollapsed} />
        <Layout>
          <HeaderAdmin collapsed={collapsed} />
          <ContentAdmin>{children}</ContentAdmin>
        </Layout>
      </Layout>
      <FooterAdmin />
    </Layout>
  )
}
