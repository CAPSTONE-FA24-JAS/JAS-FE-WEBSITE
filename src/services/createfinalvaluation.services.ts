import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data } from '../types/Account.type'
import { ValuationGemstoneData, ValuationGemstoneDataParent } from '../types/Gemstones.type'
import {
  DataResponseArtist,
  DataResponseCategory,
  DataResponseEnumClarities,
  DataResponseEnumColorDiamonds,
  DataResponseEnumColorShapphies,
  DataResponseEnumCuts,
  DataResponseKeyCharacteristic
} from '../types/KeyCharacteristic'
import baseUrl from '../utils/http'

export const createFinal = createApi({
  reducerPath: 'createFinal',
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
    // Lấy danh sách Key Characteristics
    getKeyCharacteristics: build.query<DataResponseKeyCharacteristic, void>({
      query: () => 'KeyCharacteristics/ViewKeyCharacteristic'
    }),

    // Lấy danh sách Categories
    getCategories: build.query<DataResponseCategory, void>({
      query: () => 'Categories/ViewCategories'
    }),

    // Lấy danh sách Artists
    getArtist: build.query<DataResponseArtist, void>({
      query: () => 'Artists/ViewArtists'
    }),

    getEnumColorShapphies: build.query<DataResponseEnumColorShapphies, void>({
      query: () => 'Jewelrys/ViewEnumColorShapphies'
    }),

    getEnumColorDiamonds: build.query<DataResponseEnumColorDiamonds, void>({
      query: () => 'Jewelrys/ViewEnumColorDiamonds'
    }),

    getEnumCuts: build.query<DataResponseEnumCuts, void>({
      query: () => 'Jewelrys/ViewEnumCuts'
    }),

    getEnumClarities: build.query<DataResponseEnumClarities, void>({
      query: () => 'Jewelrys/ViewEnumClarities'
    }),

    createFinalValuation: build.mutation<ValuationGemstoneData, any>({
      query: (payload) => ({
        url: 'Jewelrys/CreateFinalValuation',
        method: 'POST',
        body: payload,
        formData: true
      }),
      transformResponse: (response: ValuationGemstoneDataParent): ValuationGemstoneData => {
        if (response.isSuccess) {
          return response.data
        } else {
          throw new Error(response.message || 'Error creating final valuation')
        }
      }
    })
  })
})

export const {
  useGetKeyCharacteristicsQuery,
  useGetCategoriesQuery,
  useCreateFinalValuationMutation,
  useGetArtistQuery,
  useGetEnumColorShapphiesQuery,
  useGetEnumColorDiamondsQuery,
  useGetEnumCutsQuery,
  useGetEnumClaritiesQuery
} = createFinal
