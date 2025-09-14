import React, { createContext, useContext, ReactNode } from 'react';

// AgentFlow Design System Types
export interface AgentFlowColors {
  // Background Colors
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgGlass: string;
  bgGlassLight: string;
  bgGlassStrong: string;
  
  // Gradient Colors
  gradientPrimary: string;
  gradientSecondary: string;
  gradientAccent: string;
  
  // UI Element Colors
  accentPrimary: string;
  accentSuccess: string;
  accentWarning: string;
  accentDanger: string;
  accentPurple: string;
  
  // Text Colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  
  // Border Colors
  borderPrimary: string;
  borderAccent: string;
  borderGlass: string;
}

export interface AgentFlowTypography {
  fontPrimary: string;
  textXs: string;
  textSm: string;
  textBase: string;
  textLg: string;
  textXl: string;
  text2xl: string;
  text3xl: string;
  text4xl: string;
  fontLight: number;
  fontNormal: number;
  fontMedium: number;
  fontSemibold: number;
  fontBold: number;
}

export interface AgentFlowSpacing {
  space1: string;
  space2: string;
  space3: string;
  space4: string;
  space5: string;
  space6: string;
  space8: string;
  space10: string;
  space12: string;
  space16: string;
  space20: string;
  cardPaddingSm: string;
  cardPaddingMd: string;
  cardPaddingLg: string;
  cardGap: string;
}

export interface AgentFlowRadius {
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  radius2xl: string;
  radiusFull: string;
}

export interface AgentFlowShadows {
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  shadowGlow: string;
}

export interface AgentFlowTransitions {
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
}

export interface AgentFlowDesignSystem {
  colors: AgentFlowColors;
  typography: AgentFlowTypography;
  spacing: AgentFlowSpacing;
  radius: AgentFlowRadius;
  shadows: AgentFlowShadows;
  transitions: AgentFlowTransitions;
}

// AgentFlow Design System Configuration
const agentFlowDesignSystem: AgentFlowDesignSystem = {
  colors: {
    // Background Colors
    bgPrimary: '#0f0f1c',          // Deep space blue - main background
    bgSecondary: '#1a1a2e',        // Dark slate - card backgrounds
    bgTertiary: '#16213e',         // Midnight blue - elevated surfaces
    bgGlass: 'rgba(26, 26, 46, 0.8)', // Glassmorphism overlay
    bgGlassLight: 'rgba(26, 26, 46, 0.6)', // Light glass effect
    bgGlassStrong: 'rgba(26, 26, 46, 0.9)', // Strong glass effect
    
    // Gradient Colors (from border animation)
    gradientPrimary: '#6366f1',    // Electric purple
    gradientSecondary: '#3b82f6',  // Electric blue
    gradientAccent: '#8b5cf6',     // Violet accent
    
    // UI Element Colors
    accentPrimary: '#007AFF',      // Electric Blue - primary actions
    accentSuccess: '#00FF87',      // Neon Green - success states
    accentWarning: '#FFB800',      // Amber - warnings
    accentDanger: '#FF3B30',       // Electric Red - errors
    accentPurple: '#8B5CF6',       // Purple - special features
    
    // Text Colors
    textPrimary: '#ffffff',        // Pure white - headings
    textSecondary: '#a0a9c0',      // Light gray - body text
    textMuted: '#6b7280',          // Muted gray - captions
    textInverse: '#0f0f1c',        // Dark text on light backgrounds
    
    // Border & Divider Colors
    borderPrimary: '#374151',      // Subtle borders
    borderAccent: '#4f46e5',       // Accent borders
    borderGlass: 'rgba(255, 255, 255, 0.1)', // Glass effect borders
  },
  
  typography: {
    fontPrimary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    textXs: '0.75rem',    // 12px
    textSm: '0.875rem',   // 14px
    textBase: '1rem',     // 16px
    textLg: '1.125rem',   // 18px
    textXl: '1.25rem',    // 20px
    text2xl: '1.5rem',    // 24px
    text3xl: '1.875rem',  // 30px
    text4xl: '2.25rem',   // 36px
    fontLight: 300,
    fontNormal: 400,
    fontMedium: 500,
    fontSemibold: 600,
    fontBold: 700,
  },
  
  spacing: {
    // Base spacing unit: 4px
    space1: '0.25rem',   // 4px
    space2: '0.5rem',    // 8px
    space3: '0.75rem',   // 12px
    space4: '1rem',      // 16px
    space5: '1.25rem',   // 20px
    space6: '1.5rem',    // 24px
    space8: '2rem',      // 32px
    space10: '2.5rem',   // 40px
    space12: '3rem',     // 48px
    space16: '4rem',     // 64px
    space20: '5rem',     // 80px
    
    // Card spacing (5-15px range as requested)
    cardPaddingSm: '0.5rem',   // 8px
    cardPaddingMd: '0.75rem',  // 12px
    cardPaddingLg: '1rem',     // 16px
    cardGap: '0.75rem',        // 12px between cards
  },
  
  radius: {
    radiusSm: '0.25rem',    // 4px
    radiusMd: '0.5rem',     // 8px
    radiusLg: '0.75rem',    // 12px
    radiusXl: '1rem',       // 16px
    radius2xl: '1.25rem',   // 20px
    radiusFull: '9999px',   // Full radius
  },

  shadows: {
    shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    shadowGlow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },

  transitions: {
    transitionFast: '0.15s ease',
    transitionNormal: '0.2s ease',
    transitionSlow: '0.3s ease',
  },
};

