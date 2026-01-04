/**
 * ============================================================================
 * TEMA SIMPLY - App Móvil
 * ============================================================================
 * 
 * Sistema de diseño: colores, tipografía, espaciado, sombras
 * 
 * @version 1.0.0
 */

export const colors = {
  // Primary
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  
  // Secondary
  secondary: '#8B5CF6',
  secondaryDark: '#7C3AED',
  secondaryLight: '#A78BFA',
  
  // Status
  success: '#10B981',
  successLight: '#34D399',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  error: '#EF4444',
  errorLight: '#F87171',
  info: '#3B82F6',
  infoLight: '#60A5FA',
  
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  
  // Grays
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Backgrounds
  background: '#F9FAFB',
  backgroundDark: '#111827',
  surface: '#FFFFFF',
  surfaceDark: '#1F2937',
  
  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',
  textPrimaryDark: '#F9FAFB',
  textSecondaryDark: '#9CA3AF',
  
  // Levels
  levelPlata: '#C0C0C0',
  levelOro: '#FFD700',
  levelBlack: '#1F2937',
  levelDiamante: '#60A5FA',
  
  // Gradients (for LinearGradient)
  gradientPrimary: ['#6366F1', '#8B5CF6'],
  gradientSuccess: ['#10B981', '#34D399'],
  gradientWarning: ['#F59E0B', '#FBBF24'],
  gradientError: ['#EF4444', '#F87171'],
  gradientDark: ['#1F2937', '#374151'],
  gradientPlata: ['#C0C0C0', '#A0A0A0'],
  gradientOro: ['#FFD700', '#DAA520'],
  gradientBlack: ['#1F2937', '#111827'],
  gradientDiamante: ['#60A5FA', '#3B82F6'],
};

export const typography = {
  // Font families
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    heading: 'Poppins-Bold',
  },
  
  // Font sizes
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Level colors helper
export const getLevelColor = (level: string): string => {
  switch (level?.toUpperCase()) {
    case 'PLATA': return colors.levelPlata;
    case 'ORO': return colors.levelOro;
    case 'BLACK': return colors.levelBlack;
    case 'DIAMANTE': return colors.levelDiamante;
    default: return colors.levelPlata;
  }
};

export const getLevelGradient = (level: string): string[] => {
  switch (level?.toUpperCase()) {
    case 'PLATA': return colors.gradientPlata;
    case 'ORO': return colors.gradientOro;
    case 'BLACK': return colors.gradientBlack;
    case 'DIAMANTE': return colors.gradientDiamante;
    default: return colors.gradientPlata;
  }
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  getLevelColor,
  getLevelGradient,
};
