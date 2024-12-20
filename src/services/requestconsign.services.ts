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
      query: () => `/Valuations/getValuations`,
      transformResponse: (response: any) => ({
        dataResponse: response.data.dataResponse,
        totalItemRepsone: response.data.totalItemRepsone
      })
    }),
    getPreliminaryValuationsByStaff: build.query({
      query: ({ staffId }) => `/Valuations/getPreliminaryValuationsByStatusOfStaff?staffId=${staffId}`,
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
    }),
    // Add the new endpoint here
    getValuationById: build.query({
      query: (valuationId) => `/Valuations/getValuationById?valuationId=${valuationId}`
    })
  })
})

// Export hooks cho các query và mutation
export const {
  useGetValuationsQuery,
  useGetPreliminaryValuationsByStaffQuery,
  useAssignStaffForValuationMutation,
  useUpdateValuationStatusMutation,
  useGetValuationByIdQuery // Export the new hook
} = consignApi
