import { getToday } from '@/utils/date';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Habit = {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  username?: string | null;
  completedDates: string[];
  setUsername?: (username: string) => void;
};

type HabitStore = {
  habits: Habit[];

  username?: string | null;
  setUsername?: (username: string) => void;

  addHabit: (
    name: string,
    description: string
  ) => void;

  toggleHabit: (id: string) => void;

  deleteHabit: (id: string) => void;

  updateHabit: (
    id: string,
    name: string,
    description: string
  ) => void;
};

const initialHabits: Habit[] = [
  {
    id: '1',
    name: 'Drink Water',
    description: '8 glasses',
    completed: true,
    completedDates: [],
  },
];

export const useHabitStore = create<HabitStore>()(
  persist(
    (set) => ({
      habits: initialHabits,

      username: null,
      setUsername: (username) =>
        set({
          username,
      }),


      addHabit: (name, description) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id: Date.now().toString(),
              name,
              description,
              completed: false,
              completedDates: []
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
                habit.completedDates.includes(today);

              return {
                ...habit,

                completed: !isCompletedToday,

                completedDates: isCompletedToday
                  ? habit.completedDates.filter(
                      (date) => date !== today
                    )
                  : [
                      ...habit.completedDates,
                      today,
                    ],
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

      updateHabit: (id, name, description) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? {
                  ...habit,
                  name,
                  description,
                }
              : habit
          ),
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