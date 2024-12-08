import { Menu, MenuProps } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useEffect, useState } from 'react'
import { GiJewelCrown } from 'react-icons/gi'
import { HiOutlineDocument } from 'react-icons/hi'
import { MdAssessment, MdFormatListBulleted, MdOutlineMenu } from 'react-icons/md'
import { RiAuctionLine, RiBillLine, RiMoneyDollarCircleLine } from 'react-icons/ri'
import { TbZoomMoney } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'

export default function SiderManager({ onCollapse }: { onCollapse: (collapsed: boolean) => void }) {
  type MenuItem = Required<MenuProps>['items'][number]

  function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return {
      key,
      icon,
      children,
      label
    } as MenuItem
  }

  const [selectedKey, setSelectedKey] = useState<string>(() => {
    return sessionStorage.getItem('selectedKey') || ''
  })

  useEffect(() => {
    sessionStorage.setItem('selectedKey', selectedKey)
  }, [selectedKey])

  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1280)

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
      getItem('Dashboard', 'dashboard', <RiMoneyDollarCircleLine className='text-base' />),
      getItem('Transaction', 'transaction', <RiMoneyDollarCircleLine className='text-base' />),
      getItem('View request Consign', 'managerConsign', <HiOutlineDocument className='text-base' />),
      getItem('Valuation Manage', 'manageValuation', <MdAssessment className='text-base' />, [
        getItem('Valuation List', 'requestvaluation', <MdFormatListBulleted className='text-base' />)
      ]),
      getItem('Jewelry', 'jewelrys', <GiJewelCrown className='text-base' />),

      getItem('Manage Invoice', 'managewin', <RiBillLine className='text-base' />),
      getItem('Manage Withdraw', 'managewithdraw', <RiBillLine className='text-base' />),
      getItem('Auction', 'auctionlist', <RiAuctionLine className='text-base' />, [
        getItem('Auction List', 'auctionListSub', <RiAuctionLine className='text-base' />) // You can change this if needed
      ]),
      getItem('Finance Proof', 'financeProof', <TbZoomMoney className='text-base' />)
    ]
  }

  const navUrl = new Map<string, string>()
  navUrl
    .set('dashboard', '/manager/dashboard')
    .set('transaction', '/manager/transaction')
    .set('managerConsign', '/manager/ConsignList')
    .set('requestvaluation', '/manager/requestfinal')
    .set('managewin', '/manager/manageinvoice')
    .set('managewithdraw', '/manager/managewithdraw')
    .set('managecheckinvoice', '/manager/checkinvoice')
    .set('auctionListSub', '/manager/auctionlist')
    .set('financeProof', '/manager/financeProofManager')
    .set('jewelrys', '/manager/jewelrys')

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
        {/* Add image here before the div */}
        <div className='flex justify-center mb-4'>
          <img
            src='https://firebasestorage.googleapis.com/v0/b/voguary.appspot.com/o/Logo_Website%2Fsnapedit_1731943467578.png?alt=media&token=aab5b0d7-a6d1-4309-a9bc-c1fe6ecd2f01'
            alt='Logo'
            className='object-contain w-36 h-36' // Adjust size as needed
          />
        </div>
      </div>

      <Menu
        defaultSelectedKeys={['transaction']}
        defaultOpenKeys={[selectedKey]}
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
