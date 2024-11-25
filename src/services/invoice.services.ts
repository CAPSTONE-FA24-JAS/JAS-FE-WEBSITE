// services/accountApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data } from '../types/Account.type'
import baseUrl from '../utils/http'
import { Respone } from '../types/Respone.type'
import { WithDraw } from '../types/Withdraw.type'

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
      query: (invoiceId) => `Invoices/GetDetailInvoice?invoiceId=${invoiceId}`
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
    }),
    approvePaymentByBankTransfer: build.mutation<{ message: string }, { invoiceId: number }>({
      query: ({ invoiceId }) => ({
        url: `/Invoices/ApprovePaymentInvoiceByBankTransfer`,
        method: 'POST',
        params: { invoiceId }
      })
    }),
    getInvoicesForCheckBill: build.query({
      query: () => `Invoices/GetListInvoiceForCheckBill`
    }),
    viewListRequestWithdrawForManagement: build.query<Respone<WithDraw[]>, void>({
      query: () => `Wallet/ViewListRequestWithdrawForManagerment`
    }),
    approveRequestNewWithdraw: build.mutation<{ message: string }, { requestId: number }>({
      /// manager approve request withdraw
      query: ({ requestId }) => ({
        url: `Wallet/ApproveRequestNewWithdraw`,
        method: 'PATCH',
        params: { requestId }
      })
    }),
    processWithdrawStaff: build.mutation<{ message: string }, { requestId: number }>({
      query: ({ requestId }) => ({
        url: `/Wallet/ProcessRequestNewWithdrawByStaff?requestId=${requestId}`,
        method: 'PATCH',
        params: { requestId }
      })
    }),
    cancelWithdraw: build.mutation<{ message: string }, { requestId: number }>({
      query: ({ requestId }) => ({
        url: `/Wallet/CancelRequestNewWithdrawByStaff?requestId=${requestId}`,
        method: 'PATCH',
        params: { requestId }
      })
    })
  })
})

export const {
  useGetInvoicesForManagerQuery,
  useGetInvoiceByIdQuery,
  useAssignShipperMutation,
  useFinishInvoiceMutation,
  useApprovePaymentByBankTransferMutation,
  useGetInvoicesForCheckBillQuery,
  useViewListRequestWithdrawForManagementQuery,
  useApproveRequestNewWithdrawMutation,
  useProcessWithdrawStaffMutation,
  useCancelWithdrawMutation
} = manageInvoice
