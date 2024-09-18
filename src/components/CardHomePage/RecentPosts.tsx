import React from 'react'

const recentPosts = [
  {
    imageUrl:
      'https://lavenderstudio.com.vn/wp-content/uploads/2019/07/sap-xep-bo-cuc-chup-anh-trang-suc-dep-2-1024x682.png',
    title: 'How to Buy Tiffany Jewelry: A Comprehensive Guide',
    buttonText: 'Read More'
  },
  {
    imageUrl:
      'https://lavenderstudio.com.vn/wp-content/uploads/2019/07/sap-xep-bo-cuc-chup-anh-trang-suc-dep-2-1024x682.png',
    title: 'The Enduring Influence of Jean Schlumberger: A Pioneer in Luxury Jewelry Design',
    buttonText: 'Read More'
  },
  {
    imageUrl:
      'https://lavenderstudio.com.vn/wp-content/uploads/2019/07/sap-xep-bo-cuc-chup-anh-trang-suc-dep-2-1024x682.png',
    title: 'REMEMBERING VISIONARY DESIGNER ELSA PERETTI',
    buttonText: 'Read More'
  }

  // Add more posts as needed
]

export default function RecentPosts() {
  return (
    <div className='mx-56'>
      <h2 className='text-4xl text-center mb-20 uppercase'>Recent Posts</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {recentPosts.map((post, index) => (
          <div key={index} className='flex flex-col items-center '>
            <img src={post.imageUrl} alt={post.title} className='w-72 h-48 object-cover mb-4' />
            <div className='w-full px-4 flex flex-col items-center'>
              <h3 className='text-lg text-center mb-4'>{post.title}</h3>
              <button className='bg-white text-black border border-black py-2 px-4 rounded-lg hover:bg-black hover:text-white uppercase'>
                {post.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
