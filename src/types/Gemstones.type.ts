export interface ValuationGemstoneDataParent {
  code: number
  message: string
  isSuccess: boolean
  data: ValuationGemstoneData
  errorMessages: string
}

export interface ValuationGemstoneData {
  name: string
  estimatePriceMin: number
  estimatePriceMax: number
  specificPrice: number
  videoLink: string
  forGender: string
  artistId: string
  categoryId: string
  imageJewelries: ImageJewelry[]
  keyCharacteristicDetails: KeyCharacteristicDetail[]
}

export interface ImageJewelry {
  imageLink: string
  title: string
  thumbnailImage: string
  jewelryId: number
}

export interface KeyCharacteristicDetail {
  id: number
  description: string
  jewelryId: number
  keyCharacteristicId: number
  keyCharacteristic: string
}

export interface MainDiamond {
  id: number
  name: string
  color: string
  cut: string
  clarity: string
  quantity: number
  settingType: string
  dimension: string
  shape: string
  certificate: string
  fluorescence: string
  lengthWidthRatio: string
  type: string
  jewelryId: number
  documentDiamonds: DocumentDiamond[]
  imageDiamonds: ImageDiamond[]
}

export interface DocumentDiamond {
  documentLink: string
  documentTitle: string
  diamondId: number
}

export interface ImageDiamond {
  imageLink: string
  diamondId: number
}

export interface SecondaryDiamond {
  id: number
  name: string
  color: string
  cut: string
  clarity: string
  quantity: number
  settingType: string
  dimension: string
  shape: string
  certificate: string
  fluorescence: string
  lengthWidthRatio: string
  type: string
  jewelryId: number
  documentDiamonds: DocumentDiamond2[]
  imageDiamonds: ImageDiamond2[]
}

export interface DocumentDiamond2 {
  documentLink: string
  documentTitle: string
  diamondId: number
}

export interface ImageDiamond2 {
  imageLink: string
  diamondId: number
}

export interface MainShaphy {
  id: number
  name: string
  color: string
  carat: string
  enhancementType: string
  quantity: number
  settingType: string
  dimension: string
  jewelryId: number
  documentShaphies: DocumentShaphy[]
  imageShaphies: ImageShaphy[]
}

export interface DocumentShaphy {
  documentLink: string
  documentTitle: string
  shaphieId: number
}

export interface ImageShaphy {
  imageLink: string
  shaphieId: number
}

export interface SecondaryShaphy {
  id: number
  name: string
  color: string
  carat: string
  enhancementType: string
  quantity: number
  settingType: string
  dimension: string
  jewelryId: number
  documentShaphies: DocumentShaphy2[]
  imageShaphies: ImageShaphy2[]
}

export interface DocumentShaphy2 {
  documentLink: string
  documentTitle: string
  shaphieId: number
}

export interface ImageShaphy2 {
  imageLink: string
  shaphieId: number
}

export interface Valuation {
  id: number
  name: string
  description: string
  pricingTime: string
  height: number
  width: number
  depth: number
  estimatePriceMin: number
  estimatePriceMax: number
  imageOfReceip: string
  actualStatusOfJewelry: string
  status: string
  cancelReason: string
  sellerId: number
  staffId: number
  creationDate: string
  seller: Seller
  staff: Staff
  appraiser: Appraiser
  imageValuations: ImageValuation[]
  valuationDocuments: any[]
  jewelry: any
}

export interface Seller {
  id: number
  firstName: string
  lastName: string
  profilePicture: string
  gender: string
  dateOfBirth: string
  address: string
  citizenIdentificationCard: string
  idIssuanceDate: string
  idExpirationDate: string
  priceLimit: number
  expireDate: string
  walletId: number
  walletDTO: WalletDto
  accountDTO: AccountDto
}

export interface WalletDto {
  id: number
  balance: string
  customerDTO: any
}

export interface AccountDto {
  id: number
  email: string
  phoneNumber: string
  gender: any
  passwordHash: string
  roleId: number
  roleName: string
  customerDTO: any
  staffDTO: any
}

export interface Staff {
  id: number
  firstName: string
  lastName: string
  profilePicture: string
  gender: string
  dateOfBirth: string
  accountDTO: AccountDto2
}

export interface AccountDto2 {
  id: number
  email: string
  phoneNumber: string
  gender: any
  passwordHash: string
  roleId: number
  roleName: string
  customerDTO: any
  staffDTO: any
}

export interface Appraiser {
  id: number
  firstName: string
  lastName: string
  profilePicture: string
  gender: string
  dateOfBirth: string
  accountDTO: AccountDto3
}

export interface AccountDto3 {
  id: number
  email: string
  phoneNumber: string
  gender: any
  passwordHash: string
  roleId: number
  roleName: string
  customerDTO: any
  staffDTO: any
}

export interface ImageValuation {
  id: number
  imageLink: string
  valuationId: number
}
