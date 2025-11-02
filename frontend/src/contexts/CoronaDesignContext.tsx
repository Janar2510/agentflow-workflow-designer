import React, { createContext, useContext, ReactNode } from 'react'

// Corona Admin Design System - Clean & Simple
export interface CoronaColors {
  primary: string
  secondary: string
  success: string
  danger: string
  warning: string
  info: string
  light: string
  dark: string
  white: string
  black: string
  // Text colors
  textPrimary: string
  textSecondary: string
  textMuted: string
  textInverse: string
  // Background colors
  bgPrimary: string
  bgSecondary: string
  bgTertiary: string
  // Border colors
  borderPrimary: string
  borderSecondary: string
}

export interface CoronaTypography {
  fontFamily: string
  sizes: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
  }
  weights: {
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
  }
}

export interface CoronaSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

export interface CoronaDesignSystem {
  colors: CoronaColors
  typography: CoronaTypography
  spacing: CoronaSpacing
  // Utility functions
  getColor: (color: keyof CoronaColors) => string
  getSpacing: (size: keyof CoronaSpacing) => string
  getTypography: (size: keyof CoronaTypography['sizes']) => string
  getWeight: (weight: keyof CoronaTypography['weights']) => number
}

// Corona Admin Design Tokens - Dark Theme
const coronaColors: CoronaColors = {
  // Bootstrap-based color palette
  primary: '#007AFF',
  secondary: '#6c757d',
  success: '#00FF87',
  danger: '#FF3B30',
  warning: '#FFB800',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  black: '#000000',
  
  // Text colors - Dark theme
  textPrimary: '#ffffff',
  textSecondary: '#a0a9c0',
  textMuted: '#6c757d',
  textInverse: '#000000',
  
  // Background colors - Dark theme
  bgPrimary: '#0f0f1c',
  bgSecondary: '#1a1a2e',
  bgTertiary: '#2a2a3e',
  // Card backgrounds with better contrast
  cardBg: '#2a2a3e',
  cardBgHover: '#3a3a4e',
  
  // Border colors - Dark theme
  borderPrimary: 'rgba(255, 255, 255, 0.1)',
  borderSecondary: 'rgba(255, 255, 255, 0.2)',
}

const coronaTypography: CoronaTypography = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }
}

const coronaSpacing: CoronaSpacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '3rem',      // 48px
  '2xl': '4rem',   // 64px
}

// Design System Context
const CoronaDesignContext = createContext<CoronaDesignSystem | undefined>(undefined)

// Provider Component
export const CoronaDesignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const designSystem: CoronaDesignSystem = {
    colors: coronaColors,
    typography: coronaTypography,
    spacing: coronaSpacing,
    
    // Utility functions
    getColor: (color: keyof CoronaColors) => coronaColors[color],
    getSpacing: (size: keyof CoronaSpacing) => coronaSpacing[size],
    getTypography: (size: keyof CoronaTypography['sizes']) => coronaTypography.sizes[size],
    getWeight: (weight: keyof CoronaTypography['weights']) => coronaTypography.weights[weight],
  }

  return (
    <CoronaDesignContext.Provider value={designSystem}>
      {children}
    </CoronaDesignContext.Provider>
  )
}

// Hook to use design system
export const useCoronaDesign = (): CoronaDesignSystem => {
  const context = useContext(CoronaDesignContext)
  if (!context) {
    throw new Error('useCoronaDesign must be used within a CoronaDesignProvider')
  }
  return context
}

export default CoronaDesignProvider
