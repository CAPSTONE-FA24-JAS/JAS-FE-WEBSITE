import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import baseUrl from '../utils/http'
import { Data } from '../types/Account.type'
import { Respone } from '../types/Respone.type'
import { DataResponse, Jewelry } from '../types/Jewelry.type'

export const jewelryApi = createApi({
  reducerPath: 'jewelryApi',
  tagTypes: ['Jewelry'],
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
    getJewelriesNoSlot: builder.query<Respone<DataResponse<Jewelry>>, void>({
      query: () => '/Jewelrys/GetJewelryNoLot', // lấy hếc :D
      providesTags(res) {
        if (res) {
          return [
            ...res.data.dataResponse.map(({ id }) => ({ type: 'Jewelry' as const, id })),
            { type: 'Jewelry', id: 'LIST' }
          ]
        } else {
          return [{ type: 'Jewelry', id: 'LIST' }]
        }
      }
    })
  })
})

export const { useGetJewelriesNoSlotQuery } = jewelryApi
