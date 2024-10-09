import { Layout } from 'antd'
import ContentAdmin from './ContentAdmin/ContentAdmin'
import FooterAdmin from './FooterAdmin/FooterAdmin'
import HeaderAdmin from './HeaderAdmin/HeaderAdmin'
import SiderAdmin from './SiderAdmin/SiderAdmin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout className='min-h-screen'>
      <SiderAdmin />
      <Layout className='bg-white '>
        <HeaderAdmin />
        <ContentAdmin>{children}</ContentAdmin>
        <FooterAdmin />
      </Layout>
    </Layout>
  )
}
