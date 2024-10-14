import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Data } from '../types/Account.type'
import { jwtDecode } from 'jwt-decode'

// Define the roles in the system
export enum RoleType {
  CUSTOMER = '1',
  MANAGER = '2',
  STAFFC = '3',
  APPRAISER = '4',
  ADMIN = '5',
  GUEST = '6'
}

// Define the structure of the decoded JWT token
export interface DecodedToken {
  Id: string
  email: string
  [key: string]: any
}

// Define the shape of the AuthLoginAPI state
interface AuthLoginAPIState {
  account: Data | null
  isAuthenticated: boolean
  id: string | null
  roleId: RoleType
  staffId: number | null // Track staffId for Staff roles
  appraiserId: number | null
}

// Initialize the default state for authentication
const initialState: AuthLoginAPIState = {
  account: null,
  isAuthenticated: false,
  id: null,
  roleId: RoleType.GUEST,
  staffId: null,
  appraiserId: null
}

// Create a slice for the AuthLoginAPI
const authLoginAPISlice = createSlice({
  name: 'authLoginAPI',
  initialState,
  reducers: {
    // Action to set user data and authentication status
    setUser: (state, action: PayloadAction<Data>) => {
      const decodedToken = jwtDecode(action.payload.accessToken) as DecodedToken

      const roleFromToken = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      const mappedRole = Object.values(RoleType).includes(roleFromToken) ? roleFromToken : RoleType.GUEST

      // Debugging the full payload structure
      console.log('Full Account Payload:', action.payload)

      state.account = action.payload
      state.isAuthenticated = true
      state.id = decodedToken.Id
      state.roleId = mappedRole as RoleType

      // Access staffDTO from user
      const user = action.payload.user // Get the user object
      if (user && user.staffDTO) {
        state.staffId = user.staffDTO.id // Access staffDTO id
      } else {
        console.warn('staffDTO is missing in the payload')
        state.staffId = null // Set to null if staffDTO is missing
      }

      console.log('Staff ID from Redux:', state.staffId) // Log for debugging
    },

    // Action to log out the user and reset the state
    logoutUser: (state) => {
      state.account = null
      state.isAuthenticated = false
      state.id = null
      state.roleId = RoleType.GUEST
      state.staffId = null // Reset staffId on logout
    }
  }
})

// Export the actions and reducer
export const { setUser, logoutUser } = authLoginAPISlice.actions
export default authLoginAPISlice.reducer

// Sample usage for dispatching
/*
import { useDispatch } from 'react-redux'
import { setUser } from './authLoginAPISlice'

const dispatch = useDispatch();
const userData = await loginUser(credentials); // This is your login function that returns user data

console.log("Dispatching setUser action with:", userData);
dispatch(setUser(userData));
*/
