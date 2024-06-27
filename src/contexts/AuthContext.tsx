import { createContext, useCallback, useMemo, useState } from 'react'
import jwt from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode'
import { query } from '@/hooks/useFetch'
import { useLocalStorage } from 'usehooks-ts'
import { notification } from './GlobalContext'

interface IAuthContext {
  loading: boolean
  isAuthenticated?: boolean
  logIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext)

interface Props {
  children: React.ReactNode
}

function AuthProvider(props: Props) {
  const [loading, setLoading] = useState(true)
  const [token, setToken, removeToken] = useLocalStorage('jwt', '', {
    deserializer: (v) => v,
  })

  // check if token is valid and not expired
  const isAuthenticated = useMemo(() => {
    if (!token) return false
    const decoded = jwtDecode(token)
    if (!decoded) return false
    const exp = (decoded as jwt.JwtPayload).exp
    if (!exp) return false
    const now = Date.now() / 1000
    return now < exp
  }, [token])

  const logOut = useCallback(async () => {
    removeToken()
  }, [removeToken])

  const logIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      try {
        // type jwt
        const { token } = await query('login', {
          email,
          password,
        })
        setToken(token)
      } catch (error: unknown) {
        if (error instanceof Error) {
          notification.error({
            message: 'Error logging in:',
            description: error.message,
          })
        }
      }
      setLoading(false)
    },
    [notification, setToken],
  )

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        logIn,
        logOut,
        loading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