// AgentFlow Design Context
interface AgentFlowDesignContextType {
  design: AgentFlowDesignSystem;
  getCSSVariable: (category: keyof AgentFlowDesignSystem, key: string) => string;
  getColor: (color: keyof AgentFlowColors) => string;
  getSpacing: (space: keyof AgentFlowSpacing) => string;
  getTypography: (typography: keyof AgentFlowTypography) => string;
  getRadius: (radius: keyof AgentFlowRadius) => string;
  getShadow: (shadow: keyof AgentFlowShadows) => string;
  getTransition: (transition: keyof AgentFlowTransitions) => string;
}

const AgentFlowDesignContext = createContext<AgentFlowDesignContextType | undefined>(undefined);

// AgentFlow Design Provider Component
export const AgentFlowDesignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getCSSVariable = (category: keyof AgentFlowDesignSystem, key: string): string => {
    return `var(--af-${category}-${key})`;
  };

  const getColor = (color: keyof AgentFlowColors): string => {
    return `var(--af-${color})`;
  };

  const getSpacing = (space: keyof AgentFlowSpacing): string => {
    return `var(--af-${space})`;
  };

  const getTypography = (typography: keyof AgentFlowTypography): string => {
    return `var(--af-${typography})`;
  };

  const getRadius = (radius: keyof AgentFlowRadius): string => {
    return `var(--af-${radius})`;
  };

  const getShadow = (shadow: keyof AgentFlowShadows): string => {
    return `var(--af-${shadow})`;
  };

  const getTransition = (transition: keyof AgentFlowTransitions): string => {
    return `var(--af-${transition})`;
  };

  const value: AgentFlowDesignContextType = {
    design: agentFlowDesignSystem,
    getCSSVariable,
    getColor,
    getSpacing,
    getTypography,
    getRadius,
    getShadow,
    getTransition,
  };

  return (
    <AgentFlowDesignContext.Provider value={value}>
      {children}
    </AgentFlowDesignContext.Provider>
  );
};

// Custom hook to use AgentFlow design system
export const useAgentFlowDesign = (): AgentFlowDesignContextType => {
  const context = useContext(AgentFlowDesignContext);
  if (context === undefined) {
    throw new Error('useAgentFlowDesign must be used within an AgentFlowDesignProvider');
  }
  return context;
};

