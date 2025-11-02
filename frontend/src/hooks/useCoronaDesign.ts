import { useCoronaDesign as useCoronaDesignContext } from '../contexts/CoronaDesignContext'

// Simple hook for easy access to Corona Admin design system
export const useCoronaDesign = () => {
  const design = useCoronaDesignContext()
  
  return {
    // Colors
    colors: design.colors,
    
    // Typography
    typography: design.typography,
    
    // Spacing
    spacing: design.spacing,
    
    // Utility functions
    getColor: design.getColor,
    getSpacing: design.getSpacing,
    getTypography: design.getTypography,
    getWeight: design.getWeight,
    
    // Common style helpers
    card: () => ({
      backgroundColor: design.colors.bgPrimary,
      borderRadius: '0.375rem',
      padding: design.spacing.md,
      border: `1px solid ${design.colors.borderPrimary}`,
      boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
    }),
    
    button: (variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' = 'primary') => ({
      fontFamily: design.typography.fontFamily,
      fontWeight: design.typography.weights.medium,
      borderRadius: '0.375rem',
      padding: `${design.spacing.sm} ${design.spacing.md}`,
      fontSize: design.typography.sizes.base,
      backgroundColor: design.getColor(variant),
      color: design.colors.white,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.15s ease-in-out',
    }),
    
    text: (variant: 'heading' | 'body' | 'caption' = 'body') => ({
      fontFamily: design.typography.fontFamily,
      ...(variant === 'heading' && {
        fontSize: design.typography.sizes['2xl'],
        fontWeight: design.typography.weights.bold,
        color: design.colors.textPrimary,
      }),
      ...(variant === 'body' && {
        fontSize: design.typography.sizes.base,
        fontWeight: design.typography.weights.normal,
        color: design.colors.textPrimary,
      }),
      ...(variant === 'caption' && {
        fontSize: design.typography.sizes.sm,
        fontWeight: design.typography.weights.normal,
        color: design.colors.textSecondary,
      }),
    })
  }
}

export default useCoronaDesign








