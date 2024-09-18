// services/valuationApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CreatePreliminaryRepsonse, CreatePreliminaryRequest } from '../types/Valuation.type'
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
      query: (body) => ({
        url: 'Valuations/createPreliminaryPrice',
        method: 'PUT',
        body
      })
    })
  })
})

export const { useGetValuationByIdQuery, useCreatePreliminaryMutation } = valuationApi
