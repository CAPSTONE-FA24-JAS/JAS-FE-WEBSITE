import { useState } from 'react'

const testimonials = [
  {
    text: 'Frankly, my experience with JAS was without compare. You have never disappointed me and I am very comfortable in recommending FORTUNA to anyone who asks. Please feel free to use my name as you see fit. You deserve the accolades!',
    name: 'John Doe'
  },
  {
    text: "I fell in love with JAS. They are so kind, genuine and savvy... We always felt safe. We did explore other options first. We had extensive conversations with Sotheby’s but found them rather mechanical and the process considerably more arduous. It was also MUCH more costly to the seller... We were concerned at the outset that we not replicate the experience that my father had with Sotheby's when he sold two extraordinary pieces with them. The experience left him confused, disappointed, and angry. Our experience with FORTUNA was the polar opposite. I was thrilled with the results and used the money for the down payment on our dream house on the water. We could not have realized this without them. I can’t even speak to the joy this has brought us.",
    name: 'Jane Smith'
  },
  {
    text: 'I first met the folks at JAS in 2011. Knowing them for the past many years, my trust with them is 110%, and they are the friendliest people in the business.',
    name: 'Alice Johnson'
  },
  {
    text: 'I consigned with FORTUNA after inquiring with two other auction houses in New York City. Both gave me a much lower appraisal value than FORTUNA and jewelry—they wanted to cherry-pick. In the end, FORTUNA got us a higher amount than the replacement value appraisal we previously obtained. I highly recommend them.',
    name: 'Bob Brown'
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className='relative p-12 mx-36'>
      <h2 className='mb-20 text-4xl text-center uppercase'>Client Testimonials</h2> {/* Increased margin-bottom */}
      <div className='flex flex-col items-center text-center mx-9'>
        <p className='mb-4 text-lg'>{testimonials[currentIndex].text}</p>
        <p className='text-sm font-bold text-black uppercase'>{testimonials[currentIndex].name}</p>
      </div>
      <button
        onClick={handlePrevious}
        className='absolute text-5xl text-gray-600 transform -translate-y-1/2 left-4 top-1/2 hover:text-black'
      >
        &larr;
      </button>
      <button
        onClick={handleNext}
        className='absolute text-5xl text-gray-600 transform -translate-y-1/2 right-4 top-1/2 hover:text-black'
      >
        &rarr;
      </button>
    </div>
  )
}
