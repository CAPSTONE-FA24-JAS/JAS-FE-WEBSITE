import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  CreatePreliminaryRepsonse,
  CreatePreliminaryRequest,
  CreateReceiptRequest,
  CreateReceiptResponse,
  RequestFinalValuation
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
    // Existing endpoints
    getValuationById: build.query<any, { id: number }>({
      query: ({ id }) => `Valuations/getValuationById?valuationId=${id}`
    }),

    createPreliminary: build.mutation<CreatePreliminaryRepsonse, CreatePreliminaryRequest>({
      query: ({ id, status, estimatePriceMin, estimatePriceMax, appraiserId }) => ({
        url: `Valuations/createPreliminaryPrice?id=${id}&status=${status}&EstimatePriceMin=${estimatePriceMin}&EstimatePriceMax=${estimatePriceMax}&appraiserId=${appraiserId}`,
        method: 'PUT'
      })
    }),

    getPreliminaryValuationsByStaff: build.query({
      query: ({ staffId, pageSize, pageIndex }) => {
        const statuses = [3, 4, 5]
        const statusQuery = statuses.map((status) => `status=${status}`).join('&')
        return `/Valuations/getPreliminaryValuationsOfStaff?staffId=${staffId}&${statusQuery}&pageSize=${pageSize}&pageIndex=${pageIndex}`
      },
      transformResponse: (response: any) => ({
        dataResponse: response.data.dataResponse,
        totalItemRepsone: response.data.totalItemRepsone
      })
    }),

    getPreliminaryValuationsByAppraiser: build.query({
      query: ({ staffId, pageSize, pageIndex }) => {
        const statuses = [3, 4, 5]
        const statusQuery = statuses.map((status) => `status=${status}`).join('&')
        return `/Valuations/getPreliminaryValuationsOfAppraiser?appraiserId=${staffId}&${statusQuery}&pageSize=${pageSize}&pageIndex=${pageIndex}`
      },
      transformResponse: (response: any) => ({
        dataResponse: response.data.dataResponse,
        totalItemRepsone: response.data.totalItemRepsone
      })
    }),

    createReceipt: build.mutation<CreateReceiptResponse, { id: number; data: CreateReceiptRequest }>({
      query: ({ id, data }) => ({
        url: `Valuations/CreateReciept?id=${id}`,
        method: 'PUT',
        body: data
      })
    }),

    updatePreliminaryValuationStatus: build.mutation<void, { id: number; status: number }>({
      query: ({ id, status }) => ({
        url: `Valuations/RequestPreliminaryValuation?id=${id}&status=${status}`,
        method: 'PUT'
      })
    }),

    getRequestPreliminaryValuation: build.query<any, { pageSize: number; pageIndex: number }>({
      query: ({ pageSize, pageIndex }) =>
        `Valuations/GetRequestPreliminaryValuation?pageSize=${pageSize}&pageIndex=${pageIndex}`
    }),

    getFinalValuationsOfStaff: build.query<any, { staffId: number; pageSize: number; pageIndex: number }>({
      query: ({ staffId, pageSize, pageIndex }) =>
        `Valuations/getFinalValuationsOfStaff?staffId=${staffId}&pageSize=${pageSize}&pageIndex=${pageIndex}`,
      transformResponse: (response: any) => ({
        dataResponse: response.data.dataResponse,
        totalItemResponse: response.data.totalItemResponse
      })
    }),
    getFinalValuationsOfAppraiser: build.query<any, { appraiserId: number; pageSize: number; pageIndex: number }>({
      query: ({ appraiserId, pageSize, pageIndex }) =>
        `Valuations/getFinalValuationsOfAppraiser?appraiserId=${appraiserId}&pageSize=${pageSize}&pageIndex=${pageIndex}`,
      transformResponse: (response: any) => ({
        dataResponse: response.data.dataResponse,
        totalItemResponse: response.data.totalItemResponse
      })
    }),

    requestFinalValuationForManager: build.mutation<void, RequestFinalValuation>({
      query: (data) => ({
        url: `Jewelrys/RequestFinalValuationForManager`,
        method: 'PUT',
        body: data
      })
    }),

    getValuations: build.query<any, void>({
      query: () => `Valuations/getValuations`,
      transformResponse: (response: any) => ({
        dataResponse: response.data.dataResponse,
        totalItemResponse: response.data.totalItemResponse
      })
    }),

    updateJewelryStatusByManager: build.mutation<void, { jewelryId: number; status: number }>({
      query: ({ jewelryId, status }) => ({
        url: `Jewelrys/UpdateStatusByManager?jewelryId=${jewelryId}&status=${status}`,
        method: 'PUT'
      })
    }),
    rejectJewelryByManager: build.mutation<void, { jewelryId: number; status: number }>({
      query: ({ jewelryId, status }) => ({
        url: `Jewelrys/RejectByManager?jewelryId=${jewelryId}&status=${status}`,
        method: 'PUT'
      })
    })
  })
})

export const {
  useGetValuationByIdQuery,
  useCreatePreliminaryMutation,
  useGetPreliminaryValuationsByStaffQuery,
  useCreateReceiptMutation,
  useUpdatePreliminaryValuationStatusMutation,
  useGetRequestPreliminaryValuationQuery,
  useGetPreliminaryValuationsByAppraiserQuery,
  useGetFinalValuationsOfStaffQuery,
  useGetFinalValuationsOfAppraiserQuery,
  useRequestFinalValuationForManagerMutation,
  useGetValuationsQuery,
  useUpdateJewelryStatusByManagerMutation,
  useRejectJewelryByManagerMutation
} = valuationApi
