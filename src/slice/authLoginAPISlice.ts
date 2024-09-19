import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Data } from '../types/Account.type'
import { jwtDecode } from 'jwt-decode'

export enum RoleType {
  CUSTOMER = '1',
  ADMIN = '2',
  STAFFC = '3',
  GUEST = '4'
}

export interface DecodedToken {
  Id: string
  email: string
  [key: string]: any
}

interface AuthLoginAPIState {
  account: Data | null
  isAuthenticated: boolean
  id: string | null
  roleId: RoleType
}

const initialState: AuthLoginAPIState = {
  account: null,
  isAuthenticated: false,
  id: null,
  roleId: RoleType.GUEST
}

const authLoginAPISlice = createSlice({
  name: 'authLoginAPI',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Data>) => {
      const decodedToken = jwtDecode(action.payload.accessToken) as DecodedToken

      const roleFromToken = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

      const mappedRole = Object.values(RoleType).includes(roleFromToken) ? roleFromToken : RoleType.GUEST

      state.account = action.payload
      state.isAuthenticated = true
      state.id = decodedToken.Id
      state.roleId = mappedRole as RoleType
    },
    logoutUser: (state) => {
      state.account = null
      state.isAuthenticated = false
      state.id = null
      state.roleId = RoleType.GUEST
    }
  }
})

export const { setUser, logoutUser } = authLoginAPISlice.actions
export default authLoginAPISlice.reducer
