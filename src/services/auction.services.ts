import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Auction } from '../types/Auction.type'
import baseUrl from '../utils/http'
import { Data } from '../types/Account.type'
import { Respone } from '../types/Respone.type'

export const auctionApi = createApi({
  reducerPath: 'auctionApi',
  tagTypes: ['Auction'],
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
  endpoints: (builder) => ({
    getAuctions: builder.query<Respone<Auction[]>, void>({
      query: () => 'Auction/ViewAutions',
      providesTags(res) {
        if (res) {
          const final = [
            ...res.data.map(({ id }) => ({ type: 'Auction' as const, id })),
            { type: 'Auction' as const, id: 'LIST' }
          ]
          return final
        }
        return [{ type: 'Auction', id: 'LIST' }]
      }
    }),
    getAuctionById: builder.query<Respone<Auction>, number>({
      query: (id) => `Auction/ViewAutionById?Id=${id}`
    }),
    createAuction: builder.mutation<Respone<Auction>, FormData>({
      query: (newAuction) => ({
        url: 'Auction/CreateAution',
        method: 'POST',
        body: newAuction,
        formData: true
      }),
      invalidatesTags: (_result, error, _body) => (error ? [] : [{ type: 'Auction', id: 'LIST' }])
    }),
    updateAuction: builder.mutation<Respone<Auction>, FormData>({
      query: (updateAuction) => ({
        url: `Auction/UpdateAution`,
        method: 'put',
        body: updateAuction,
        formData: true
      }),
      invalidatesTags: (_result, error, _body) => (error ? [] : [{ type: 'Auction', id: 'LIST' }])
    }),
    approveAuction: builder.mutation<Respone<Auction>, number>({
      query: (id) => ({
        url: `/Auction/ApproveAution?auctionId=${id}`,
        method: 'put'
      }),
      invalidatesTags: (_result, error, _body) => (error ? [] : [{ type: 'Auction', id: 'LIST' }])
    }),
    cancelAuction: builder.mutation<Respone<Auction>, number>({
      query: (id) => ({
        url: `/Auction/CancelAuction?auctionId=${id}`,
        method: 'put'
      }),
      invalidatesTags: (_result, error, _body) => (error ? [] : [{ type: 'Auction', id: 'LIST' }])
    })
  })
})

export const {
  useGetAuctionsQuery,
  useGetAuctionByIdQuery,
  useCreateAuctionMutation,
  useUpdateAuctionMutation,
  useApproveAuctionMutation,
  useCancelAuctionMutation
} = auctionApi
