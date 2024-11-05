import { BellOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, MenuProps, Modal, Spin, Badge } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser, RoleType } from '../../../slice/authLoginAPISlice'
import { RootState } from '../../../store'
// import { RootState } from 'store';

export default function HeaderAppraiser() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    localStorage.removeItem('userLogin')

    // Đưa trạng thái user về null trong Redux
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
    <Header className='fixed z-50 flex w-full px-5 bg-white border-b border-gray-200'>
      <div className='flex items-center justify-end gap-3'>
        <Dropdown menu={{ items: notificationItems }} placement='bottomRight' trigger={['click']}>
          <Badge count={2} className='mr-4'>
            <BellOutlined className='cursor-pointer' style={{ fontSize: '24px' }} />
          </Badge>
        </Dropdown>
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
      <Modal footer={null} closable={false}>
        <div className='flex flex-col items-center justify-center'>
          <Spin size='large' />
          <span>Đang đăng xuất...</span>
        </div>
      </Modal>
    </Header>
  )
}
