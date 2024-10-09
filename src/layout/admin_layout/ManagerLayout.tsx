import { Layout } from 'antd'
import SiderManager from './SiderManager/SiderManager'
import HeaderManager from './HeaderManager/HeaderManager'
import ContentManager from './ContentManager/ContentManager'
import FooterManager from './FooterManager/FooterManager'

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout className='min-h-screen'>
      <SiderManager />
      <Layout className='bg-white '>
        <HeaderManager />
        <ContentManager>{children}</ContentManager>
        <FooterManager />
      </Layout>
    </Layout>
  )
}
