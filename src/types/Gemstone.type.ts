export interface GemstoneData {
  type: 'Diamond' | 'Sapphire'
  shape: string
  cut: string
  quantity: number
  certificate: string
  fluorescence: string
  color: string
  dimension: string
  lengthWidthRatio: string
  settingType: string
  clarity: string
  carat: string
  enhancementType?: string // Optional for Sapphire only
  documentDiamonds: string
  documentShaphies: string
  isVisible?: boolean // Include this if necessary
  secondGemstone?: SecondGemstoneData // Add this line for the second gemstone
}

export interface SecondGemstoneData {
  type?: string
  color?: string
  cut?: string
  quantity?: number
  clarity?: string
  settingType?: string
  dimensions?: string
  shape?: string
  certificate?: string
  fluorescence?: string
  enhancementType?: string
  totalCarat?: number
  secondColor?: string
  secondCut?: string
  secondQuantity?: number
  secondClarity?: string
  secondSettingType?: string
  secondDimensions?: string
  secondShape?: string
  secondCertificate?: string
  secondFluorescence?: string
  [key: string]: any // This allows indexing with any string key
}

export interface GemstoneFormData {
  customerName: string
  jewelryName: string
  category: string
  forGender: string
  artist: string
  EstimatePriceMin: number // Changed from totalReplacementCost to EstimatePriceMin
  EstimatePriceMax: number // New field for maximum estimated price
  SpecificPrice: number // New field for specific price
  videoLink: string
  image: File | null
}
