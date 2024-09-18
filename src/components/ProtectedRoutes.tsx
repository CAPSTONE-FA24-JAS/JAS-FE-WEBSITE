import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { RoleType } from '../slice/authLoginAPISlice'
import { RootState } from '../store'

interface ProtectedRoutesProps {
  children: React.ReactNode
  allowedRoles: RoleType[]
  redirectPath: string
}

export default function ProtectedRoutes({ children, allowedRoles, redirectPath }: ProtectedRoutesProps) {
  const role = useSelector((state: RootState) => state.authLoginAPI.role)
  console.log('role', role)
  if (!allowedRoles.includes(role)) {
    if (role === RoleType.CUSTOMER) {
      return <Navigate to={redirectPath} />
    } else if (role === RoleType.ADMIN) {
      return <Navigate to='/admin' />
    } else if (role === RoleType.STAFFC) {
      return <Navigate to='/*' />
    } else if (role === RoleType.STAFFA) {
      return <Navigate to='/*' />
    } else {
      return <Navigate to='/*' />
    }
  }
  return <div>{children}</div>
}
