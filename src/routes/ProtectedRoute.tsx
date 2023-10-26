import React, { useContext, useEffect } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Spin } from 'antd'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      navigate('/games')
    }
  }, [auth.isAuthenticated, auth.loading, navigate])

  return auth.isAuthenticated ? <>{children}</> : <Spin spinning />
}

export default ProtectedRoute
