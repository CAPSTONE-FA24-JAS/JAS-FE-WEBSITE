import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Data } from '../types/Account.type'
import baseUrl from '../utils/http'

interface Category {
  id: number
  name: string
}

interface Artist {
  id: number
  name: string
}

interface CategoriesResponse {
  code: number
  message: string
  isSuccess: boolean
  data: Category[]
  errorMessages: string | null
}

interface ArtistsResponse {
  code: number
  message: string
  isSuccess: boolean
  data: Artist[] // Specify that 'data' is an array of Artist
  errorMessages: string | null
}

interface CreateCategoryResponse {
  code: number
  message: string
  isSuccess: boolean
  data: Category // The created category
  errorMessages: string | null
}

interface CreateArtistResponse {
  code: number
  message: string
  isSuccess: boolean
  data: Artist // The created artist
  errorMessages: string | null
}

interface CreateCategoryRequest {
  name: string // Define the structure of the request payload
}

interface CreateArtistRequest {
  name: string // Define the structure of the request payload for creating an artist
}

interface Blog {
  id: number
  title: string
  content: string
  date: string
}

interface BlogsResponse {
  code: number
  message: string
  isSuccess: boolean
  data: Blog[] // Specify that 'data' is an array of Blog
  errorMessages: string | null
}

interface TopJewelryAuction {
  id: number
  name: string
  price: number
  imageUrl: string
  description: string
}

interface TopJewelryAuctionsResponse {
  code: number
  message: string
  isSuccess: boolean
  data: TopJewelryAuction[]
  errorMessages: string | null
}

interface AccountDTO {
  id: number
  email: string
  phoneNumber: string
  roleId: number
  roleName: string
}

interface CustomerDTO {
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
  walletDTO: {
    id: number
    balance: number | null
    availableBalance: number | null
  }
  accountDTO: AccountDTO
}

interface TopSeller {
  customerDTO: CustomerDTO
  totalSellerValuation: number
}

interface TopSellersResponse {
  code: number
  message: string
  isSuccess: boolean
  data: TopSeller[] // Array of TopSeller data
  errorMessages: string | null
}

export const manageotherApi = createApi({
  reducerPath: 'manageotherApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const user = localStorage.getItem('userLogin')
      if (user) {
        const userData = JSON.parse(user) as Data
        const token = userData ? userData.accessToken : ''
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    viewCategories: build.query<CategoriesResponse, void>({
      query: () => 'Categories/ViewCategories'
    }),
    createCategory: build.mutation<CreateCategoryResponse, CreateCategoryRequest>({
      query: (newCategory) => ({
        url: 'Categories/CreateCategory',
        method: 'POST',
        body: newCategory
      })
    }),
    viewArtists: build.query<ArtistsResponse, void>({
      query: () => 'Artists/ViewArtists'
    }),
    createArtist: build.mutation<CreateArtistResponse, CreateArtistRequest>({
      query: (newArtist) => ({
        url: 'Artists/CreateArtist',
        method: 'POST',
        body: newArtist
      })
    }),
    viewBlogs: build.query<BlogsResponse, void>({
      query: () => 'Blog/ViewListBlog'
    }),
    viewBlogDetail: build.query({
      query: (blogId) => `Blog/ViewDetailBlog?blogId=${blogId}`
    }),
    viewTopJewelryAuctions: build.query<TopJewelryAuctionsResponse, void>({
      query: () => 'DashBoard/TopFiveJewelryAuctions'
    }),
    // New endpoint for Top Five Sellers
    viewTopSellers: build.query<TopSellersResponse, void>({
      query: () => 'DashBoard/TopFiveSellers'
    })
  })
})

export const {
  useViewCategoriesQuery,
  useCreateCategoryMutation,
  useViewArtistsQuery,
  useCreateArtistMutation,
  useViewBlogsQuery,
  useViewBlogDetailQuery,
  useViewTopJewelryAuctionsQuery,
  useViewTopSellersQuery // Export the hook for Top Sellers
} = manageotherApi
