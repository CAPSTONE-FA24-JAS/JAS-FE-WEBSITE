import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { FinanceProof, UpdateFinanceProof } from '../types/FinanceProof.type'
import { Respone } from '../types/Respone.type'
import baseUrl from '../utils/http'
import { Data } from '../types/Account.type'

export const financeProofApi = createApi({
  reducerPath: 'financeProofApi',
  tagTypes: ['FinanceProof'],
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
  endpoints: (builder) => ({
    getFinanceProofs: builder.query<Respone<FinanceProof[]>, void>({
      query: () => 'BidLimit/ViewAllBidLimit',

      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'FinanceProof' as const, id })),
              { type: 'FinanceProof', id: 'LIST' }
            ]
          : [{ type: 'FinanceProof', id: 'LIST' }]
    }),
    getFinanceProofByStatus: builder.query<Respone<FinanceProof[]>, number>({
      query: (status) => `BidLimit/ViewBidLimtByStatus?statusValue=${status}`,

      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'FinanceProof' as const, id })),
              { type: 'FinanceProof', id: 'LIST' }
            ]
          : [{ type: 'FinanceProof', id: 'LIST' }]
    }),

    getFinanceProofById: builder.query<Respone<FinanceProof>, number>({
      query: (id) => `BidLimit/ViewBidLimitById?Id=${id}`,
      providesTags: (result, error, id) => [{ type: 'FinanceProof', id }]
    }),

    updateFinanceProof: builder.mutation<Respone<FinanceProof>, UpdateFinanceProof>({
      query: (body) => {
        return {
          url: `BidLimit/UpdateStatusBidLimit`,
          method: 'PUT',
          body
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'FinanceProof', id }]
    })
  })
})

export const {
  useGetFinanceProofsQuery,
  useGetFinanceProofByStatusQuery,
  useGetFinanceProofByIdQuery,
  useUpdateFinanceProofMutation
} = financeProofApi
