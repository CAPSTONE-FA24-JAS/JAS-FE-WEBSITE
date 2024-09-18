import React from 'react'
import { Carousel } from 'antd'
const imageUrls1 =
  'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a8d441ac-8f0d-417f-b3df-f02b314f4873/deq2o4l-5a3c406f-b4aa-4dab-8fb9-cb1641259b8b.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2E4ZDQ0MWFjLThmMGQtNDE3Zi1iM2RmLWYwMmIzMTRmNDg3M1wvZGVxMm80bC01YTNjNDA2Zi1iNGFhLTRkYWItOGZiOS1jYjE2NDEyNTliOGIuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.SQTPCC8NBWUhi_bIqEaHXM9tcAvfrbWZu8lLqbf5vtA'

export default function CustomCarousel() {
  return (
    <div className=''>
      <Carousel autoplay>
        <div>
          <img src={imageUrls1} alt='Slide 1' className='w-full h-auto  md:h-64 lg:h-72 xl:h-80' />
        </div>
        <div>
          <img src={imageUrls1} alt='Slide 2' className='w-full h-auto  md:h-64 lg:h-72 xl:h-80' />
        </div>
        <div>
          <img src={imageUrls1} alt='Slide 3' className='w-full h-auto  md:h-64 lg:h-72 xl:h-80' />
        </div>
        <div>
          <img src={imageUrls1} alt='Slide 4' className='w-full h-auto  md:h-64 lg:h-72 xl:h-80' />
        </div>
      </Carousel>
    </div>
  )
}
