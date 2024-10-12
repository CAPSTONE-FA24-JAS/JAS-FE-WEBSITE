export interface FinanceProof {
  id: number
  file: string
  priceLimit: number
  customerId: 11
  staffId: number | null
  customerName: string
  reason: string | null
  startDate: string
  expireDate: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

export interface UpdateFinanceProof {
  id: number
  status: number
  priceLimit: number
  reason: string
  staffId: number
}
