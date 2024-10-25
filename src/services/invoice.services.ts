// services/accountApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data } from '../types/Account.type'
import baseUrl from '../utils/http'

export const manageInvoice = createApi({
  reducerPath: 'manageInvoice',
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
    getInvoicesForManager: build.query({
      query: () => `Invoices/getInvoicesByStatusForManger`
    }),
    getInvoiceById: build.query({
      query: (invoiceId) => `Invoices/GetDetailInvoice?invoiceId=${invoiceId}` // New endpoint for getting invoice by ID
    }),
    assignShipper: build.mutation<{ message: string }, { invoiceId: number; shipperId: number; status: number }>({
      query: ({ invoiceId, shipperId, status }) => ({
        url: `/Invoices/AsignShipper`,
        method: 'PUT',
        params: { invoiceId, shipperId, status }
      })
    }),
    finishInvoice: build.mutation<{ message: string }, { invoiceId: number }>({
      query: ({ invoiceId }) => ({
        url: `/Invoices/FinishInvoiceByManager`,
        method: 'PUT',
        params: { invoiceId }
      })
    })
  })
})

export const {
  useGetInvoicesForManagerQuery,
  useGetInvoiceByIdQuery, // Exporting the new query hook
  useAssignShipperMutation,
  useFinishInvoiceMutation
} = manageInvoice
