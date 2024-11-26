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
      <h2 className='mb-20 text-4xl text-center uppercase'>Recent Posts</h2>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        {recentPosts.map((post, index) => (
          <div key={index} className='flex flex-col items-center '>
            <img src={post.imageUrl} alt={post.title} className='object-cover h-48 mb-4 w-72' />
            <div className='flex flex-col items-center w-full px-4'>
              <h3 className='mb-4 text-lg text-center'>{post.title}</h3>
              <button className='px-4 py-2 text-black uppercase bg-white border border-black rounded-lg hover:bg-black hover:text-white'>
                {post.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
