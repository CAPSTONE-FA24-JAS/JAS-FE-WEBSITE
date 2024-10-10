import React, { useState, ChangeEvent } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Image } from 'antd'
import { CreateNewStaffForm } from '../../../../types/Account.type'
import { useCreateNewStaffMutation } from '../../../../services/createAccountStaff.service'

interface FormData {
  firstName: string
  lastName: string
  gender: 'Female' | 'Male' | 'Other'
  dateOfBirth: string
  address: string
  phoneNumber: string
  email: string
  password: string
  roleId: string
}

const User: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: 'Female',
      dateOfBirth: '',
      address: '',
      phoneNumber: '',
      email: '',
      password: '',
      roleId: '3'
    }
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const [createNewStaff, { isLoading: loading }] = useCreateNewStaffMutation()

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const formData: CreateNewStaffForm = {
      email: data.email,
      passwordHash: data.password, // Note: In a real app, you'd hash this on the server
      phoneNumber: data.phoneNumber,
      roleId: parseInt(data.roleId),
      createStaffDTO: {
        firstName: data.firstName,
        lastName: data.lastName,
        profilePicture: selectedImage ? URL.createObjectURL(selectedImage) : '',
        gender: data.gender,
        dateOfBirth: data.dateOfBirth
      }
    }
    createNewStaff(formData)
    console.log('Form submitted:', formData)
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    }
  }

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
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>

        <div className='col-span-1 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>First Name</label>
            <input
              {...register('firstName', { required: 'First name is required' })}
              placeholder='Enter first name'
              className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.firstName && <p className='mt-1 text-xs text-red-600'>{errors.firstName.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Last Name</label>
            <input
              {...register('lastName', { required: 'Last name is required' })}
              placeholder='Enter last name'
              className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.lastName && <p className='mt-1 text-xs text-red-600'>{errors.lastName.message}</p>}
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
                type='date'
                {...register('dateOfBirth', { required: 'Date of Birth is required' })}
                className='block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
            {errors.dateOfBirth && <p className='mt-1 text-xs text-red-600'>{errors.dateOfBirth.message}</p>}
          </div>
        </div>

        <div className='grid grid-cols-2 col-span-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Address</label>
            <input
              {...register('address', { required: 'Address is required' })}
              placeholder='Enter full address'
              className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.address && <p className='mt-1 text-xs text-red-600'>{errors.address.message}</p>}
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
              placeholder='Enter phone number'
              className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.phoneNumber && <p className='mt-1 text-xs text-red-600'>{errors.phoneNumber.message}</p>}
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
              placeholder='Enter email'
              className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
            {errors.email && <p className='mt-1 text-xs text-red-600'>{errors.email.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Password</label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                placeholder='Enter password'
                className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className='mt-1 text-xs text-red-600'>{errors.password.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Role</label>
            <select
              {...register('roleId')}
              className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='3'>Staff</option>
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
            disabled={loading}
            type='submit'
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Create
          </button>
        </div>
      </form>
    </div>
  )
}

export default User
