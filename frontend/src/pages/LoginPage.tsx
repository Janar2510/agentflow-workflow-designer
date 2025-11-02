import React, { useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowLeft, Bot } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import './AuthPage.css'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginPage: React.FC = () => {
  const design = useCoronaDesign()
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error('Invalid credentials. Please try again.')
    }
  }

  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    button.style.setProperty('--mouse-x', `${x}%`)
    button.style.setProperty('--mouse-y', `${y}%`)
  }

  const handleButtonMouseLeave = () => {
    const button = buttonRef.current
    if (!button) return
    button.style.setProperty('--mouse-x', '50%')
    button.style.setProperty('--mouse-y', '50%')
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Back to home link */}
        <Link to="/" className="auth-back-link">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Logo and title */}
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="auth-logo-text">
              <h1>AgentFlow</h1>
              <p>Visual AI Workflows</p>
            </div>
          </div>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your account to continue building</p>
        </div>

        {/* Login form */}
        <div className="auth-card">
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label">Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="auth-input"
                {...register('email')}
              />
              {errors.email && (
                <p className="auth-error">{errors.email.message}</p>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="auth-input"
                  style={{ paddingRight: '48px' }}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-input-icon"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="auth-error">{errors.password.message}</p>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="auth-checkbox-group">
                <input
                  type="checkbox"
                  className="auth-checkbox"
                />
                <span className="auth-checkbox-label">Remember me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="auth-link"
                style={{ fontSize: '14px' }}
              >
                Forgot your password?
              </Link>
            </div>

            <button
              ref={buttonRef}
              type="submit"
              className="auth-button auth-button-primary auth-button-flashlight"
              disabled={isLoading}
              onMouseMove={handleButtonMouseMove}
              onMouseLeave={handleButtonMouseLeave}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="auth-divider">
              <span className="auth-divider-text">Or continue with</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button type="button" className="auth-button auth-button-outline">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button type="button" className="auth-button auth-button-outline">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </button>
            </div>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link" style={{ fontWeight: '600' }}>
                  Sign up for free
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage