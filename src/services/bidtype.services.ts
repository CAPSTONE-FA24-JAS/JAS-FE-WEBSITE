// services/accountApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data } from '../types/Account.type'
import baseUrl from '../utils/http'

// Define the API to fetch auction methods
export const bidType = createApi({
  reducerPath: 'bidType',
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
    // Add the endpoint to fetch auction methods
    viewListLotType: build.query<any, void>({
      query: () => 'Lot/ViewListLotType'
    })
  })
})

// Export the generated hook
export const { useViewListLotTypeQuery } = bidType
