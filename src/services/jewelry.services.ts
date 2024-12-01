import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import baseUrl from '../utils/http'
import { Data } from '../types/Account.type'
import { Respone } from '../types/Respone.type'
import { DataResponse, Jewelry, UpdateJewelryRequest } from '../types/Jewelry.type'

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
    }),
    getAllJewelries: builder.query<
      Respone<DataResponse<Jewelry>>,
      {
        pageSize?: number
        pageIndex?: number
      }
    >({
      query: ({ pageSize = 10, pageIndex = 1 }) => `/Jewelrys/GetJewelry?pageSize=${pageSize}&pageIndex=${pageIndex}`,
      providesTags(res) {
        if (res?.data.dataResponse) {
          return [
            ...res.data.dataResponse.map(({ id }) => ({ type: 'Jewelry' as const, id })),
            { type: 'Jewelry', id: 'LIST' }
          ]
        }
        return [{ type: 'Jewelry', id: 'LIST' }]
      }
    }),
    getJewelryById: builder.query<Respone<Jewelry>, number>({
      query: (id) => `/Jewelrys/GetDetailJewelry?jewelryId=${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Jewelry', id }]
    }),

    updateJewelry: builder.mutation<any, UpdateJewelryRequest>({
      query: (data) => ({
        url: `/Jewelrys/UpdateJewelry`,
        method: 'PUT',
        // Vì API yêu cầu multipart/form-data
        body: convertToFormData(data)
      }),
      invalidatesTags: ['Jewelry']
    })
  })
})

const convertToFormData = (data: UpdateJewelryRequest) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        // Xử lý các mảng
        value.forEach((item, index) => {
          Object.entries(item).forEach(([itemKey, itemValue]) => {
            formData.append(`${key}[${index}].${itemKey}`, String(itemValue))
          })
        })
      } else {
        formData.append(key, value.toString())
      }
    }
  })

  return formData
}

export const { useGetJewelriesNoSlotQuery, useGetAllJewelriesQuery, useGetJewelryByIdQuery, useUpdateJewelryMutation } =
  jewelryApi
