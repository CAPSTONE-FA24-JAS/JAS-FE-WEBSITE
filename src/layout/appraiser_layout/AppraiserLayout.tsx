import { Layout } from 'antd'
import SiderAppraiser from './SiderAppraiser/SiderAppraiser'
import HeaderAppraiser from './HeaderAppraiser/HeaderAppraiser'
import ContentAppraiser from './ContentAppraiser/ContentAppraiser'
import FooterAppraiser from './FooterAppraiser/FooterAppraiser'
export default function AppraiserLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout className='min-h-screen'>
      <SiderAppraiser />
      <Layout className='bg-white '>
        <HeaderAppraiser />
        <ContentAppraiser>{children}</ContentAppraiser>
        <FooterAppraiser />
      </Layout>
    </Layout>
  )
}
