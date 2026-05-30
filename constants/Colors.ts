// ============================================================
// SMART COLLEGE EVENTS — CRYSTAL AURORA DESIGN SYSTEM
// ============================================================

export const Colors = {
  // Primary Brand
  primary: '#4DA6FF',
  primaryDark: '#3B82F6',
  primaryLight: '#7CC4FF',
  primaryUltraLight: '#EBF4FF',
  
  // Accents (Keep them professional and muted)
  accent: '#38BDF8',
  accentGreen: '#34D399',
  accentOrange: '#FB923C',
  accentPink: '#F472B6',
  accentTeal: '#2DD4BF',
  accentYellow: '#FBBF24',
  accentPurple: '#818CF8',

  // Neutrals (Clean SaaS Look)
  white: '#FFFFFF',
  background: '#F8FBFF',
  surfaceCard: '#FFFFFF',
  surfaceElevated: '#F1F5F9',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Text
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textOnPrimary: '#FFFFFF',

  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Category Colors
  categoryTech: '#3B82F6',
  categoryCultural: '#F472B6',
  categorySports: '#34D399',
  categoryAcademic: '#818CF8',
  categoryWorkshop: '#FB923C',
  categoryOther: '#94A3B8',
  categorySeminar: '#2DD4BF',
  categoryPlacement: '#4DA6FF',
  categoryHackathon: '#F43F5E',

  // Shadow
  shadowColor: '#4DA6FF',

  // Tab Bar
  tabActive: '#4DA6FF',
  tabInactive: '#94A3B8',
  tabBackground: '#FFFFFF',
};

export const Gradients = {
  primary: ['#4DA6FF', '#3B82F6'] as const,
  aurora: ['#7CC4FF', '#4DA6FF'] as const,
  auroraReverse: ['#4DA6FF', '#7CC4FF'] as const,
  hero: ['#4DA6FF', '#3B82F6'] as const, // For the main hero section
  card: ['#FFFFFF', '#F8FAFC'] as const,
  success: ['#34D399', '#10B981'] as const,
  warm: ['#FCA5A5', '#F43F5E'] as const,
};
