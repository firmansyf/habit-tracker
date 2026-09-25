import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  create,
} from 'zustand';

import {
  createJSONStorage,
  persist,
} from 'zustand/middleware';

export type ThemeMode =
  | 'system'
  | 'light'
  | 'dark';

type ThemeState = {
  themeMode: ThemeMode;

  setThemeMode: (
    themeMode: ThemeMode
  ) => void;
};

export const useThemeStore =
  create<ThemeState>()(
    persist(
      (set) => ({
        themeMode: 'system',

        setThemeMode: (
          themeMode
        ) =>
          set({
            themeMode,
          }),
      }),

      {
        name: 'habit-tracker-theme',

        storage:
          createJSONStorage(
            () =>
              AsyncStorage
          ),
      }
    )
  );