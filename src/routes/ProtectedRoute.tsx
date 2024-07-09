import React, { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { Spin } from 'antd'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useContext(AuthContext)

  return auth.isAuthenticated ? (
    <>{children}</>
  ) : auth.loading ? (
    <Spin spinning fullscreen />
  ) : (
    <Navigate to="/games" />
  )
}

export default ProtectedRoute