// Legacy support - keep old names for backward compatibility
export const BrandDesignProvider = AgentFlowDesignProvider;
export const useBrandDesign = useAgentFlowDesign;

// AgentFlow Design System Constants for direct usage
export const AGENTFLOW_COLORS = agentFlowDesignSystem.colors;
export const AGENTFLOW_TYPOGRAPHY = agentFlowDesignSystem.typography;
export const AGENTFLOW_SPACING = agentFlowDesignSystem.spacing;
export const AGENTFLOW_RADIUS = agentFlowDesignSystem.radius;
export const AGENTFLOW_SHADOWS = agentFlowDesignSystem.shadows;
export const AGENTFLOW_TRANSITIONS = agentFlowDesignSystem.transitions;

// CSS Class Names for consistent usage
export const AGENTFLOW_CLASSES = {
  // Card Classes
  CARD: 'af-card',
  CARD_GLASS: 'af-card--glass',
  CARD_GLASS_LIGHT: 'af-card--glass-light',
  CARD_GLASS_STRONG: 'af-card--glass-strong',
  CARD_GRADIENT_BORDER: 'af-card--gradient-border',
  
  // Button Classes
  BUTTON: 'af-btn',
  BUTTON_PRIMARY: 'af-btn--primary',
  BUTTON_SUCCESS: 'af-btn--success',
  BUTTON_DANGER: 'af-btn--danger',
  BUTTON_WARNING: 'af-btn--warning',
  BUTTON_GHOST: 'af-btn--ghost',
  
  // Badge Classes
  BADGE: 'af-badge',
  BADGE_PRIMARY: 'af-badge--primary',
  BADGE_SUCCESS: 'af-badge--success',
  BADGE_WARNING: 'af-badge--warning',
  BADGE_DANGER: 'af-badge--danger',
  
  // Layout Classes
  CONTAINER: 'af-container',
  GRID: 'af-grid',
  FLEX_HORIZONTAL: 'af-flex-horizontal',
  
  // Animation Classes
  FADE_IN: 'af-fade-in',
  SCALE_IN: 'af-scale-in',
  SLIDE_IN: 'af-slide-in',
  PULSE: 'af-pulse',
} as const;

// Legacy support - keep old names for backward compatibility
export const BRAND_COLORS = AGENTFLOW_COLORS;
export const BRAND_TYPOGRAPHY = AGENTFLOW_TYPOGRAPHY;
export const BRAND_SPACING = AGENTFLOW_SPACING;
export const BRAND_RADIUS = AGENTFLOW_RADIUS;
export const BRAND_CLASSES = AGENTFLOW_CLASSES;

// Utility function to generate CSS custom properties
export const generateAgentFlowCSSCustomProperties = (): string => {
  const properties: string[] = [];
  
  // Colors
  Object.entries(agentFlowDesignSystem.colors).forEach(([key, value]) => {
    properties.push(`  --af-${key}: ${value};`);
  });
  
  // Typography
  Object.entries(agentFlowDesignSystem.typography).forEach(([key, value]) => {
    properties.push(`  --af-${key}: ${value};`);
  });
  
  // Spacing
  Object.entries(agentFlowDesignSystem.spacing).forEach(([key, value]) => {
    properties.push(`  --af-${key}: ${value};`);
  });
  
  // Radius
  Object.entries(agentFlowDesignSystem.radius).forEach(([key, value]) => {
    properties.push(`  --af-${key}: ${value};`);
  });

  // Shadows
  Object.entries(agentFlowDesignSystem.shadows).forEach(([key, value]) => {
    properties.push(`  --af-${key}: ${value};`);
  });

  // Transitions
  Object.entries(agentFlowDesignSystem.transitions).forEach(([key, value]) => {
    properties.push(`  --af-${key}: ${value};`);
  });
  
  return `:root {\n${properties.join('\n')}\n}`;
};

// Legacy support
export const generateCSSCustomProperties = generateAgentFlowCSSCustomProperties;

export default AgentFlowDesignContext;


