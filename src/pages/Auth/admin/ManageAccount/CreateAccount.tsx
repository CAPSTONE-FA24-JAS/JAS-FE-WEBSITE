import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { SlCalender } from 'react-icons/sl'
import { Avatar, Image } from 'antd'

const User = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      gender: 'Female',
      dateOfBirth: '12/09/2024',
      addressLine: '',
      district: '',
      city: '',
      phoneNumber: '',
      email: '',
      role: 'Staff'
    }
  })

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data)
  }

  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  return (
    <div className='w-full p-8 mx-auto bg-gray-100 rounded-lg'>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-2 gap-6'>
        <div className='flex flex-col items-center col-span-1'>
          <Image
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
            }
            alt='Profile'
            className='object-cover mb-4 rounded-lg h-60 w-60'
          />
          <button
            type='button'
            className='p-2 text-sm font-bold text-gray-600 rounded-lg hover:text-blue-600 bg-slate-400'
            onClick={() => document.getElementById('img')?.click()}
          >
            Upload Image
          </button>
          <input
            type='file'
            id='img'
            name='img'
            accept='image/*'
            style={{ display: 'none' }} // Hide the input element
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedImage(e.target.files[0])
              }
            }}
          />
        </div>

        <div className='col-span-1 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              placeholder='Enter here...'
              className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.name && <p className='mt-1 text-xs text-red-600'>{errors.name.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Gender</label>
            <select
              {...register('gender')}
              className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='Female'>Female</option>
              <option value='Male'>Male</option>
              <option value='Other'>Other</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Date of Birth</label>
            <div className='relative mt-1 rounded-md shadow-sm'>
              <input
                {...register('dateOfBirth', { required: 'Date of Birth is required' })}
                className='block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              />
              <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <SlCalender className='w-5 h-5 text-gray-400' />
              </div>
            </div>
            {errors.dateOfBirth && <p className='mt-1 text-xs text-red-600'>{errors.dateOfBirth.message}</p>}
          </div>
        </div>

        <div className='grid grid-cols-2 col-span-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Address Line</label>
            <input
              {...register('addressLine', { required: 'Address is required' })}
              placeholder='Enter here...'
              className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.addressLine && <p className='mt-1 text-xs text-red-600'>{errors.addressLine.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Phone Number</label>
            <input
              {...register('phoneNumber', {
                required: 'Phone number is required',
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Please enter a valid 10-digit phone number'
                }
              })}
              placeholder='Enter here...'
              className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.phoneNumber && <p className='mt-1 text-xs text-red-600'>{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>District</label>
            <input
              {...register('district', { required: 'District is required' })}
              placeholder='Enter here...'
              className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.district && <p className='mt-1 text-xs text-red-600'>{errors.district.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Email</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              placeholder='Enter here...'
              className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.email && <p className='mt-1 text-xs text-red-600'>{errors.email.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>City</label>
            <input
              {...register('city', { required: 'City is required' })}
              placeholder='Enter here...'
              className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.city && <p className='mt-1 text-xs text-red-600'>{errors.city.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Role</label>
            <select
              {...register('role')}
              className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='Staff'>Staff</option>
              <option value='Manager'>Manager</option>
              <option value='Admin'>Admin</option>
            </select>
          </div>
        </div>

        <div className='flex justify-end col-span-2 mt-6 space-x-4'>
          <button
            type='button'
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default User
