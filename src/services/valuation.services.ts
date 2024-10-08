import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  CreatePreliminaryRepsonse,
  CreatePreliminaryRequest,
  CreateReceiptRequest,
  CreateReceiptResponse
} from '../types/Valuation.type'
import baseUrl from '../utils/http'

export const valuationApi = createApi({
  reducerPath: 'valuationApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const user = localStorage.getItem('userLogin')
      if (user) {
        const userData = JSON.parse(user)
        const token = userData ? userData.accessToken : ''
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    getValuationById: build.query<any, { id: number }>({
      query: ({ id }) => `Valuations/getValuationById?valuationId=${id}`
    }),
    createPreliminary: build.mutation<CreatePreliminaryRepsonse, CreatePreliminaryRequest>({
      query: ({ id, status, DesiredPrice }) => ({
        url: `Valuations/createPreliminaryPrice?id=${id}&status=${status}&DesiredPrice=${DesiredPrice}`,
        method: 'PUT'
      })
    }),
    getPreliminaryValuationsByStaff: build.query({
      query: ({ staffId, status = 'Preliminary Valued', pageSize = 10, pageIndex = 1 }) =>
        `/Valuations/getPreliminaryValuationsByStatusOfStaff?staffId=${staffId}&status=${encodeURIComponent(
          status
        )}&pageSize=${pageSize}&pageIndex=${pageIndex}`
    }),
    createReceipt: build.mutation<CreateReceiptResponse, { id: number; data: CreateReceiptRequest }>({
      query: ({ id, data }) => ({
        url: `Valuations/CreateReciept?id=${id}`,
        method: 'PUT',
        body: data
      })
    })
  })
})

export const {
  useGetValuationByIdQuery,
  useCreatePreliminaryMutation,
  useGetPreliminaryValuationsByStaffQuery,
  useCreateReceiptMutation
} = valuationApi
