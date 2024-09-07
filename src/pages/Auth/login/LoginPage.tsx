import { Button, Form, Input, Checkbox, notification } from 'antd'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useUserLoginMutation } from '../../../services/auth.services'
import { useEffect } from 'react'
import { setUser } from '../../../slice/authLoginAPISlice'
import { UserLoginRequest } from '../../../types/Account.type'
import { ErrorRegisterResponse } from '../../../types/ErrorResponse.type'

export default function LoginPage() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [userLogin, { isLoading, isSuccess, isError, error, data }] = useUserLoginMutation()

  // Nếu đăng nhập thành công
  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data.data))
      console.log('data', data.data)
      localStorage.setItem('userLogin', JSON.stringify(data.data))
      notification.success({
        message: 'Đăng nhập thành công',
        description: 'Chào mừng bạn trở lại hệ thống'
      })
      setTimeout(() => {
        navigate('/')
      }, 2000) // Điều hướng sau 2 giây
    }

    // Nếu đăng nhập thất bại
    if (isError && error) {
      const err = error as ErrorRegisterResponse
      const errorMessage = err.errorMessages ? err.errorMessages : 'Tên tài khoản hoặc mật khẩu không đúng'
      notification.error({
        message: 'Đăng nhập thất bại',
        description: errorMessage
      })
    }
  }, [isSuccess, navigate, isError, error, data, dispatch])

  const handleSubmit = async (values: UserLoginRequest) => {
    try {
      await userLogin(values)
    } catch (error) {
      const err = error as ErrorRegisterResponse
      const errorMessage = err.errorMessages ? err.errorMessages : 'Tên tài khoản hoặc mật khẩu không đúng'
      notification.error({
        message: 'Đăng nhập thất bại',
        description: errorMessage
      })
    }
  }

  return (
    <div className='font-[sans-serif] min-h-screen flex flex-col items-center justify-center bg-gray-100'>
      <div className='grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md bg-white'>
        <div className='md:max-w-md w-full px-4 py-4'>
          <Form autoComplete='off' layout='vertical' form={form} onFinish={handleSubmit} className='space-y-6'>
            <div className='mb-12'>
              <h3 className='text-gray-800 text-3xl font-extrabold'>Sign in</h3>
            </div>

            <Form.Item
              label='Email'
              name='email'
              rules={[{ required: true, message: 'Email is required' }]}
              className='text-gray-800 text-xs block mb-2'
            >
              <Input
                type='text'
                placeholder='Enter email'
                size='large'
                className='w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none'
              />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[{ required: true, message: 'Password is required' }]}
              className='text-gray-800 text-xs block mb-2'
            >
              <Input.Password
                placeholder='Enter password'
                size='large'
                className='w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none'
              />
            </Form.Item>

            <div className='flex flex-wrap items-center justify-between gap-4'>
              <Form.Item name='remember' valuePropName='checked' className='flex items-center'>
                <Checkbox className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded' />
                <label className='ml-3 block text-sm text-gray-800'>Remember me</label>
              </Form.Item>

              <Link to='#' className='text-blue-600 font-semibold text-sm hover:underline'>
                Forgot Password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                size='large'
                loading={isLoading}
                className='w-full py-2.5 text-sm tracking-wide rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none shadow-xl'
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Image and social icons section */}
        <div className='hidden md:block w-full h-full'>
          <img
            src='https://hoangphucphoto.com/wp-content/uploads/2023/10/anh-ts-thumb.jpg'
            alt='banner_login'
            className='object-cover w-full h-full rounded-md'
          />
        </div>
      </div>
    </div>
  )
}
