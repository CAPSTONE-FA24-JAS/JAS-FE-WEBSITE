// services/accountApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { CreateNewStaffForm, Data } from '../types/Account.type'
import baseUrl from '../utils/http'

export const createNewStaff = createApi({
  reducerPath: 'createNewStaff',
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
    createNewStaff: build.mutation<void, CreateNewStaffForm>({
      query: (body) => ({
        url: 'Account/CreateNewStaff',
        method: 'POST',
        body
      })
    })
  })
})

export const { useCreateNewStaffMutation } = createNewStaff
