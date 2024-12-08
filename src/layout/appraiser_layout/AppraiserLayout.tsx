import { Layout } from 'antd'
import SiderAppraiser from './SiderAppraiser/SiderAppraiser'
import HeaderAppraiser from './HeaderAppraiser/HeaderAppraiser'
import ContentAppraiser from './ContentAppraiser/ContentAppraiser'
import FooterAppraiser from './FooterAppraiser/FooterAppraiser'
import { useState } from 'react'
export default function AppraiserLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Layout className='min-h-screen'>
      <Layout className='bg-white '>
        <SiderAppraiser onCollapse={setCollapsed} />
        <Layout>
          <HeaderAppraiser collapsed={collapsed} />
          <ContentAppraiser>{children}</ContentAppraiser>
        </Layout>
      </Layout>
      <FooterAppraiser />
    </Layout>
  )
}
