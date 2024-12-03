import { Menu } from 'antd'
import { HomeOutlined, FileTextOutlined, InfoCircleOutlined, LoginOutlined } from '@ant-design/icons'
import { FaGavel } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function CustomHeader() {
  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to='/'>Home</Link>
    },
    {
      key: 'auction',
      icon: <FaGavel />,
      label: 'Auction',
      children: [
        {
          key: 'upcoming',
          label: <Link to='/upcoming-auctions'>Upcoming Auctions</Link>
        },
        {
          key: 'past',
          label: <Link to='/pastauction'>Past Auctions</Link>
        }
      ]
    },
    {
      key: 'blog',
      icon: <FileTextOutlined />,
      label: <Link to='/blog'>Blog</Link>
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined />,
      label: <Link to='/about'>About Us</Link>
    },
    {
      key: 'login',
      icon: <LoginOutlined />,
      label: <Link to='/login'>Login</Link>
    }
  ]

  return (
    <header className='fixed top-0 left-0 right-0 z-50 p-6 bg-white shadow-md'>
      <div className='flex items-center h-12 mx-28'>
        <div className='flex items-center'>
          <Link to='/'>
            <img
              src='https://firebasestorage.googleapis.com/v0/b/voguary.appspot.com/o/Logo_Website%2Fsnapedit_1731943467578.png?alt=media&token=aab5b0d7-a6d1-4309-a9bc-c1fe6ecd2f01'
              alt='Logo'
              className='w-32 h-32 object-contain cursor-pointer'
            />
          </Link>
        </div>

        {/* Menu */}
        <Menu theme='light' mode='horizontal' className='ml-auto uppercase bg-transparent' items={menuItems} />
      </div>
    </header>
  )
}
