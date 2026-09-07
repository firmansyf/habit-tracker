import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
} from 'zustand/middleware';

import {
  getToday,
  isScheduledDate,
} from '@/utils/date';

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

  // Reminder
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  notificationIds: string[];
};

type HabitStore = {
  habits: Habit[];
  username: string | null;

  setUsername: (username: string) => void;

  addHabit: (
    name: string,
    description: string,
    frequency: HabitFrequency,
    reminderEnabled?: boolean,
    reminderHour?: number,
    reminderMinute?: number
  ) => string;

  toggleHabit: (id: string) => void;

  deleteHabit: (id: string) => void;

  updateHabit: (
    id: string,
    name: string,
    description: string,
    frequency: HabitFrequency
  ) => void;

  updateReminder: (
    id: string,
    enabled: boolean,
    hour: number,
    minute: number,
    notificationIds?: string[]
  ) => void;
};

const initialHabits: Habit[] = [];

export const useHabitStore =
  create<HabitStore>()(
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
          frequency,
          reminderEnabled = false,
          reminderHour = 8,
          reminderMinute = 0
        ) => {
          const id = Date.now().toString();

          set((state) => ({
            habits: [
              ...state.habits,
              {
                id,
                name,
                description,
                frequency,
                completed: false,
                completedDates: [],

                // Reminder
                reminderEnabled,
                reminderHour,
                reminderMinute,
                notificationIds: [],
              },
            ],
          }));

          return id;
        },

        toggleHabit: (id) =>
          set((state) => {
            const today = getToday();

            return {
              habits: state.habits.map(
                (habit) => {
                  if (habit.id !== id) {
                    return habit;
                  }

                  const frequency =
                    habit.frequency ??
                    'daily';

                  const isScheduled =
                    isScheduledDate(
                      today,
                      frequency
                    );

                  // Jangan izinkan completion
                  // pada hari yang tidak dijadwalkan.
                  if (!isScheduled) {
                    return habit;
                  }

                  const isCompletedToday =
                    habit.completedDates.includes(
                      today
                    );

                  const completedDates =
                    isCompletedToday
                      ? habit.completedDates.filter(
                          (date) =>
                            date !== today
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
                }
              ),
            };
          }),

        deleteHabit: (id) =>
          set((state) => ({
            habits: state.habits.filter(
              (habit) =>
                habit.id !== id
            ),
          })),

        updateHabit: (
          id,
          name,
          description,
          frequency
        ) =>
          set((state) => ({
            habits: state.habits.map(
              (habit) => {
                if (habit.id !== id) {
                  return habit;
                }

                return {
                  ...habit,
                  name,
                  description,
                  frequency,
                };
              }
            ),
          })),

        updateReminder: (
          id,
          enabled,
          hour,
          minute,
          notificationIds = []
        ) =>
          set((state) => ({
            habits: state.habits.map(
              (habit) => {
                if (habit.id !== id) {
                  return habit;
                }

                return {
                  ...habit,
                  reminderEnabled:
                    enabled,
                  reminderHour: hour,
                  reminderMinute:
                    minute,
                  notificationIds,
                };
              }
            ),
          })),
      }),
      {
        name: 'habit-storage',

        storage: createJSONStorage(
          () => AsyncStorage
        ),

        /*
         * Compatibility untuk data lama.
         *
         * Habit yang sebelumnya menggunakan
         * notificationId akan dikonversi
         * menjadi notificationIds.
         */
        merge: (
          persistedState,
          currentState
        ) => {
          const persisted =
            persistedState as Partial<HabitStore>;

          const persistedHabits =
            persisted.habits ?? [];

          const habits =
            persistedHabits.map(
              (habit) => {
                const oldHabit =
                  habit as Habit & {
                    notificationId?: string | null;
                    notificationIds?: string[];
                  };

                let notificationIds =
                  oldHabit.notificationIds;

                if (!notificationIds) {
                  notificationIds =
                    oldHabit.notificationId
                      ? [
                          oldHabit.notificationId,
                        ]
                      : [];
                }

                return {
                  ...habit,

                  reminderEnabled:
                    habit.reminderEnabled ??
                    false,

                  reminderHour:
                    habit.reminderHour ??
                    8,

                  reminderMinute:
                    habit.reminderMinute ??
                    0,

                  notificationIds,
                };
              }
            );

          return {
            ...currentState,
            ...persisted,
            habits,
          };
        },
      }
    )
  );