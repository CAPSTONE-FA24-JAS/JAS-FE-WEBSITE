export interface DataResponseKeyCharacteristic {
  code: number
  message: string
  isSuccess: boolean
  data: KeyCharacteristic[]
  errorMessages: any
}
export interface KeyCharacteristic {
  id: number
  name: string
}
export interface DataResponseCategory {
  code: number
  message: string
  isSuccess: boolean
  data: Category[]
  errorMessages: any
}
export interface Category {
  id: number
  name: string
}
export interface DataResponseArtist {
  code: number
  message: string
  isSuccess: boolean
  data: Artist[]
  errorMessages: any
}
export interface Artist {
  id: number
  name: string
}
