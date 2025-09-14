import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '../types'
import { authApi } from '../lib/api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  
  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        token: null,
        
        setUser: (user) => 
          set({ 
            user, 
            isAuthenticated: !!user 
          }, false, 'setUser'),
        
        setToken: (token) => 
          set({ token }, false, 'setToken'),
        
        setLoading: (loading) => 
          set({ isLoading: loading }, false, 'setLoading'),
        
        login: async (email, password) => {
          try {
            set({ isLoading: true }, false, 'login/start')
            
            const response = await authApi.login({ email, password })
            
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false
            }, false, 'login/success')
            
          } catch (error) {
            set({ isLoading: false }, false, 'login/error')
            throw error
          }
        },
        
        register: async (email, password, username) => {
          try {
            set({ isLoading: true }, false, 'register/start')
            
            const response = await authApi.register({ 
              email, 
              password, 
              username,
              full_name: username
            })
            
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false
            }, false, 'register/success')
            
          } catch (error) {
            set({ isLoading: false }, false, 'register/error')
            throw error
          }
        },
        
        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          }, false, 'logout')
          
          // Clear any stored tokens
          localStorage.removeItem('agentflow-auth-storage')
        },
        
        refreshToken: async () => {
          try {
            const { token } = get()
            if (!token) return
            
            const response = await authApi.refreshToken(token)
            
            set({
              token: response.token,
              user: response.user
            }, false, 'refreshToken/success')
            
          } catch (error) {
            // If refresh fails, logout user
            get().logout()
            throw error
          }
        },
        
        updateProfile: async (updates) => {
          try {
            const { user } = get()
            if (!user) throw new Error('No user logged in')
            
            const updatedUser = await authApi.updateProfile(updates)
            
            set({
              user: updatedUser
            }, false, 'updateProfile/success')
            
          } catch (error) {
            throw error
          }
        },
        
        checkAuth: async () => {
          try {
            set({ isLoading: true }, false, 'checkAuth/start')
            
            const token = localStorage.getItem('agentflow-auth-storage')
            if (!token) {
              set({ isLoading: false }, false, 'checkAuth/no-token')
              return
            }
            
            // Parse the stored token
            const parsed = JSON.parse(token)
            const storedToken = parsed.state?.token
            
            if (!storedToken) {
              set({ isLoading: false }, false, 'checkAuth/no-stored-token')
              return
            }
            
            // Verify token with backend
            const response = await authApi.verifyToken(storedToken)
            
            set({
              user: response.user,
              token: storedToken,
              isAuthenticated: true,
              isLoading: false
            }, false, 'checkAuth/success')
            
          } catch (error) {
            // Token is invalid, clear auth state
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false
            }, false, 'checkAuth/error')
          }
        }
      }),
      {
        name: 'agentflow-auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
)
