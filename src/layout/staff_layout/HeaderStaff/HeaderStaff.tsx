import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, MenuProps, Spin, Typography } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser, RoleType } from '../../../slice/authLoginAPISlice'
import { RootState } from '../../../store'
import NotificationMenu from './NotificationMenu'

const { Text } = Typography

// Helper function to get role label
const getRoleLabel = (roleId: RoleType | undefined): string => {
  switch (roleId) {
    case RoleType.ADMIN:
      return 'Admin'
    case RoleType.MANAGER:
      return 'Manager'
    case RoleType.STAFFC:
      return 'Staff'
    case RoleType.APPRAISER:
      return 'Appraiser'
    case RoleType.CUSTOMER:
      return 'Customer'
    case RoleType.GUEST:
      return 'Guest'
    default:
      return ''
  }
}

export default function HeaderStaff({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  // Get user data from Redux
  const user = useSelector((state: RootState) => state.authLoginAPI)

  // Get stored user data with fallback
  const storedUser = JSON.parse(localStorage.getItem('userLogin') || '{}')
  const staffId = user?.id || storedUser?.id

  // Get user details with null checking
  const firstName = user?.account?.user?.staffDTO?.firstName || ''
  const lastName = user?.account?.user?.staffDTO?.lastName || ''
  const roleId = user?.roleId
  const roleLabel = getRoleLabel(roleId)

  const handleLogout = () => {
    localStorage.removeItem('userLogin')
    dispatch(logoutUser())
    navigate('/')
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const items: MenuProps['items'] = [
    {
      key: '1',
      icon: <LogoutOutlined />,
      label: <span onClick={handleLogout}>Log out</span>
    }
  ]

  return (
    <Header
      className='fixed z-50 flex justify-end bg-white border-b border-gray-200 shadow-sm'
      style={{
        width: collapsed ? '100%' : 'calc(100% - 256px)',
        padding: '0 24px'
      }}
    >
      <div className='flex items-center justify-end gap-4'>
        {/* Role Badge */}
        {roleLabel && <div className='px-3 py-1 text-sm font-bold text-black rounded-full'>{roleLabel}</div>}

        {/* Loading State and Notification */}
        {isLoading ? (
          <Spin size='small' />
        ) : (
          <div className='flex items-center'>
            <NotificationMenu accountId={staffId} />
          </div>
        )}

        {/* User Profile Section */}
        <div className='flex items-center gap-3'>
          <Dropdown menu={{ items }} placement='bottomRight' trigger={['click']} arrow>
            <div className='flex items-center gap-3 cursor-pointer group'>
              <Avatar
                size={40}
                icon={<UserOutlined />}
                className='transition-all border-2 border-transparent group-hover:border-blue-500'
              />
              {(firstName || lastName) && (
                <div className='hidden md:block'>
                  <Text className='font-medium'>
                    {firstName} {lastName}
                  </Text>
                </div>
              )}
            </div>
          </Dropdown>
        </div>
      </div>
    </Header>
  )
}
