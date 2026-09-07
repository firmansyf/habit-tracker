import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
} from 'zustand/middleware';

import { getToday } from '@/utils/date';

export type HabitFrequency =
  | 'daily'
  | 'weekdays'
  | 'weekends';

export type Habit = {
  id: string;
  name: string;
  description: string;
  frequency: HabitFrequency;
  completed: boolean;
  completedDates: string[];
};

type HabitStore = {
  habits: Habit[];
  username: string | null;

  setUsername: (username: string) => void;

  addHabit: (
    name: string,
    description: string,
    frequency: HabitFrequency
  ) => void;

  toggleHabit: (id: string) => void;

  deleteHabit: (id: string) => void;

  updateHabit: (
    id: string,
    name: string,
    description: string,
    frequency: HabitFrequency
  ) => void;
};

const initialHabits: Habit[] = [];

export const useHabitStore = create<HabitStore>()(
  persist(
    (set) => ({
      habits: initialHabits,

      username: null,

      setUsername: (username) =>
        set({
          username,
        }),

      addHabit: (
        name,
        description,
        frequency
      ) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id: Date.now().toString(),
              name,
              description,
              frequency,
              completed: false,
              completedDates: [],
            },
          ],
        })),

      toggleHabit: (id) =>
        set((state) => {
          const today = getToday();

          return {
            habits: state.habits.map((habit) => {
              if (habit.id !== id) {
                return habit;
              }

              const isCompletedToday =
                habit.completedDates.includes(
                  today
                );

              const completedDates =
                isCompletedToday
                  ? habit.completedDates.filter(
                      (date) => date !== today
                    )
                  : [
                      ...habit.completedDates,
                      today,
                    ];

              return {
                ...habit,
                completed:
                  !isCompletedToday,
                completedDates,
              };
            }),
          };
        }),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter(
            (habit) => habit.id !== id
          ),
        })),

      updateHabit: (
        id,
        name,
        description,
        frequency
      ) =>
        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) {
              return habit;
            }

            return {
              ...habit,
              name,
              description,
              frequency,
            };
          }),
        })),
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(
        () => AsyncStorage
      ),
    }
  )
);