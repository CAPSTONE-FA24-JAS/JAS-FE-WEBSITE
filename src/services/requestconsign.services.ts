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
        const token = userData.accessToken || ''
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    getValuations: build.query({
      query: ({ pageSize, pageIndex }) => `/Valuations/getValuations?pageSize=${pageSize}&pageIndex=${pageIndex}`,
      transformResponse: (response: any) => ({
        dataResponse: response.data.dataResponse,
        totalItemRepsone: response.data.totalItemRepsone
      })
    }),
    getPreliminaryValuationsByStaff: build.query({
      query: ({ staffId, status, pageSize, pageIndex }) =>
        `/Valuations/getPreliminaryValuationsByStatusOfStaff?staffId=${staffId}&pageSize=${pageSize}&pageIndex=${pageIndex}`,
      transformResponse: (response: any) => ({
        dataResponse: response.data.dataResponse,
        totalItemRepsone: response.data.totalItemRepsone
      })
    }),

    assignStaffForValuation: build.mutation<AssignStaffResponse, AssignStaffRequest>({
      query: ({ id, staffId, status }) => ({
        url: `/Valuations/AssignStaffForValuation?id=${id}&staffId=${staffId}&status=${status}`,
        method: 'PUT'
      })
    }),
    updateValuationStatus: build.mutation<any, { id: number; status: number }>({
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
  useUpdateValuationStatusMutation
} = consignApi
