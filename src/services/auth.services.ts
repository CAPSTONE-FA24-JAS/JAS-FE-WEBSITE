import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data, UserLoginRequest, UserLoginResponse } from '../types/Account.type'
import baseUrl from '../utils/http'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const user = localStorage.getItem('userLogin')
      if (user) {
        const userData = JSON.parse(user) as Data
        console.log('userData', userData)
        const token = userData ? userData.accessToken : ''
        console.log('token', token)
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    userLogin: build.mutation<UserLoginResponse, UserLoginRequest>({
      query: (body: UserLoginRequest) => ({
        url: 'Authentication/Login',
        method: 'POST',
        body
      })
    })
  })
})
export const { useUserLoginMutation } = authApi
