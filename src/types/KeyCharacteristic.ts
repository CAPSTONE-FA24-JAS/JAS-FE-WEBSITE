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

export interface DataResponseEnumColorShapphies {
  code: number
  message: string
  isSuccess: boolean
  data: EnumColorShapphies[]
  errorMessages: any
}

export interface EnumColorShapphies {
  name: string
  value: number
}
export interface DataResponseEnumColorDiamonds {
  code: number
  message: string
  isSuccess: boolean
  data: EnumColorDiamonds[]
  errorMessages: any
}

export interface EnumColorDiamonds {
  name: string
  value: number
}
export interface DataResponseEnumCuts {
  code: number
  message: string
  isSuccess: boolean
  data: EnumCuts[]
  errorMessages: any
}

export interface EnumCuts {
  name: string
  value: number
}
export interface DataResponseEnumClarities {
  code: number
  message: string
  isSuccess: boolean
  data: EnumClarities[]
  errorMessages: any
}

export interface EnumClarities {
  name: string
  value: number
}
export interface DataResponseEnumShapes {
  code: number
  message: string
  isSuccess: boolean
  data: EnumShapes[]
  errorMessages: any
}

export interface EnumShapes {
  name: string
  value: number
}