import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data, UserLoginRequest, UserLoginResponse } from '../types/Account.type'
import baseUrl from '../utils/http'

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
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
  endpoints: (build) => ({})
})
export const {} = dashboardApi
