import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data } from '../types/Account.type'
import baseUrl from '../utils/http'
import { CreateLot, ListLot, LotDetail } from '../types/Lot.type'
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
    getLotsByAuctionId: build.query<Respone<ListLot[]>, number>({
      query: (auctionId) => `/Lot/ViewListLotByAuction?auctionId=${auctionId}`,
      providesTags: (result) => {
        if (result?.data !== null) {
          return result?.data
            ? [...result.data.map(({ id }) => ({ type: 'Lot' as const, id })), { type: 'Lot', id: 'LIST' }]
            : [{ type: 'Lot', id: 'LIST' }]
        }
        return [{ type: 'Lot', id: 'LIST' }]
      }
    }),
    getLotDetailById: build.query<Respone<LotDetail>, number>({
      query: (id) => `/Lot/ViewDetailLotById?Id=${id}`,
      providesTags: (result) => {
        if (result) {
          return [{ type: 'Lot', id: result.data.id }]
        } else {
          return []
        }
      }
    }),
    createLotFixedPrice: build.mutation<Respone<ListLot>, Partial<CreateLot>>({
      query: (body) => (
        console.log(body),
        {
          url: '/Lot/CreateLotFixedPrice',
          method: 'POST',
          body: {
            title: body.title,
            deposit: Number(body.deposit),
            buyNowPrice: body.buyNowPrice,
            isExtend: body.isExtend,
            haveFinancialProof: body.haveFinancialProof,
            staffId: body.staffId,
            jewelryId: body.jewelryId,
            auctionId: body.auctionId
          }
        }
      ),
      invalidatesTags() {
        return [{ type: 'Lot', id: 'LIST' }]
      }
    }),
    createLotPublicAuction: build.mutation<Respone<ListLot>, Partial<CreateLot>>({
      query: (body) => (
        console.log(body),
        {
          url: '/Lot/CreateLotPublicAuction',
          method: 'POST',
          body: {
            title: body.title,
            startPrice: Number(body.startPrice),
            finalPriceSold: Number(body.finalPriceSold),
            bidIncrement: Number(body.bidIncrement),
            deposit: Number(body.deposit),
            isExtend: body.isExtend,
            haveFinancialProof: body.haveFinancialProof,
            staffId: body.staffId,
            jewelryId: body.jewelryId,
            auctionId: body.auctionId
          }
        }
      ),
      invalidatesTags() {
        return [{ type: 'Lot', id: 'LIST' }]
      }
    }),
    createLotSecretAuction: build.mutation<Respone<ListLot>, Partial<CreateLot>>({
      query: (body) => (
        console.log(body),
        {
          url: '/Lot/CreateLotSecretAuction',
          method: 'POST',
          body: {
            title: body.title,
            startPrice: Number(body.startPrice),
            finalPriceSold: Number(body.finalPriceSold),
            deposit: Number(body.deposit),
            isExtend: body.isExtend,
            haveFinancialProof: body.haveFinancialProof,
            staffId: body.staffId,
            jewelryId: body.jewelryId,
            auctionId: body.auctionId
          }
        }
      ),
      invalidatesTags() {
        return [{ type: 'Lot', id: 'LIST' }]
      }
    }),
    CreateLotAuctionPriceGraduallyReduced: build.mutation<Respone<ListLot>, Partial<CreateLot>>({
      query: (body) => (
        console.log(body),
        {
          url: '/Lot/CreateLotAuctionPriceGraduallyReduced',
          method: 'POST',
          body: {
            title: body.title,
            startPrice: Number(body.startPrice),
            finalPriceSold: Number(body.finalPriceSold),
            bidIncrement: Number(body.bidIncrement),
            deposit: Number(body.deposit),
            isExtend: body.isExtend,
            haveFinancialProof: body.haveFinancialProof,
            staffId: body.staffId,
            jewelryId: body.jewelryId,
            auctionId: body.auctionId,
            bidIncrementTime: Number(body.bidIncrementTime)
          }
        }
      ),
      invalidatesTags() {
        return [{ type: 'Lot', id: 'LIST' }]
      }
    })
  })
})

export const {
  useGetLotsByAuctionIdQuery,
  useGetLotDetailByIdQuery,
  useCreateLotFixedPriceMutation,
  useCreateLotAuctionPriceGraduallyReducedMutation,
  useCreateLotPublicAuctionMutation,
  useCreateLotSecretAuctionMutation
} = lotApi
