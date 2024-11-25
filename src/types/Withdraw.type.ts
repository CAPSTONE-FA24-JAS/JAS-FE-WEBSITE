export interface WithDraw {
  id: number
  customerId: number
  walletId: number
  status: string
  amount: number
  viewCreditCardDTO: {
    id: number
    bankName: string
    bankAccountHolder: string
    bankCode: string
    customerId: number
  }
}
