import { createContext, useCallback, useMemo } from 'react'
import jwt from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode'
import { useMutation } from '@/hooks/useFetch'
import { useLocalStorage } from 'usehooks-ts'

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
  const [token, setToken, removeToken] = useLocalStorage('jwt', '', {
    deserializer: (value) => value,
    serializer: (value) => value,
  })
  const { mutate, loading } = useMutation('login')

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
      const { token } = await mutate({
        email,
        password,
      })
      setToken(token)
    },
    [setToken],
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
