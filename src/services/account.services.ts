// services/accountApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AccountData, AdminGetFilterByRole, Data } from '../types/Account.type'
import baseUrl from '../utils/http'
import { Respone } from '../types/Respone.type'

export const accountApi = createApi({
  reducerPath: 'accountApi',
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
    getListUsers: build.query<Respone<AccountData>, void>({
      query: () => 'Account/ViewListAccount'
    }),
    deleteAccount: build.mutation<void, number>({
      query: (id) => ({
        url: `Account/DeleteAccount?Id=${id}`,
        method: 'DELETE'
      })
    }),
    getFilterByRole: build.query<AdminGetFilterByRole, number>({
      query: (roleId) => `Account/FilterAccountByRole?roleID=${roleId}`
    })
  })
})

export const { useGetListUsersQuery, useDeleteAccountMutation, useGetFilterByRoleQuery } = accountApi
