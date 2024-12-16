import { useNavigate } from 'react-router-dom';
import { useViewBlogsQuery } from '../../../services/manageother.services';

const BlogHomepage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useViewBlogsQuery();

  if (isLoading) return <div>Loading...</div>;

  const blogPosts = data?.data || [];

  const handleNavigate = (id: number) => {
    navigate(`/blog/${id}`);
  };

  const truncateContent = (content: string, maxLength: number) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <div className='container mx-auto px-44 py-8'>
      <h1 className='text-4xl font-semibold font-serif  mb-8'> Blog</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {blogPosts.map((post) => (
          <div key={post.id} className='border rounded-lg overflow-hidden shadow-lg'>
            <img
              className='w-full h-auto object-cover'
              src={post.imageBlogDTOs?.[0]?.imageLink}
              alt={post.title}
            />
            <div className='p-7'>
              <h2 className='text-xl font-semibold'>{post.title}</h2>
              <p className='text-gray-600 mb-4'>{truncateContent(post.content, 100)}</p>
              <button 
                onClick={() => handleNavigate(post.id)}
                className='text-white bg-sky-500 hover:underline px-2 py-2 rounded'
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogHomepage;
