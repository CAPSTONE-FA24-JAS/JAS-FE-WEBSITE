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
      query: () => 'Categories/ViewCategories' // Relative URL
    }),
    createCategory: build.mutation<CreateCategoryResponse, CreateCategoryRequest>({
      query: (newCategory) => ({
        url: 'Categories/CreateCategory', // Relative URL
        method: 'POST',
        body: newCategory // The payload containing the category name
      })
    }),
    viewArtists: build.query<ArtistsResponse, void>({
      query: () => 'Artists/ViewArtists' // Relative URL to view artists
    }),
    createArtist: build.mutation<CreateArtistResponse, CreateArtistRequest>({
      query: (newArtist) => ({
        url: 'Artists/CreateArtist', // Assuming a relative URL for creating an artist
        method: 'POST',
        body: newArtist // The payload containing the artist name
      })
    })
  })
})

// Export the hooks to use these queries and mutations
export const { useViewCategoriesQuery, useCreateCategoryMutation, useViewArtistsQuery, useCreateArtistMutation } =
  manageotherApi
