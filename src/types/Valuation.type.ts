export interface CreatePreliminaryRequest {
  id: number
  status: number
  estimatePriceMin: number
  estimatePriceMax: number
  appraiserId: number
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
export interface CreateReceiptRequest {
  id: number
  actualStatusOfJewelry: string
  deliveryDate: string
  status: number
}
export interface CreateReceiptResponse {
  id: number
  name: string
  valuationDocuments: ValuationDocument[]
}
export interface ValuationDocument {
  fileDocument: string
  valuationId: number
  valuationDocumentTypeId: number
  creationDate: string
  createdBy: number
}
export interface RequestFinalValuation {
  startingPrice: number
  bidForm: number
  // time_Bidding: string
  jewelryId: number
}
