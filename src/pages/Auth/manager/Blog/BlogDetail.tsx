import { useParams } from 'react-router-dom'
import { useViewBlogDetailQuery } from '../../../../services/manageother.services'
import { Carousel } from 'antd'

const BlogDetail = () => {
  const { id } = useParams()
  const blogId = id ? parseInt(id, 10) : null

  const { data, error, isLoading } = useViewBlogDetailQuery(blogId)

  if (isLoading) return <div className='text-center py-8'>Loading...</div>
  if (error || !data) return <div className='text-center py-8 text-red-500'>Error loading blog details</div>

  if (!data?.isSuccess || !data?.data) return <div className='text-center py-8 text-yellow-500'>No data available</div>

  const { title, content, imageBlogDTOs } = data.data

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Column 1 (Carousel Section - 1/3) */}
        <div className='col-span-1'>
          {imageBlogDTOs?.length > 0 ? (
            <Carousel autoplay dots className='rounded-lg shadow-md'>
              {imageBlogDTOs.map((image: any, index: number) => (
                <div key={index} className='overflow-hidden'>
                  <img
                    className='w-full h-64 object-cover object-center'
                    src={image.imageLink}
                    alt={`Blog Image ${index + 1}`}
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <p className='text-center text-gray-500'>No images available</p>
          )}
        </div>

        <div className='col-span-2'>
          <h1 className='text-3xl font-semibold text-gray-800 my-4'>{title}</h1>
          <p className='text-lg text-gray-600 mb-6'>{content}</p>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail
