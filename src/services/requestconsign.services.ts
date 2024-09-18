import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data } from '../types/Account.type'
import { AssignStaffRequest, AssignStaffResponse } from '../types/Consign.type'
import baseUrl from '../utils/http'

// Tạo API với Redux Toolkit
export const consignApi = createApi({
  reducerPath: 'consignApi',
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
    getValuations: build.query({
      query: ({ pageSize = 10, pageIndex = 1 }) =>
        `/Valuations/getValuations?pageSize=${pageSize}&pageIndex=${pageIndex}`
    }),

    getPreliminaryValuationsByStaff: build.query({
      query: ({ staffId, pageSize = 10, pageIndex = 1 }) =>
        `/Valuations/getPreliminaryValuationsByStatusOfStaff?staffId=${staffId}&pageSize=${pageSize}&pageIndex=${pageIndex}`
    }),

    // Gán nhân viên cho một Valuation cụ thể
    assignStaffForValuation: build.mutation<AssignStaffResponse, AssignStaffRequest>({
      query: ({ id, staffId }) => ({
        url: `/Valuations/AssignStaffForValuation?id=${id}&staffId=${staffId}`,
        method: 'PUT'
      })
    }),

    // Cập nhật trạng thái cho Valuation
    updateValuationStatus: build.mutation<any, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/Valuations/UpdateStatusForValuations?id=${id}&status=${encodeURIComponent(status)}`,
        method: 'PUT'
      })
    })
  })
})

// Export hooks cho các query và mutation
export const {
  useGetValuationsQuery,
  useGetPreliminaryValuationsByStaffQuery,
  useAssignStaffForValuationMutation,
  useUpdateValuationStatusMutation // Hook cho cập nhật trạng thái
} = consignApi
