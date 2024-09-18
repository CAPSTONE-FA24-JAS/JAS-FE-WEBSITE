import { Layout } from 'antd'
import React from 'react'
import HeaderStaff from './HeaderStaff/HeaderStaff'
import ContentStaff from './ContentStaff/ContentStaff'
import FooterStaff from './FooterStaff/FooterStaff'
import SiderStaff from './SiderStaff/SiderStaff'

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout className='min-h-screen'>
      <SiderStaff />
      <Layout className='bg-white'>
        <HeaderStaff />
        <ContentStaff>{children}</ContentStaff>
        <FooterStaff />
      </Layout>
    </Layout>
  )
}
