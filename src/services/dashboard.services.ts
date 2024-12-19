import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data } from '../types/Account.type'
import { Floor } from '../types/Floor.type'
import { Respone } from '../types/Respone.type'
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
    getTotalRevenueInvoice: build.query({
      query: () => 'DashBoard/TotalRevenueInvoice'
    }),
    getTotalInvoiceByStatus: build.query({
      query: () => 'DashBoard/TotalInvoiceByStatus'
    }),
    getRevenueInYear: build.query({
      query: (year: number) => `DashBoard/DashBoardRevenueInYear?year=${year}`
    }),
    getInvoiceInYear: build.query({
      query: (year: number) => `DashBoard/DashBoardInvoiceInYear?year=${year}`
    }),
    getTotalAccounts: build.query<Respone<number>, void>({
      query: () => 'DashBoard/TotalAccounts'
    }),
    getTotalAccountActive: build.query<Respone<number>, void>({
      query: () => 'DashBoard/TotalAccountActive'
    }),
    getTotalCustomer: build.query<Respone<number>, void>({
      query: () => 'DashBoard/TotalCustomers'
    }),
    getFloorFee: build.query<Respone<Floor[]>, void>({
      query: () => 'FloorFeePercents/GetFloorFees'
    }),
    updateFloorFees: build.mutation<Respone<void>, Partial<Floor>>({
      query: (floorFee) => ({
        url: 'FloorFeePercents/UpdateFloorFees',
        method: 'PUT',
        body: {
          id: floorFee.id,
          from: floorFee.from,
          to: floorFee.to,
          percent: floorFee.percent
        }
      })
    })
  })
})

export const {
  useGetTotalInvoiceQuery,
  useGetTotalRevenueQuery,
  useGetTotalInvoiceByStatusQuery,
  useGetTotalRevenueInvoiceQuery,
  useGetRevenueInYearQuery,
  useGetInvoiceInYearQuery,
  useGetTotalAccountsQuery,
  useGetTotalAccountActiveQuery,
  useGetFloorFeeQuery,
  useUpdateFloorFeesMutation,
  useGetTotalCustomerQuery
} = dashboardApi
