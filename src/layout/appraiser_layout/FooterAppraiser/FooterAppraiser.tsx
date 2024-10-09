import { Footer } from 'antd/es/layout/layout'

export default function FooterAppraiser() {
  return (
    <Footer className='border-t-[1px] border-gray-200 bg-white text-center'>
      ©{new Date().getFullYear()} Created by JAS Auctions
    </Footer>
  )
}
