import { Content } from 'antd/es/layout/layout'
import React from 'react'

export default function ContentAppraiser({ children }: { children: React.ReactNode }) {
  return (
    <Content className='bg-[#f8f8f8] px-4 py-20'>
      <main className='h-full p-8 bg-white'>{children}</main>
    </Content>
  )
}
