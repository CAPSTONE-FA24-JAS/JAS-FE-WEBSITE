export interface Data {
  user: Account
  accessToken: string
  staffDTO?: {
    id: number
    firstName: string
    lastName: string
  }
}
export interface Account {
  id: number
  email: string
  gender: any
  passwordHash: string
  roleId: number
  roleName: string
  customerDTO: any
  staffDTO: StaffDto
}
export interface StaffDto {
  id: number
  firstName: string
  lastName: string
  profilePicture: string
  gender: string
  dateOfBirth: string
  accountDTO: any
}

export interface UserLoginRequest {
  email: string
  password: string
}
export interface UserLoginResponse {
  code: number
  message: string
  isSuccess: boolean
  data: Data
  errorMessages: any
}

export interface AdminGetListUser {
  code: number
  message: string
  isSuccess: boolean
  data: AdminGetListUserChildrenResponse[]
  errorMessages: any
}

export interface AdminGetListUserChildrenResponse {
  id: number
  firstName: string
  lastName: string
  profilePicture?: string
  email: string
  gender: string
  address: any
  passwordHash: string
  status: boolean
  phoneNumber?: string
  confirmationToken: string
  isConfirmed: boolean
  vnPayAccount: any
  vnPayBankCode: any
  vnPayAccountName: any
  roleId: number
  roleName: string
}
export interface AdminGetFilterByRole {
  code: number
  message: string
  isSuccess: boolean
  data: AdminGetFilterByRoleData[]
  errorMessages: any
}

export interface AdminGetFilterByRoleData {
  map: any
  id: number
  email: string
  gender: any
  passwordHash: string
  roleId: number
  roleName: string
  customerDTO: any
  staffDTO: AdminGetFilterByRoleChildrenResponse
}

export interface AdminGetFilterByRoleChildrenResponse {
  id: number
  firstName: string
  lastName: string
  profilePicture?: string
  gender: string
  dateOfBirth: string
  accountDTO: any
}

export interface CreateNewStaffForm {
  email: string
  passwordHash: string
  phoneNumber: string
  roleId: number
  createStaffDTO: CreateStaffDTO
}
export interface CreateStaffDTO {
  firstName: string
  lastName: string
  profilePicture: string
  gender: string
  dateOfBirth: string
}
////////////////////////////////////////////////////////////////////////////////////
// lấy dữ liệu từ local thì lấy bên đây theo kiểu này lười sửa ở trên đụng tùm tum k dám sửa =))))))
interface StaffDTO {
  id: number
  firstName: string
  lastName: string
  profilePicture: string
  gender: string
}

interface UserDTO {
  customerDTO: null // Assuming customerDTO can be null or an object
  email: string
  gender: string | null
  id: number
  passwordHash: string
  phoneNumber: string
  roleId: number
  roleName: string
  staffDTO: StaffDTO | null
  accountDTO: null
  dateOfBirth: string
  firstName: string
  lastName: string
  profilePicture: string
}

export interface AccessTokenResponse {
  accessToken: string
  user: UserDTO
}

interface WalletDTO {
  id: number
  balance: number
  availableBalance: number
  frozenBalance: number | null
  customerDTO: null
}

interface CustomerDTO {
  id: number
  firstName: string
  lastName: string
  profilePicture: string
  gender: string | null
  dateOfBirth: string | null
  address: string | null
  citizenIdentificationCard: string | null
  idIssuanceDate: string | null
  idExpirationDate: string | null
  priceLimit: number | null
  expireDate: string | null
  walletId: number | null
  walletDTO: WalletDTO | null
  accountDTO: null
}

interface StaffDTO {
  id: number
  firstName: string
  lastName: string
  profilePicture: string
  gender: string
  dateOfBirth: string
  accountDTO: null
}

export interface AccountData {
  id: number
  email: string
  phoneNumber: string
  gender: string | null
  passwordHash: string
  roleId: number
  roleName: 'Customer' | 'Manager' | 'Staff' | 'Appraiser' | 'Admin' | 'Shipper'
  customerDTO: CustomerDTO | null
  staffDTO: StaffDTO | null
}
