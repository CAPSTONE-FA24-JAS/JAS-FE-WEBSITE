import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import baseUrl from '../utils/http'
import { Data } from '../types/Account.type'

export const notiApi = createApi({
  reducerPath: 'notiApi',
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
    getNotificationsByAccount: build.query({
      query: (accountId: number) => `/Notifications/getNotificationsByAccount?accountId=${accountId}`
    })
  })
})

export const { useGetNotificationsByAccountQuery } = notiApi
