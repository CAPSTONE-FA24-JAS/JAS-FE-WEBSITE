import { Layout } from 'antd'
import SiderAdmin from './SiderAdmin/SiderAdmin'
import HeaderAdmin from './HeaderAdmin/HeaderAdmin'
import ContentAdmin from './ContentAdmin/ContentAdmin'
import FooterAdmin from './FooterAdmin/FooterAdmin'

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout className='min-h-screen'>
      <SiderAdmin />
      <Layout className='bg-white'>
        <HeaderAdmin />
        <ContentAdmin>{children}</ContentAdmin>
        <FooterAdmin />
      </Layout>
    </Layout>
  )
}
