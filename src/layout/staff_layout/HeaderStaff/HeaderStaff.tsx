import { BellOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, MenuProps, Modal, Spin, Badge, Tooltip } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../../../slice/authLoginAPISlice'
// import { RootState } from 'store';

export default function HeaderStaff() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    localStorage.removeItem('userLogin')

    // Đưa trạng thái user về null trong Redux
    dispatch(logoutUser())
    navigate('/')
  }

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
    <Header className='fixed z-auto flex w-full border-b border-gray-200 bg-white px-5'>
      <div className='flex justify-end items-center '>
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
