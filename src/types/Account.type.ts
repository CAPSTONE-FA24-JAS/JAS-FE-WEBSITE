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
  data: AdminGetFilterByRoleData
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
