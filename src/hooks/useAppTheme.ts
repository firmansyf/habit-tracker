import { useColorScheme } from 'react-native';

import {
    darkColors,
    lightColors,
} from '@/constants/theme';

import { useThemeStore } from '@/store/theme-store';

export function useAppTheme() {
  const systemColorScheme = useColorScheme();

  const themeMode = useThemeStore(
    (state) => state.themeMode
  );

  const colorScheme =
    themeMode === 'system'
      ? systemColorScheme
      : themeMode;

  const colors =
    colorScheme === 'dark'
      ? darkColors
      : lightColors;

  return {
    colors,
    colorScheme,
    themeMode,
  };
}