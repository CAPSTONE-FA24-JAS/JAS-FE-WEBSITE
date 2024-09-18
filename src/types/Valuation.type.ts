export interface CreatePreliminaryRequest {
  name: string
  height: number
  width: number
  depth: number
  desiredPrice: number
  description: string
}
export interface CreatePreliminaryRepsonse {
  code: number
  message: string
  isSuccess: boolean
  data: CreatePreliminaryRepsonseChildren
  errorMessages: any
}

export interface CreatePreliminaryRepsonseChildren {
  name: string
  pricingTime: string
  desiredPrice: number
  height: number
  width: number
  depth: number
  description: string
  status: string
  imageOfReceip: any
  actualStatusOfJewelry: any
  quantity: any
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
  deletionDate: any
  deleteBy: any
  isDeleted: boolean
}
