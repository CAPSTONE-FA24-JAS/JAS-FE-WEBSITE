export interface Root {
  code: number
  message: string
  isSuccess: boolean
  data: DataConsign
  errorMessages: any
}

export interface DataConsign {
  dataResponse: DataConsignResponse[]
  totalItemRepsone: number
}

export interface DataConsignResponse {
  id: number
  name: string
  pricingTime?: string
  desiredPrice?: number
  height: number
  width: number
  depth: number
  description: string
  status: string
  sellerId: number
  staffId?: number
  seller: Seller
}

export interface Seller {
  id: number
  firstName: string
  lastName: string
  profilePicture: any
  email: string
  gender: string
  address: any
  passwordHash: string
  status: boolean
  phoneNumber: string
  confirmationToken: string
  isConfirmed: boolean
  vnPayAccount: any
  vnPayBankCode: any
  vnPayAccountName: any
  roleId: number
  roleName: any
}
export interface AssignStaffRequest {
  id: number
  staffId: number
  status: string
}

export interface AssignStaffResponse {
  code: number
  message: string
  isSuccess: boolean
  data: {
    name: string
    pricingTime: string
    desiredPrice: number
    height: number
    width: number
    depth: number
    description: string
    status: string | null
    imageOfReceip: string | null
    actualStatusOfJewelry: string | null
    quantity: number | null
    sellerId: number
    staffId: number
    seller: any
    staff: any
    imageValuations: any
    valuationDocuments: any
    id: number
    creationDate: string
    createdBy: number
    modificationDate: string
    modificationBy: number
    deletionDate: string | null
    deleteBy: number | null
    isDeleted: boolean
  }
  errorMessages: any // Adjust based on actual structure if available
}
