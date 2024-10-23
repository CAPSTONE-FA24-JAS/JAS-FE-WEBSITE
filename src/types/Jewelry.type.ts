export interface DataResponse<T> {
  dataResponse: T[]
}

export interface Jewelry {
  id: number
  name: string
  description: string | null
  estimatePriceMin: number | null
  estimatePriceMax: number | null
  startingPrice: number | null
  specificPrice: number | null
  videoLink: string | null
  forGender: string | null
  title: string
  bidForm: string | null
  time_Bidding: string | null
  artistId: number
  categoryId: number
  valuationId: number
  artist: Artist
  category: Category
  imageJewelries: ImageJewelry[]
  keyCharacteristicDetails: KeyCharacteristicDetail[]
  mainDiamonds: any[]
  secondaryDiamonds: any[]
  mainShaphies: any[]
  secondaryShaphies: any[]
  valuation: Valuation
}

interface Artist {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
}

interface ImageJewelry {
  imageLink: string
  title: string
  thumbnailImage: string
  jewelryId: number
}

interface KeyCharacteristicDetail {
  id: number
  description: string
  jewelryId: number
  keyCharacteristicId: number
  keyCharacteristic: KeyCharacteristic
}

interface KeyCharacteristic {
  id: number
  name: string
}

interface Valuation {
  id: number
  name: string
  description: string
  pricingTime: string | null
  height: number
  width: number
  depth: number
  estimatePriceMin: number | null
  estimatePriceMax: number | null
  imageOfReceip: string | null
  actualStatusOfJewelry: string | null
  status: string
  cancelReason: string | null
  sellerId: number
  staffId: number
  creationDate: string
  seller: Seller
  staff: Staff
  appraiser: any | null
  imageValuations: ImageValuation[]
  valuationDocuments: ValuationDocument[]
  jewelry: Jewelry | null
}

interface Seller {
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
  priceLimit: number | null
  expireDate: string | null
  accountDTO: AccountDTO
}

interface Staff {
  id: number
  firstName: string
  lastName: string
  profilePicture: string
  gender: string
  dateOfBirth: string
  accountDTO: AccountDTO
}

interface AccountDTO {
  id: number
  email: string
  phoneNumber: string
  gender: string | null
  passwordHash: string
  roleId: number
  roleName: string
  customerDTO: any | null
  staffDTO: any | null
}

interface ImageValuation {
  id: number
  imageLink: string
  valuationId: number
}

interface ValuationDocument {
  id: number
  documentLink: string
  valuationId: number
  valuationDocumentType: string
  signatureCode: string | null
  creationDate: string
  createdBy: number
}
