import { MenuProps, Dropdown, Badge } from 'antd'
import { BellOutlined, CheckCircleOutlined } from '@ant-design/icons'
import {
  useGetNotificationsByAccountQuery,
  useMarkNotificationAsReadByAccountMutation
} from '../../../services/notification.services'
import { useNavigate } from 'react-router-dom'

const NotificationAdmin = ({ accountId }: { accountId: number }) => {
  const navigate = useNavigate()
  const { data, refetch } = useGetNotificationsByAccountQuery(accountId)
  const notifications = data?.data?.dataResponse || []

  const unreadCount = notifications.filter((noti: any) => !noti.is_Read).length

  const [markNotificationAsRead] = useMarkNotificationAsReadByAccountMutation()

  const handleMarkAsRead = async (notificationId: number, notifiType: string | null, notifiableId: number | null) => {
    try {
      await markNotificationAsRead(notificationId)
      refetch()

      if (notifiType === 'Valuation' && notifiableId !== null) {
        navigate(`/staff/valuationList?tab=2&modal=true&recordId=${notifiableId}`)
      } else if (notifiType === 'Assign' && notifiableId !== null) {
        navigate(`/staff/ConsignList?modal=true&recordId=${notifiableId}`)
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const notificationItems: MenuProps['items'] =
    notifications.length > 0
      ? notifications.map((noti: any) => ({
          key: String(noti.id),
          label: (
            <div
              style={{
                backgroundColor: noti.is_Read ? '#ffffff' : '#A3D8F4',
                padding: '8px',
                borderRadius: '4px',
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={() => handleMarkAsRead(noti.id, noti.notifi_Type, noti.notifiableId)}
            >
              <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                {noti.is_Read ? (
                  <CheckCircleOutlined style={{ color: 'green', fontSize: '14px' }} />
                ) : (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'red',
                      borderRadius: '50%'
                    }}
                  ></span>
                )}
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                  backgroundColor: '#fcf39a',
                  color: '#FF8C00',
                  padding: '1px 7px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  textTransform: 'uppercase',
                  marginBottom: '2px'
                }}
              >
                {noti.notifi_Type}
              </div>
              <div style={{ fontWeight: 'bold' }}>{noti.title}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{noti.description}</div>
            </div>
          )
        }))
      : [
          {
            key: 'no-notifications',
            label: (
              <div
                style={{
                  padding: '12px',
                  textAlign: 'center',
                  color: '#888',
                  fontStyle: 'italic'
                }}
              >
                You have no notifications
              </div>
            )
          }
        ]

  return (
    <Dropdown menu={{ items: notificationItems }} placement='bottomRight' trigger={['click']}>
      <span>
        <Badge count={unreadCount} className='mr-2 mt-6'>
          <BellOutlined className='cursor-pointer' style={{ fontSize: '24px' }} />
        </Badge>
      </span>
    </Dropdown>
  )
}

export default NotificationAdmin
