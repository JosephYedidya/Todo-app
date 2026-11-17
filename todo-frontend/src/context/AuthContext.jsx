
import { createContext, useContext, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token')
  })

  // Inscription
  const register = async (userData) => {
    return await authService.register(userData)
  }

  // Connexion
  const login = async (credentials) => {
    const data = await authService.login(credentials)

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    setToken(data.token)
    setUser(data.user)

    return data
  }

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    register,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personnalisé
export const useAuth = () => {
  return useContext(AuthContext)
}
