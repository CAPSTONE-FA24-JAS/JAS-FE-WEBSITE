import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data } from '../types/Account.type'
import baseUrl from '../utils/http'

export const overviewApi = createApi({
  reducerPath: 'overviewApi',
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
  endpoints: (build) => ({
    viewCompanyTransactions: build.query({
      query: () => 'Transaction/ViewTransactionsOfCompany'
    }),
    viewAuction: build.query({
      query: () => 'Auction/ViewAutions'
    }),
    viewListLotByAuction: build.query({
      query: (auctionId: number) => `Lot/ViewListLotByAuction?auctionId=${auctionId}`
    }),
    viewDetailLotById: build.query({
      query: (id: number) => `Lot/ViewDetailLotById?Id=${id}`
    }),
    viewAuctionsByStatus: build.query({
      query: (statusId: number) => `Auction/GetAuctionsByStatus?statusId=${statusId}`
    })
  })
})

export const {
  useViewCompanyTransactionsQuery,
  useViewAuctionQuery,
  useViewListLotByAuctionQuery,
  useViewDetailLotByIdQuery,
  useViewAuctionsByStatusQuery
} = overviewApi
