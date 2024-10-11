export interface AssignStaffRequest {
  id: number
  staffId: number
  status: number
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
