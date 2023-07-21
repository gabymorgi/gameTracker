import { App } from 'antd'
import React, { useCallback } from 'react'

export interface IAuthContext {
  loading: boolean
  isAuthenticated?: boolean
  createUser: (email: string, password: string) => Promise<void>
  logIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
}

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext,
)

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notification } = App.useApp();
  // const [user, setUser] = useState<User | null>()
  // const [loading, setLoading] = useState(true)
  // onAuthStateChanged(auth, (currentUser) => {
  //   setLoading(false)
  //   setUser(currentUser)
  // })

  const createUser = useCallback(
    async (email: string, password: string) => {
      try {
        console.log('createUser', email, password)
        // await createUserWithEmailAndPassword(auth, email, password)
      } catch (error: any) {
        notification.error({
          message: 'Error creating user:',
          description: error.message
        })
      }
    },
    [],
  )

  const logOut = useCallback(async () => {
    try {
      // await signOut(auth)
    } catch (error: any) {
      notification.error({
        message: 'Error logging out:',
        description: error.message
      })
    }
  }, [])

  const logIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('logIn', email, password)
      // await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      notification.error({
        message: 'Error logging in:',
        description: error.message
      })
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: true, // !!user,
        createUser,
        logIn,
        logOut,
        loading: false, // loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
