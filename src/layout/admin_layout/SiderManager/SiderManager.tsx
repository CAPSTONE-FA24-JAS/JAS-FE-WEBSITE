import React, { useEffect, useState } from 'react'
import { Menu, MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import Sider from 'antd/es/layout/Sider'
import { RiAuctionLine } from 'react-icons/ri'
import { GrView } from 'react-icons/gr'
import { MdInventory, MdOutlineCategory, MdOutlineMenu } from 'react-icons/md'
import { cn } from '../../../utils/cn'
import { BarChartOutlined } from '@ant-design/icons'
import { TbZoomMoney } from 'react-icons/tb'

export default function SiderManager() {
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
      setCollapsed(window.innerWidth < 1280)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getConditionalItems = (): MenuItem[] => {
    return [
      getItem('View request Consign', 'managerConsign', <MdInventory className='text-base' />),
      getItem('Valuation Manage', 'manageValuation', <MdOutlineCategory className='text-base' />, [
        getItem('Valuation List', 'requestvaluation', <GrView className='text-base' />)
      ]),
      getItem('Manage Invoice', 'managewin', <BarChartOutlined />),
      getItem('Auction', 'auctionlist', <RiAuctionLine className='text-base' />, [
        getItem('Auction List', 'auctionListSub', <GrView className='text-base' />)
      ]),
      getItem('Finance Proof', 'financeProof', <TbZoomMoney className='text-base' />)
    ]
  }

  const navUrl = new Map<string, string>()
  navUrl
    .set('managerConsign', '/manager/ConsignList')
    .set('requestvaluation', '/manager/requestfinal')
    .set('managewin', '/manager/manageinvoice')
    .set('auctionListSub', '/manager/auctionlist')
    .set('financeProof', '/manager/financeProofManager')

  return (
    <Sider
      theme='light'
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className='overflow-hidden border-r-[1px]'
      trigger={
        <div className='w-full border-r-[1px] border-t-[1px] flex items-center justify-center text-2xl pt-2'>
          <MdOutlineMenu />
        </div>
      }
      width={256}
    >
      <div className='border-r-[1px] border-gray-200'>
        <div
          className={cn('mx-auto text-center mb-6 mt-6 pb-6', {
            hidden: collapsed
          })}
        >
          <div className='text-2xl font-bold text-black'>JAS</div>
          <div className='text-lg font-normal text-black up'>Auctions</div>
        </div>
        <div
          className={cn('mx-auto text-center mb-4 mt-4 pb-4', {
            hidden: !collapsed
          })}
        >
          <div className='py-2 text-xl font-bold text-black'>JAS</div>
        </div>
      </div>

      <Menu
        defaultSelectedKeys={['overview']}
        defaultOpenKeys={getConditionalItems().map((item) => item?.key as string)}
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
