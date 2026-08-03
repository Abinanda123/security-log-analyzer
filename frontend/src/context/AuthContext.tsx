import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface AuthContextType {
  token: string | null
  userEmail: string | null
  login: (token: string, email: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem('userEmail')
  )

  const login = (newToken: string, email: string) => {
    setToken(newToken)
    setUserEmail(email)
    localStorage.setItem('token', newToken)
    localStorage.setItem('userEmail', email)
  }

  const logout = () => {
    setToken(null)
    setUserEmail(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
  }

  return (
    <AuthContext.Provider
      value={{ token, userEmail, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}