import { Menu, MenuProps } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useEffect, useState } from 'react'
import { AiOutlineStar, AiOutlineTable } from 'react-icons/ai'
import { MdOutlineInventory2, MdOutlineMenu } from 'react-icons/md'
import { RiAuctionLine, RiBillLine } from 'react-icons/ri'
import { GiJewelCrown } from 'react-icons/gi' // Added for jewelry icon
import { TbZoomMoney } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

export default function SiderStaff({ onCollapse }: { onCollapse: (collapsed: boolean) => void }) {
  type MenuItem = Required<MenuProps>['items'][number]

  function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return {
      key,
      icon,
      children,
      label
    } as MenuItem
  }

  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1280)
  const [selectedKey, setSelectedKey] = useState<string>(() => {
    return sessionStorage.getItem('selectedKey') || ''
  })

  useEffect(() => {
    sessionStorage.setItem('selectedKey', selectedKey)
  }, [selectedKey])

  useEffect(() => {
    const handleResize = () => {
      const isCollapsed = window.innerWidth < 1280
      setCollapsed(isCollapsed)
      onCollapse(isCollapsed)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [onCollapse])

  const getConditionalItems = (): MenuItem[] => {
    return [
      getItem('Request Preliminary', 'consign', <MdOutlineInventory2 className='text-base' />),
      getItem('Valuation Manage', 'manageValuation', <AiOutlineStar className='text-base' />, [
        getItem('Valuation List', 'valuation', <AiOutlineTable className='text-base' />)
      ]),
      getItem('Jewelry', 'jewelrys', <GiJewelCrown className='text-base' />),
      getItem('Manage Withdraw', 'managewithdraw', <RiBillLine className='text-base' />),
      getItem('Finance Proof', 'financeProof', <TbZoomMoney className='text-base' />),
      getItem('Auction', 'auctionlist', <RiAuctionLine className='text-base' />, [
        getItem('Auction List', 'auctionlistSub', <AiOutlineTable className='text-base' />)
      ])
    ]
  }

  const navUrl = new Map<string, string>()
  navUrl
    .set('consign', '/staff/ConsignList')
    .set('valuation', '/staff/valuationList')
    .set('jewelrys', '/staff/jewelrys') // Added new route for jewelry list
    .set('financeProof', '/staff/financeproof')
    .set('auctionlistSub', '/staff/auctionlist')
    .set('livebidding', '/staff/livebidding')
    .set('managewithdraw', '/staff/managewithdraw')

  return (
    <Sider
      theme='light'
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className='fixed overflow-hidden border-r-[1px]'
      trigger={
        <div className='w-full border-r-[1px] border-t-[1px] flex items-center justify-center text-2xl pt-2'>
          <MdOutlineMenu />
        </div>
      }
      width={256}
    >
      <div className='border-r-[1px] border-gray-200'>
        <div className='flex justify-center mb-4'>
          <img
            src='https://firebasestorage.googleapis.com/v0/b/voguary.appspot.com/o/Logo_Website%2Fsnapedit_1731943467578.png?alt=media&token=aab5b0d7-a6d1-4309-a9bc-c1fe6ecd2f01'
            alt='Logo'
            className='object-contain w-36 h-36' // Adjust size as needed
          />
        </div>
      </div>

      <Menu
        defaultSelectedKeys={['mymission']}
        defaultOpenKeys={[]}
        selectedKeys={[selectedKey]}
        mode='inline'
        items={getConditionalItems()}
        onSelect={(e) => {
          const link = navUrl.get(e.key)
          if (link) {
            navigate(link)
            setSelectedKey(e.key)
          }
        }}
        className='text-base'
      />
    </Sider>
  )
}
