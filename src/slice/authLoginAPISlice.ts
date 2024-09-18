import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import { Data, UserLoginResponse } from '../types/Account.type'

export enum RoleType {
  CUSTOMER = '1',
  ADMIN = '2',
  STAFFC = '3',
  STAFFA = '4'
}

// Define type for the decoded token
export interface DecodedToken {
  email: string
  exp: number
  iss: string
  aud: string
  [key: string]: any // Cho phép các thuộc tính động
}

interface AuthLoginAPIState {
  account: Data | null
  isAuthenticated: boolean
  userId: string | null
  role: RoleType
}

const initialState: AuthLoginAPIState = {
  account: null,
  isAuthenticated: false,
  userId: null,
  role: RoleType.CUSTOMER
}

const authLoginAPISlice = createSlice({
  name: 'authLoginAPI',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Data>) => {
      const decodedToken = jwtDecode(action.payload.accessToken) as DecodedToken
      console.log('decodedToken', decodedToken) // Kiểm tra decoded token
      console.log('UserLoginResponse', action.payload) // Kiểm tra response

      const roleFromToken = decodedToken[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] as keyof typeof RoleType

      state.account = action.payload
      state.isAuthenticated = true
      state.role = RoleType[roleFromToken] || RoleType.CUSTOMER
    },
    logoutUser: (state) => {
      state.account = null
      state.isAuthenticated = false
      state.role = RoleType.CUSTOMER
    }
  }
})

export const { setUser, logoutUser } = authLoginAPISlice.actions
export default authLoginAPISlice.reducer
