// src/components/HeaderStaff.tsx

import { Avatar, Dropdown, MenuProps } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser, RoleType } from '../../../slice/authLoginAPISlice'
import { RootState } from '../../../store'
import NotificationMenu from './NotificationMenu' // Import NotificationMenu component
import { Header } from 'antd/es/layout/layout'

export default function HeaderStaff() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    localStorage.removeItem('userLogin')
    dispatch(logoutUser())
    navigate('/')
  }

  const user = useSelector((state: RootState) => state.authLoginAPI.roleId)

  const items: MenuProps['items'] = [
    {
      key: '1',
      icon: <LogoutOutlined />,
      label: <span onClick={handleLogout}>Đăng xuất</span>
    }
  ]

  return (
    <Header className='fixed z-50 flex w-full px-5 bg-white border-b border-gray-200'>
      <div className='flex items-center justify-end gap-3'>
        {/* Use the NotificationMenu component */}
        <NotificationMenu />
        <Dropdown menu={{ items }} placement='bottomRight' trigger={['click']} arrow>
          <Avatar
            className='cursor-pointer'
            size={'large'}
            icon={<UserOutlined />}
            src={
              'https://t.vietgiaitri.com/2021/4/8/tham-tu-lung-danh-conan-nhung-tay-ban-tia-thien-xa-trong-conan-ai-se-gop-mat-tai-phan-phim-moi-nhat-f81-5724169.jpeg'
            }
          />
        </Dropdown>
        {user === RoleType.ADMIN && <span className='font-bold'>Admin</span>}
        {user === RoleType.MANAGER && <span className='font-bold'>Manager</span>}
        {user === RoleType.STAFFC && <span className='font-bold'>Staff</span>}
        {user === RoleType.APPRAISER && <span className='font-bold'>Appraiser</span>}
        {user === RoleType.CUSTOMER && <span className='font-bold'>Customer</span>}
        {user === RoleType.GUEST && <span className='font-bold'>Guest</span>}
      </div>
    </Header>
  )
}
