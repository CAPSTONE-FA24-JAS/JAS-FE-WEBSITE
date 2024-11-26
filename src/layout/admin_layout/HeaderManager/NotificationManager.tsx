import { MenuProps, Dropdown, Badge } from 'antd'
import { BellOutlined, CheckCircleOutlined } from '@ant-design/icons'
import {
  useGetNotificationsByAccountQuery,
  useMarkNotificationAsReadByAccountMutation
} from '../../../services/notification.services'
import { useNavigate } from 'react-router-dom'

const NotificationManager = ({ accountId }: { accountId: number }) => {
  const navigate = useNavigate()
  const { data, refetch } = useGetNotificationsByAccountQuery(accountId)
  const notifications = data?.data?.dataResponse || []

  const unreadCount = notifications.filter((noti: any) => !noti.is_Read).length

  const [markNotificationAsRead] = useMarkNotificationAsReadByAccountMutation()

  const handleMarkAsRead = async (notificationId: number, notifiType: string | null, notifiableId: number | null) => {
    try {
      await markNotificationAsRead(notificationId)
      refetch()

      if (notifiType === 'FinalValuation' && notifiableId !== null) {
        navigate(`/manager/requestfinal?modal=true&recordId=${notifiableId}`)
      } else if (notifiType === 'PendingPayment' && notifiableId !== null) {
        navigate(`/manager/manageinvoice?recordId=${notifiableId}`)
      } else if (notifiType === 'Requested' && notifiableId !== null) {
        navigate(`/manager/ConsignList?modal=true&recordId=${notifiableId}`)
      } else if (notifiType === 'Finished' && notifiableId !== null) {
        navigate(`/manager/manageinvoice?recordId=${notifiableId}&tab=7`)
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
                width: '552px',
                height: '100px',
                borderRadius: '4px',
                position: 'relative',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden'
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

              {/* Image and Content */}
              <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                {noti.imageLink && (
                  <img
                    src={noti.imageLink}
                    alt='Notification'
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '4px',
                      marginRight: '10px'
                    }}
                  />
                )}
                <div style={{ overflow: 'hidden' }}>
                  <div
                    style={{
                      display: 'flex', // Align the elements in a row
                      alignItems: 'center', // Vertically align the elements

                      marginBottom: '2px' // Space below the container
                    }}
                  >
                    {/* Notification Type - Align left */}
                    <div
                      style={{
                        fontWeight: 'bold',
                        backgroundColor: '#fcf39a',
                        color: '#FF8C00',
                        padding: '1px 7px',
                        borderRadius: '4px',
                        marginRight: '5px',
                        textTransform: 'uppercase',
                        flexShrink: 0 // Prevent shrinking
                      }}
                    >
                      {noti.notifi_Type}
                    </div>

                    {/* Date - Align right */}
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#888',
                        flexShrink: 0 // Prevent shrinking
                      }}
                    >
                      {new Date(noti.creationDate).toLocaleString('vi-VN')}
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>{noti.title}</div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#888',
                      display: 'block',
                      whiteSpace: 'normal' // Allow text to wrap
                    }}
                  >
                    {noti.description}
                  </div>
                </div>
              </div>

              {/* Date next to Type */}
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
    <Dropdown
      menu={{
        items: notificationItems,
        style: {
          maxHeight: '400px',
          width: '600px',
          overflowY: 'auto'
        }
      }}
      placement='bottomRight'
      trigger={['click']}
    >
      <span>
        <Badge count={unreadCount} className='mr-2 mt-6'>
          <BellOutlined className='cursor-pointer' style={{ fontSize: '24px' }} />
        </Badge>
      </span>
    </Dropdown>
  )
}

export default NotificationManager
