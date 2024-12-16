import Highlights from '../../components/CardHomePage/Hightlights'
import LeadingPage from '../../components/CardHomePage/Leading'
import Testimonials from '../../components/CardHomePage/Testimonials'
import UpComing from './Upcoming/modal/UpComing'

export default function HomePage() {
  return (
    <div className='w-full h-full overflow-x-hidden'>
      <div className='mb-20 sticky top-0 z-10 bg-white'>
        <UpComing />
      </div>
      <hr className='my-10 border-gray-300 mx-28' /> {/* Gray line with margin */}
      <div className='mb-20'>
        <LeadingPage />
      </div>
      <hr className='my-10 border-gray-300 mx-28' /> {/* Gray line with margin */}
      <div className='mb-20'>
        <Testimonials />
      </div>
      <hr className='my-10 border-gray-300 mx-28' /> {/* Gray line with margin */}
      <div className='mb-20'>
        <Highlights />
      </div>
      {/* <hr className='my-10 border-gray-300 mx-28' /> 
      <div className='mb-20'>
        <RecentPosts />
      </div> */}
    </div>
  )
}
