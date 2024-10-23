export interface Auction {
  id: number
  name: string
  startTime: string
  endTime: string
  actualEndTime: string
  description: string
  imageLink: string
  status: 'Waiting' | 'UpComing' | 'Live' | 'Past' | 'Cancelled'
  totalLot: number
}

export interface CreateAuctionPayload {
  Name: string
  StartTime: string
  EndTime: string
  Description: string
  FileImage: File | Blob
}
