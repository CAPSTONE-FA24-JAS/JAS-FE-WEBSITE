import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, MenuProps, Spin } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser, RoleType } from '../../../slice/authLoginAPISlice'
import { RootState } from '../../../store'
import NotificationAdmin from './NotificationAdmin'

export default function HeaderAdmin({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem('userLogin')
    dispatch(logoutUser())
    navigate('/')
  }

  // Retrieve user data with null checks
  const user = useSelector((state: RootState) => state.authLoginAPI)
  const storedUser = JSON.parse(localStorage.getItem('userLogin') || '{}')
  const staffId = user?.id || storedUser?.id
  const roleId = user?.roleId
  const firstName = user?.account?.user?.staffDTO?.firstName || ''
  const lastName = user?.account?.user?.staffDTO?.lastName || ''

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
      className={`fixed z-50 flex justify-end px-5 bg-white border-b border-gray-200`}
      style={{
        width: collapsed ? '100%' : 'calc(100% - 256px)'
      }}
    >
      <div className='flex items-center justify-end gap-3'>
        {roleId === RoleType.ADMIN && <span className='font-bold'>Admin</span>}
        {roleId === RoleType.MANAGER && <span className='font-bold'>Manager</span>}
        {roleId === RoleType.STAFFC && <span className='font-bold'>Staff</span>}
        {roleId === RoleType.APPRAISER && <span className='font-bold'>Appraiser</span>}
        {roleId === RoleType.CUSTOMER && <span className='font-bold'>Customer</span>}
        {roleId === RoleType.GUEST && <span className='font-bold'>Guest</span>}
        {isLoading ? <Spin className='mr-4' /> : <NotificationAdmin accountId={staffId} />}
        <Dropdown menu={{ items }} placement='bottomRight' trigger={['click']} arrow>
          <Avatar className='cursor-pointer' size='large' icon={<UserOutlined />} />
        </Dropdown>
        {(firstName || lastName) && (
          <span>
            {firstName} {lastName}
          </span>
        )}
      </div>
    </Header>
  )
}
