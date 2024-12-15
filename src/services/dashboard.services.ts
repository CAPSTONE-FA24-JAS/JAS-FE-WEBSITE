import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data } from '../types/Account.type'
import baseUrl from '../utils/http'
import { Respone } from '../types/Respone.type'
import { Floor } from '../types/Floor.type'

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
  useGetRevenueInYearQuery,
  useGetInvoiceInYearQuery,
  useGetTotalAccountsQuery,
  useGetTotalAccountActiveQuery,
  useGetFloorFeeQuery,
  useUpdateFloorFeesMutation
} = dashboardApi
