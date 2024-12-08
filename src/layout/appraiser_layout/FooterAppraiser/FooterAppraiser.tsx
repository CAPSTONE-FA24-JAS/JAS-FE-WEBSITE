import { Footer } from 'antd/es/layout/layout'

export default function FooterAppraiser() {
  return (
    <Footer className='border-t-[1px] h-[50px] border-gray-200 bg-white text-center flex items-center justify-center'>
      ©{new Date().getFullYear()} Created by JAS Auctions
    </Footer>
  )
}
