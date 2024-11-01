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
  const roleId = useSelector((state: RootState) => state.authLoginAPI.roleId)

  console.log('Role in ProtectedRoutes:', roleId)

  if (roleId === RoleType.GUEST && !allowedRoles.includes(RoleType.GUEST)) {
    return <Navigate to={redirectPath} />
  }

  if (!allowedRoles.includes(roleId)) {
    if (roleId === RoleType.MANAGER) {
      return <Navigate to='/manager/transaction' />
    }
    if (roleId === RoleType.STAFFC) {
      return <Navigate to='/staff/ConsignList' />
    }
    if (roleId === RoleType.APPRAISER) {
      return <Navigate to='/appraiser/requestConsign' />
    }
    if (roleId === RoleType.ADMIN) {
      return <Navigate to='/admin/overview' />
    }
    if (!roleId) {
      return <Navigate to='/' />
    }
  }

  return <div>{children}</div>
}
