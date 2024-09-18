export interface Account {
  firstName: string
  lastName: string
  profilePicture: any
  email: string
  gender: string
  address: any
  passwordHash: string
  status: boolean
  phoneNumber: string
  confirmationToken: string
  isConfirmed: boolean
  vnPayAccount: any
  vnPayBankCode: any
  vnPayAccountName: any
  roleId: number
  roleName: any
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
export interface Data {
  account: Account
  accessToken: string
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
  data: AdminGetFilterByRoleChildrenResponse[]
  errorMessages: any
}

export interface AdminGetFilterByRoleChildrenResponse {
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
