export interface Lot {
  id: number
  startPrice: number
  currentPrice: number
  finalPriceSold: number
  status: string
  bidIncrement: number
  deposit: number
  buyNowPrice: number
  floorFeePercent: number
  startTime: string
  endTime: string
  actualEndTime: string
  isExtend: boolean
  haveFinancialProof: boolean
  lotType: string
  imageLinkJewelry: string
  sellerId: number
  staffId: number
  jewelryId: number
  auctionId: number
}

export interface CreateLot {
  title: string
  deposit: number
  buyNowPrice: number
  startTime: string // ISO string for date
  endTime: string // ISO string for date
  isExtend: boolean
  haveFinancialProof: boolean
  staffId: number
  jewelryId: number
  auctionId: number
  startPrice: number
  finalPriceSold: number
  bidIncrement: number
  lotTypeValue: number
}
