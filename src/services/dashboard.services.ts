import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data } from '../types/Account.type'
import baseUrl from '../utils/http'

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const user = localStorage.getItem('userLogin')
      if (user) {
        const userData = JSON.parse(user) as Data
        const token = userData ? userData.accessToken : ''
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    getTotalInvoice: build.query({
      query: () => 'DashBoard/TotalInvoice'
    }),
    getTotalRevenue: build.query({
      query: () => 'DashBoard/TotalRevenue'
    }),
    getRevenueInYear: build.query({
      query: (year: number) => `DashBoard/DashBoardRevenueInYear?year=${year}`
    })
  })
})

export const {
  useGetTotalInvoiceQuery,
  useGetTotalRevenueQuery,
  useGetRevenueInYearQuery // Export the new hook for use in components
} = dashboardApi
