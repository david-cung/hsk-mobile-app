export const colors = {
  surface: '#fcf9f8',
  surfaceDim: '#dcd9d9',
  surfaceBright: '#fcf9f8',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f6f3f2',
  surfaceContainer: '#f0eded',
  surfaceContainerHigh: '#eae7e7',
  surfaceContainerHighest: '#e4e2e1',
  onSurface: '#1b1c1c',
  onSurfaceVariant: '#5b4040',
  inverseSurface: '#303030',
  inverseOnSurface: '#f3f0f0',
  outline: '#8f6f6f',
  outlineVariant: '#e3bebd',
  surfaceTint: '#ba1434',
  primary: '#9e0027',
  onPrimary: '#ffffff',
  primaryContainer: '#c41e3a',
  onPrimaryContainer: '#ffdada',
  primaryFixed: '#ffdad9',
  primaryFixedDim: '#ffb3b4',
  inversePrimary: '#ffb3b4',
  secondary: '#705d00',
  onSecondary: '#ffffff',
  secondaryContainer: '#fcd400',
  onSecondaryContainer: '#6e5c00',
  tertiary: '#205555',
  onTertiary: '#ffffff',
  tertiaryContainer: '#3b6d6d',
  onTertiaryContainer: '#b8edec',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  background: '#fcf9f8',
  onBackground: '#1b1c1c',
  surfaceVariant: '#e4e2e1',
} as const;

export const spacing = {
  unit: 4,
  marginMobile: 20,
  gutterMobile: 16,
  stackSm: 8,
  stackMd: 16,
  stackLg: 32,
  cardPadding: 20,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

import { Platform } from 'react-native';

/** System fonts with CJK support on iOS/Android (no Expo font loader). */
export const fonts = {
  latin: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  chinese: Platform.select({ ios: 'PingFang SC', android: 'sans-serif', default: 'System' }),
} as const;

export const typography = {
  displayZh: { fontSize: 48, lineHeight: 58, fontWeight: '700' as const },
  headlineLgMobile: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  headlineMd: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  bodyLg: { fontSize: 18, lineHeight: 28, fontWeight: '400' as const },
  bodyZh: { fontSize: 20, lineHeight: 32, fontWeight: '400' as const },
  bodyMd: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  labelMd: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const, letterSpacing: 0.28 },
  labelSm: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const, letterSpacing: 0.48 },
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  button: {
    shadowColor: '#c41e3a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;
