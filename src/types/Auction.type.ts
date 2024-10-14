export interface Auction {
  id: number
  startTime: string
  endTime: string
  actualEndTime: string | null
  description: string
  location: string
  notes: string
  status: 'Past' | 'Active' | 'Future'
}
