import { MenuProps, Dropdown, Badge } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import {
  useGetNotificationsByAccountQuery,
  useMarkNotificationAsReadByAccountMutation
} from '../../../services/notification.services'
import { useNavigate } from 'react-router-dom'

const NotificationMenu = ({ accountId }: { accountId: number }) => {
  const navigate = useNavigate()
  const { data } = useGetNotificationsByAccountQuery(accountId)
  const notifications = data?.data?.dataResponse || []

  const [markNotificationAsRead] = useMarkNotificationAsReadByAccountMutation()

  const handleMarkAsRead = async (notificationId: number, notifiType: string | null) => {
    try {
      await markNotificationAsRead(notificationId)
      console.log('Notification marked as read:', notificationId)

      if (notifiType === 'Valuation') {
        navigate('/staff/valuationList?tab=2')
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const notificationItems: MenuProps['items'] = notifications.map((noti: any) => ({
    key: String(noti.id),
    label: (
      <div
        style={{
          fontWeight: noti.is_Read ? 'bold' : 'bold',
          backgroundColor: noti.is_Read ? '#A3D8F4' : 'transparent', // pastel blue background when read
          padding: '8px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => handleMarkAsRead(noti.id, noti.notifi_Type)}
      >
        <div>{noti.title}</div>
        <div style={{ fontSize: '12px', color: '#888' }}>{noti.description}</div>
      </div>
    )
  }))

  return (
    <Dropdown menu={{ items: notificationItems }} placement='bottomRight' trigger={['click']}>
      <span>
        <Badge count={notifications.length} className='mr-2 mt-6'>
          <BellOutlined className='cursor-pointer' style={{ fontSize: '24px' }} />
        </Badge>
      </span>
    </Dropdown>
  )
}

export default NotificationMenu
