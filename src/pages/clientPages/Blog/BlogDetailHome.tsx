import { useParams, useNavigate } from 'react-router-dom';
import { useViewBlogDetailQuery } from '../../../services/manageother.services';
import { useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const BlogDetailHome = () => {
  const { id } = useParams();
  const { data, isLoading } = useViewBlogDetailQuery(id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;

  if (!data || !data.isSuccess) return <div>No data available</div>;

  const { title, content, imageBlogDTOs } = data.data;
  const currentImage = selectedImage || (imageBlogDTOs.length > 0 ? imageBlogDTOs[currentIndex].imageLink : '');

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % imageBlogDTOs.length;
      setSelectedImage(imageBlogDTOs[nextIndex].imageLink);
      return nextIndex;
    });
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => {
      const prevIndexUpdated = (prevIndex - 1 + imageBlogDTOs.length) % imageBlogDTOs.length;
      setSelectedImage(imageBlogDTOs[prevIndexUpdated].imageLink);
      return prevIndexUpdated;
    });
  };

  return (
    <div className='container mx-auto px-44 py-8'>
      <button 
        onClick={() => navigate(-1)}
        className='mb-4 flex items-center text-black'
      >
        <LeftOutlined className='mr-2' />
        Back
      </button>
      <h1 className='text-4xl font-bold text-center mb-8'>{title}</h1>
      <div className='flex justify-center mb-6'>
        <img
          className='w-full h-96 object-cover object-center rounded-lg shadow-lg'
          src={currentImage}
          alt={`Blog Image`}
        />
      </div>
      <div className='flex justify-between items-center mt-4'>
        <button onClick={handlePrevious} disabled={imageBlogDTOs.length <= 1} className='flex items-center'>
          <LeftOutlined />
        </button>
        <div className='flex'>
          {imageBlogDTOs.map((image: any, index: number) => (
            <img
              key={index}
              className='w-16 h-16 object-cover object-center mx-1 border border-gray-300 cursor-pointer rounded'
              src={image.imageLink}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => {
                setSelectedImage(image.imageLink);
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
        <button onClick={handleNext} disabled={imageBlogDTOs.length <= 1} className='flex items-center'>
          <RightOutlined />
        </button>
      </div>
      <div className='mt-6'>
        <p className='text-2xl text-black font-serif mb-4'>{title}</p>
      </div>
      <div className='mt-6'>
        {content.split('. ').map((sentence: string, index: number) => (
          <p key={index} className='text-lg text-gray-600 mb-6'>{sentence.trim() + (index < content.split('. ').length - 1 ? '.' : '')}</p>
        ))}
      </div>
    </div>
  );
};

export default BlogDetailHome;
