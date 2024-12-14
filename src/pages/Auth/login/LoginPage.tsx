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

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data.data))
      localStorage.setItem('userLogin', JSON.stringify(data.data))
      notification.success({
        message: 'Login Success',
        description: 'Welcome back to the system'
      })
    }

    if (isError && error) {
      const err = error as ErrorRegisterResponse
      const errorMessage = err.errorMessages ? err.errorMessages : 'Username or password is incorrect'
      notification.error({
        message: 'Login Failed',
        description: errorMessage
      })
    }
  }, [isSuccess, navigate, isError, error, data, dispatch])

  const handleSubmit = async (values: UserLoginRequest) => {
    try {
      await userLogin(values)
    } catch (error) {
      const err = error as ErrorRegisterResponse
      const errorMessage = err.errorMessages ? err.errorMessages : 'Username or password is incorrect'
      notification.error({
        message: 'Login Failed',
        description: errorMessage
      })
    }
  }

  return (
    <div className='font-[sans-serif] min-h-screen flex flex-col items-center justify-center bg-gray-100'>
      <div className='grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md bg-white'>
        <div className='w-full px-4 py-4 md:max-w-md'>
          <Form autoComplete='off' layout='vertical' form={form} onFinish={handleSubmit} className='space-y-6'>
            <div className='mb-12'>
              <h3 className='text-3xl font-extrabold text-gray-800'>Sign in</h3>
            </div>

            <Form.Item
              label='Email'
              name='email'
              rules={[{ required: true, message: 'Email is required' }]}
              className='block mb-2 text-xs text-gray-800'
            >
              <Input
                type='text'
                placeholder='Enter email'
                size='large'
                className='w-full px-2 py-3 text-sm text-gray-800 border-b border-gray-300 outline-none focus:border-blue-600'
              />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[{ required: true, message: 'Password is required' }]}
              className='block mb-2 text-xs text-gray-800'
            >
              <Input.Password
                placeholder='Enter password'
                size='large'
                className='w-full px-2 py-3 text-sm text-gray-800 border-b border-gray-300 outline-none focus:border-blue-600'
              />
            </Form.Item>

            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div className='flex items-center'>
                <Form.Item name='remember' valuePropName='checked' noStyle>
                  <Checkbox className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500' />
                </Form.Item>
                <label className='block ml-3 text-sm text-gray-800'>Remember me</label>
              </div>

              <Link to='#' className='text-sm font-semibold text-blue-600 hover:underline'>
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
        <div className='hidden w-full h-full md:block'>
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
