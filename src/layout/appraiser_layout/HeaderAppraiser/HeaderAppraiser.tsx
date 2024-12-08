import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, MenuProps, Spin } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser, RoleType } from '../../../slice/authLoginAPISlice'
import { RootState } from '../../../store'
import NotificationAppraiser from './NotificationAppraiser'
// import { RootState } from 'store';

export default function HeaderAppraiser({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(true) // Track the loading state for notifications

  const handleLogout = () => {
    localStorage.removeItem('userLogin')
    dispatch(logoutUser())
    navigate('/')
  }

  // Retrieve staffId and roleId from Redux or localStorage as a fallback
  const user = useSelector((state: RootState) => state.authLoginAPI)
  const staffId = user?.id || JSON.parse(localStorage.getItem('userLogin') || '{}').id
  const roleId = user?.roleId

  // Update loading state after the notifications are loaded
  useEffect(() => {
    setIsLoading(false) // Set loading to false once notifications have loaded
  }, [])

  const items: MenuProps['items'] = [
    {
      key: '1',
      icon: <LogoutOutlined />,
      label: <span onClick={handleLogout}>Đăng xuất</span>
    }
  ]

  return (
    <Header
      className={`fixed z-50  flex justify-end px-5 bg-white border-b border-gray-200`}
      style={{
        width: collapsed ? '100%' : 'calc(100% - 256px)'
      }}
    >
      {' '}
      <div className='flex items-center justify-end gap-3'>
        {isLoading ? <Spin className='mr-4' /> : <NotificationAppraiser accountId={staffId} />}
        <Dropdown menu={{ items }} placement='bottomRight' trigger={['click']} arrow>
          <Avatar
            className='cursor-pointer'
            size='large'
            icon={<UserOutlined />}
            src={
              'https://t.vietgiaitri.com/2021/4/8/tham-tu-lung-danh-conan-nhung-tay-ban-tia-thien-xa-trong-conan-ai-se-gop-mat-tai-phan-phim-moi-nhat-f81-5724169.jpeg'
            }
          />
        </Dropdown>
        {roleId === RoleType.ADMIN && <span className='font-bold'>Admin</span>}
        {roleId === RoleType.MANAGER && <span className='font-bold'>Manager</span>}
        {roleId === RoleType.STAFFC && <span className='font-bold'>Staff</span>}
        {roleId === RoleType.APPRAISER && <span className='font-bold'>Appraiser</span>}
        {roleId === RoleType.CUSTOMER && <span className='font-bold'>Customer</span>}
        {roleId === RoleType.GUEST && <span className='font-bold'>Guest</span>}
      </div>
    </Header>
  )
}
