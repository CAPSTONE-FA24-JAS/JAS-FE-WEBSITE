import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import { Data, UserLoginResponse } from '../types/Account.type'

export enum RoleType {
  ADMIN = '2',
  STAFF = '3',
  STAFFC = '4',
  MANAGER = '5',
  GUEST = '1'
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
  role: RoleType.GUEST
}

const authLoginAPISlice = createSlice({
  name: 'authLoginAPI',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Data>) => {
      const decodedToken = jwtDecode(action.payload.accessToken) as DecodedToken
      console.log('decodedToken', decodedToken) // Kiểm tra decoded token
      console.log('UserLoginResponse', action.payload) // Kiểm tra response

      // Lấy role từ token với key "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      const roleFromToken = decodedToken[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] as keyof typeof RoleType

      state.account = action.payload
      state.isAuthenticated = true
      state.role = RoleType[roleFromToken] || RoleType.GUEST
    },
    logoutUser: (state) => {
      state.account = null
      state.isAuthenticated = false
      state.role = RoleType.GUEST
    }
  }
})

export const { setUser, logoutUser } = authLoginAPISlice.actions
export default authLoginAPISlice.reducer
