export const lightColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',

  border: '#E2E8F0',

  primary: '#208AEF',
  primarySoft: '#E8F3FF',

  success: '#22C55E',
  danger: '#EF4444',

  input: '#F1F5F9',
};

export const darkColors = {
  background: '#0F172A',
  surface: '#1E293B',
  card: '#1E293B',

  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',

  border: '#334155',

  primary: '#60A5FA',
  primarySoft: '#1E3A5F',

  success: '#4ADE80',
  danger: '#F87171',

  input: '#334155',
};

export type ThemeColors =
  | typeof lightColors
  | typeof darkColors;