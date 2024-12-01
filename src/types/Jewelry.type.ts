import { MainDiamond, MainShaphy, SecondaryDiamond, SecondaryShaphy } from './Gemstones.type'

export interface DataResponse<T> {
  dataResponse: T[]
  totalItemRepsone: number
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
  bidForm: 'Fixed_Price' | 'Secret_Auction' | 'Public_Auction' | 'Auction_Price_GraduallyReduced'
  time_Bidding: string | null
  artistId: number
  categoryId: number
  valuationId: number
  artist: Artist
  category: Category
  imageJewelries: ImageJewelry[]
  keyCharacteristicDetails: KeyCharacteristicDetail[]
  mainDiamonds: MainDiamond[]
  secondaryDiamonds: SecondaryDiamond[]
  mainShaphies: MainShaphy[]
  secondaryShaphies: SecondaryShaphy[]
  valuation: Valuation
  staffId?: number
  status: string
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
/////////////////////////////// update

// Interfaces for Images
export interface UpdateImageJewelryDTO {
  id: number
  imageLink: string
  title: string
  thumbnailImage: string
}

// Interfaces for Characteristics
export interface UpdateKeyCharacteristicDetailDTO {
  id: number
  description: string
  keyCharacteristicId: number
}

// Interfaces for Documents and Images
export interface UpdateDocumentDTO {
  id: number
  documentLink: string
  documentTitle: string
}

export interface UpdateImageDTO {
  id: number
  imageLink: string
}

// Interfaces for Diamonds
export interface UpdateMainDiamondDTO {
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
  updateDocumentMainDiamondDTOs: UpdateDocumentDTO[]
  updateImageMainDiamondDTOs: UpdateImageDTO[]
}

export interface UpdateSecondaryDiamondDTO
  extends Omit<UpdateMainDiamondDTO, 'updateDocumentMainDiamondDTOs' | 'updateImageMainDiamondDTOs'> {
  totalCarat: number
  updateDocumentSecondaryDiamondDTOs: UpdateDocumentDTO[]
  updateImageSecondaryDiamondDTOs: UpdateImageDTO[]
}

// Interfaces for Shaphies
export interface BaseShaphieDTO {
  id: number
  name: string
  color: string
  carat: number
  enhancementType: string
  quantity: number
  settingType: string
  dimension: string
}

export interface UpdateMainShaphieDTO extends BaseShaphieDTO {
  updateeDocumentMainShaphieDTOs: UpdateDocumentDTO[]
  updateImageMainShaphieDTOs: UpdateImageDTO[]
}

export interface UpdateSecondaryShaphieDTO extends BaseShaphieDTO {
  totalCarat: number
  updateDocumentSecondaryShaphieDTOs: UpdateDocumentDTO[]
  updateImageSecondaryShaphieDTOs: UpdateImageDTO[]
}

// Main Update Request Interface
export interface UpdateJewelryRequest {
  id: number
  name: string
  description: string
  estimatePriceMin: number
  estimatePriceMax: number
  startingPrice: number
  specificPrice: number
  videoLink: string
  forGender: string
  title: string
  bidForm: string
  time_Bidding: string
  artistId: number
  categoryId: number
  updateImageJewelryDTOs: UpdateImageJewelryDTO[]
  updateKeyCharacteristicDetailDTOs: UpdateKeyCharacteristicDetailDTO[]
  updateMainDiamondDTOs: UpdateMainDiamondDTO[]
  updateSecondaryDiamondDTOs: UpdateSecondaryDiamondDTO[]
  updateMainShaphieDTOs: UpdateMainShaphieDTO[]
  updateSecondaryShaphieDTOs: UpdateSecondaryShaphieDTO[]
}
