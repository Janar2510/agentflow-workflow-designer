import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { setupApiClient } from '../lib/api'

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    checkAuth,
    setLoading
  } = useAuthStore()

  // Set up API client with token
  useEffect(() => {
    setupApiClient(token)
  }, [token])

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Set up token refresh interval
  useEffect(() => {
    if (!isAuthenticated || !token) return

    const interval = setInterval(() => {
      refreshToken().catch(() => {
        // If refresh fails, logout user
        logout()
      })
    }, 15 * 60 * 1000) // Refresh every 15 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated, token, refreshToken, logout])

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    setLoading
  }
}
