import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data } from '../types/Account.type'
import baseUrl from '../utils/http'
import {
  DataResponseArtist,
  DataResponseCategory,
  DataResponseKeyCharacteristic,
  KeyCharacteristic
} from '../types/KeyCharacteristic'
import { ValuationGemstoneData, ValuationGemstoneDataParent } from '../types/Gemstones.type'

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

    // Thêm mutation để gọi API CreateFinalValuation
    createFinalValuation: build.mutation<ValuationGemstoneData, any>({
      query: (payload) => ({
        url: 'Jewelrys/CreateFinalValuation',
        method: 'POST',
        body: payload
      }),
      // Transform the response to match the ValuationGemstoneData interface
      transformResponse: (response: ValuationGemstoneDataParent): ValuationGemstoneData => {
        if (response.isSuccess) {
          return response.data // Return the data object as defined in your ValuationGemstoneData interface
        } else {
          throw new Error(response.message || 'Error creating final valuation')
        }
      }
    })
  })
})

// Export các hooks cho việc sử dụng trong component
export const {
  useGetKeyCharacteristicsQuery,
  useGetCategoriesQuery,
  useCreateFinalValuationMutation,
  useGetArtistQuery
} = createFinal
