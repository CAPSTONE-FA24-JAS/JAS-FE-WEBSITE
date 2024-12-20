import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data } from '../types/Account.type'
import baseUrl from '../utils/http'
import { CreateLot, ListLot, LotDetail, PLayerInLot, WinnerForLotMethod4 } from '../types/Lot.type'
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
      query: (auctionId) => `Lot/ViewListLotByAuction?auctionId=${auctionId}`,
      providesTags: (result) => {
        if (result?.data?.length) {
          return [...result.data.map(({ id }) => ({ type: 'Lot' as const, id })), { type: 'Lot', id: 'LIST' }]
        }
        return [{ type: 'Lot', id: 'LIST' }]
      }
    }),
    getLotByAuctionIdRaw: build.query<Respone<ListLot[]>, number>({
      query: (auctionId) => `Lot/ViewListLotInAuction?auctionId=${auctionId}`,
      providesTags: (result) => {
        if (result?.data?.length) {
          return [...result.data.map(({ id }) => ({ type: 'Lot' as const, id })), { type: 'Lot', id: 'LIST' }]
        }
        return [{ type: 'Lot', id: 'LIST' }]
      }
    }),
    getLotDetailById: build.query<Respone<LotDetail>, number>({
      query: (id) => `Lot/ViewDetailLotById?Id=${id}`,
      providesTags: (result) => {
        if (result) {
          return [{ type: 'Lot', id: result.data.id }]
        } else {
          return []
        }
      }
    }),
    createLotFixedPrice: build.mutation<Respone<ListLot>, Partial<CreateLot>>({
      query: (body) => ({
        url: 'Lot/CreateLotFixedPrice',
        method: 'POST',
        body: {
          title: body.title,
          deposit: Number(body.deposit),
          buyNowPrice: body.buyNowPrice,
          haveFinancialProof: body.haveFinancialProof,
          staffId: body.staffId,
          jewelryId: body.jewelryId,
          auctionId: body.auctionId
        }
      }),
      invalidatesTags() {
        return [{ type: 'Lot', id: 'LIST' }]
      }
    }),
    createLotPublicAuction: build.mutation<Respone<ListLot>, Partial<CreateLot>>({
      query: (body) => {
        const requestBody: any = {
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
          isHaveFinalPrice: body.isHaveFinalPrice
        }

        // Only add round if it exists
        if (body.round !== undefined) {
          requestBody.round = body.round
        }

        return {
          url: 'Lot/CreateLotPublicAuction',
          method: 'POST',
          body: requestBody
        }
      },
      invalidatesTags() {
        return [{ type: 'Lot', id: 'LIST' }]
      }
    }),
    createLotSecretAuction: build.mutation<Respone<ListLot>, Partial<CreateLot>>({
      query: (body) => (
        console.log(body),
        {
          url: 'Lot/CreateLotSecretAuction',
          method: 'POST',
          body: {
            title: body.title,
            startPrice: Number(body.startPrice),
            deposit: Number(body.deposit),
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
          url: 'Lot/CreateLotAuctionPriceGraduallyReduced',
          method: 'POST',
          body: {
            title: body.title,
            startPrice: Number(body.startPrice),
            finalPriceSold: Number(body.finalPriceSold),
            bidIncrement: Number(body.bidIncrement),
            deposit: Number(body.deposit),
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
    }),
    openAndPauseLot: build.mutation<Respone<string>, { lotid: number; status: number }>({
      query: ({ lotid, status }) => ({
        url: `BidPrices/OpenAndPauseLot?lotId=${lotid}&status=${status}`,
        method: 'PUT'
      })
    }),
    cancelLot: build.mutation<Respone<string>, number>({
      query: (lotId) => ({
        url: `BidPrices/CancelLot?lotId=${lotId}`,
        method: 'PUT'
      })
    }),
    getPlayerInLot: build.query<Respone<PLayerInLot[]>, number>({
      query: (lotId) => `Lot/GetPlayerInLotFixedAndSercet?lotId=${lotId}`
    }),
    getWinnerForLot: build.query<Respone<WinnerForLotMethod4[]>, number>({
      query: (lotId) => `CustomerLots/GetWinnerForLot?lotId=${lotId}`
    }),
    updateFixPriceLot: build.mutation<Respone<ListLot>, Partial<CreateLot>>({
      query: (body) => ({
        url: 'Lot/UpdateLotFixedPrice',
        method: 'PUT',
        body: {
          id: body.id,
          title: body.title,
          staffId: body.staffId,
          jewelryId: body.jewelryId,
          auctionId: body.auctionId,
          deposit: body.deposit,
          buyNowPrice: body.buyNowPrice,
          haveFinancialProof: body.haveFinancialProof
        }
      }),
      invalidatesTags: [{ type: 'Lot', id: 'LIST' }]
    }),
    updateSecretLot: build.mutation<Respone<ListLot>, Partial<CreateLot>>({
      query: (body) => ({
        url: 'Lot/UpdateLotSercet',
        method: 'PUT',
        body: {
          id: body.id,
          title: body.title,
          staffId: body.staffId,
          jewelryId: body.jewelryId,
          auctionId: body.auctionId,
          deposit: body.deposit,
          startPrice: body.startPrice,
          haveFinancialProof: body.haveFinancialProof
        }
      }),
      invalidatesTags: [{ type: 'Lot', id: 'LIST' }]
    }),
    updatePublicLot: build.mutation<Respone<ListLot>, Partial<CreateLot>>({
      query: (body) => {
        const requestBody: any = {
          id: body.id,
          title: body.title,
          staffId: body.staffId,
          jewelryId: body.jewelryId,
          auctionId: body.auctionId,
          isExtend: body.isExtend,
          deposit: body.deposit,
          startPrice: body.startPrice,
          finalPriceSold: body.finalPriceSold,
          bidIncrement: body.bidIncrement,
          haveFinancialProof: body.haveFinancialProof,
          isHaveFinalPrice: body.isHaveFinalPrice
        }

        // Only add round if it exists
        if (body.round !== undefined) {
          requestBody.round = body.round
        }

        return {
          url: 'Lot/UpdateLotPublicAuction',
          method: 'PUT',
          body: requestBody
        }
      }
    }),
    updateAuctionPriceGraduallyReducedLot: build.mutation<Respone<ListLot>, Partial<CreateLot>>({
      query: (body) => ({
        url: 'Lot/UpdateLotGraduallyReduce',
        method: 'PUT',
        body: {
          id: body.id,
          title: body.title,
          staffId: body.staffId,
          jewelryId: body.jewelryId,
          auctionId: body.auctionId,
          startPrice: body.startPrice,
          finalPriceSold: body.finalPriceSold,
          bidIncrement: body.bidIncrement,
          deposit: body.deposit,
          haveFinancialProof: body.haveFinancialProof,
          bidIncrementTime: body.bidIncrementTime
        }
      })
    })
  })
})

export const {
  useGetLotsByAuctionIdQuery,
  useGetLotDetailByIdQuery,
  useCreateLotFixedPriceMutation,
  useCreateLotAuctionPriceGraduallyReducedMutation,
  useCreateLotPublicAuctionMutation,
  useCreateLotSecretAuctionMutation,
  useGetPlayerInLotQuery,
  useGetWinnerForLotQuery,
  useOpenAndPauseLotMutation,
  useCancelLotMutation,
  useGetLotByAuctionIdRawQuery,
  useUpdateFixPriceLotMutation,
  useUpdateSecretLotMutation,
  useUpdatePublicLotMutation,
  useUpdateAuctionPriceGraduallyReducedLotMutation
} = lotApi
