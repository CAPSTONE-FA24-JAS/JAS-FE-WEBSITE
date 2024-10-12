import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { FinanceProof, UpdateFinanceProof } from '../types/FinanceProof.type'
import { Respone } from '../types/Respone.type'
import baseUrl from '../utils/http'
import { AccessTokenResponse, Data } from '../types/Account.type'

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

    getFinanceProofById: builder.query<Respone<FinanceProof>, number>({
      query: (id) => `BidLimit/ViewAllBidLimitById?Id=${id}`,
      providesTags: (result, error, id) => [{ type: 'FinanceProof', id }]
    }),

    updateFinanceProof: builder.mutation<Respone<FinanceProof>, Omit<UpdateFinanceProof, 'staffId'>>({
      query: (body) => {
        const user = localStorage.getItem('userLogin')
        if (user) {
          const userData = JSON.parse(user) as AccessTokenResponse
          const staffId = userData ? userData.user.staffDTO?.id : 100
          console.log('staffId', staffId)
          return {
            url: `BidLimit/UpdateStatusBidLimit`,
            method: 'PUT',
            body: { ...body, staffId }
          }
        }
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

export const { useGetFinanceProofsQuery, useGetFinanceProofByIdQuery, useUpdateFinanceProofMutation } = financeProofApi
