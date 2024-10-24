import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data } from '../types/Account.type'
import baseUrl from '../utils/http'
import { CreateLot, Lot } from '../types/Lot.type'
import { Respone } from '../types/Respone.type'

export const lotApi = createApi({
  reducerPath: 'lotApi',
  tagTypes: ['Lot'],
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
    getLotsByAuctionId: build.query<Respone<Lot[]>, number>({
      query: (auctionId) => `/Lot/ViewListLotByAuction?auctionId=${auctionId}`,
      providesTags: (result) => {
        if (result) {
          return [...result.data.map(({ id }) => ({ type: 'Lot' as const, id })), { type: 'Lot', id: 'LIST' }]
        } else {
          return [{ type: 'Lot', id: 'LIST' }]
        }
      }
    }),
    createLotFixedPrice: build.mutation<Respone<Lot>, Partial<CreateLot>>({
      query: (body) => ({
        url: '/Lot/CreateLotFixedPrice',
        method: 'POST',
        body: {
          title: body.title,
          deposit: Number(body.deposit),
          buyNowPrice: body.buyNowPrice,
          startTime: body.startTime,
          endTime: body.endTime,
          isExtend: body.isExtend,
          haveFinancialProof: body.haveFinancialProof,
          staffId: body.staffId,
          jewelryId: body.jewelryId,
          auctionId: body.auctionId
        }
      }),
      invalidatesTags(result, error, arg, meta) {
        return [{ type: 'Lot', id: 'LIST' }]
      }
    }),
    createLotPublicAuction: build.mutation<Respone<Lot>, Partial<CreateLot>>({
      query: (body) => ({
        url: '/Lot/CreateLotPublicAuction',
        method: 'POST',
        body: {
          title: body.title,
          startPrice: Number(body.startPrice),
          finalPriceSold: Number(body.finalPriceSold),
          bidIncrement: Number(body.bidIncrement),
          deposit: Number(body.deposit),
          startTime: body.startTime,
          endTime: body.endTime,
          isExtend: body.isExtend,
          haveFinancialProof: body.haveFinancialProof,
          staffId: body.staffId,
          jewelryId: body.jewelryId,
          auctionId: body.auctionId
        }
      }),
      invalidatesTags(result, error, arg, meta) {
        return [{ type: 'Lot', id: 'LIST' }]
      }
    }),
    createLotSecretAuction: build.mutation<Respone<Lot>, Partial<CreateLot>>({
      query: (body) => ({
        url: '/Lot/CreateLotSecretAuction',
        method: 'POST',
        body: {
          title: body.title,
          startPrice: Number(body.startPrice),
          finalPriceSold: Number(body.finalPriceSold),
          deposit: Number(body.deposit),
          startTime: body.startTime,
          endTime: body.endTime,
          isExtend: body.isExtend,
          haveFinancialProof: body.haveFinancialProof,
          staffId: body.staffId,
          jewelryId: body.jewelryId,
          auctionId: body.auctionId
        }
      }),
      invalidatesTags(result, error, arg, meta) {
        return [{ type: 'Lot', id: 'LIST' }]
      }
    }),
    CreateLotAuctionPriceGraduallyReduced: build.mutation<Respone<Lot>, Partial<CreateLot>>({
      query: (body) => ({
        url: '/Lot/CreateLotAuctionPriceGraduallyReduced',
        method: 'POST',
        body: {
          title: body.title,
          startPrice: Number(body.startPrice),
          finalPriceSold: Number(body.finalPriceSold),
          bidIncrement: Number(body.bidIncrement),
          deposit: Number(body.deposit),
          startTime: body.startTime,
          endTime: body.endTime,
          isExtend: body.isExtend,
          haveFinancialProof: body.haveFinancialProof,
          staffId: body.staffId,
          jewelryId: body.jewelryId,
          auctionId: body.auctionId
        }
      }),
      invalidatesTags(result, error, arg, meta) {
        return [{ type: 'Lot', id: 'LIST' }]
      }
    })
  })
})

export const {
  useGetLotsByAuctionIdQuery,
  useCreateLotFixedPriceMutation,
  useCreateLotAuctionPriceGraduallyReducedMutation,
  useCreateLotPublicAuctionMutation,
  useCreateLotSecretAuctionMutation
} = lotApi
