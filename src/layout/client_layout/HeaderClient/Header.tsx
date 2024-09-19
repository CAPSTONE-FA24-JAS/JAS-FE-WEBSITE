import { Menu } from 'antd'
import { HomeOutlined, TrophyOutlined, FileTextOutlined, InfoCircleOutlined, LoginOutlined } from '@ant-design/icons'
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
      icon: <TrophyOutlined />,
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
    <header className='p-6 bg-white shadow-md'>
      <div className='flex items-center h-12 mx-28'>
        {/* Logo on the top left with two lines */}
        <div className='flex flex-col items-center justify-center text-[#000000] text-2xl font-bold uppercase'>
          <span>JAS</span>
          <span className='text-base font-normal'>Auctions</span>
        </div>

        <Menu theme='light' mode='horizontal' className='ml-auto uppercase bg-transparent' items={menuItems} />
      </div>
    </header>
  )
}
