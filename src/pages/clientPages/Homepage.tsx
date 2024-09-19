import Carousel from '../../components/CardHomePage/Carousel'
import Highlights from '../../components/CardHomePage/Hightlights'
import LeadingPage from '../../components/CardHomePage/Leading'
import RecentPosts from '../../components/CardHomePage/RecentPosts'
import Testimonials from '../../components/CardHomePage/Testimonials'

export default function HomePage() {
  return (
    <div className='w-full h-full overflow-x-hidden'>
      <div className='mb-20'>
        <Carousel />
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
      <hr className='my-10 border-gray-300 mx-28' /> {/* Gray line with margin */}
      <div className='mb-20'>
        <RecentPosts />
      </div>
    </div>
  )
}
