// src/components/NotificationMenu.tsx

import { MenuProps, Dropdown, Badge } from 'antd'
import { BellOutlined } from '@ant-design/icons'

const NotificationMenu = () => {
  const notificationItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Thông báo 1'
    },
    {
      key: '2',
      label: 'Thông báo 2'
    }
  ]

  return (
    <Dropdown menu={{ items: notificationItems }} placement='bottomRight' trigger={['click']}>
      <Badge count={2} className='mr-4'>
        <BellOutlined className='cursor-pointer' style={{ fontSize: '24px' }} />
      </Badge>
    </Dropdown>
  )
}

export default NotificationMenu
