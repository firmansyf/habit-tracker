import { create } from 'zustand';

export type Habit = {
  id: string;
  name: string;
  description: string;
  completed: boolean;
};

type HabitStore = {
  habits: Habit[];

  addHabit: (name: string, description: string) => void;
  toggleHabit: (id: string) => void;
  deleteHabit : (id: string) => void;
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
  },
  {
    id: '2',
    name: 'Read Book',
    description: '20 minutes',
    completed: false,
  },
  {
    id: '3',
    name: 'Learn Coding',
    description: '1 hour',
    completed: false,
  },
];

export const useHabitStore = create<HabitStore>((set) => ({
  habits: initialHabits,

  addHabit: (name, description) =>
    set((state) => ({
      habits: [
        ...state.habits,
        {
          id: Date.now().toString(),
          name,
          description,
          completed: false,
        },
      ],
    })),

  toggleHabit: (id) =>
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completed: !habit.completed,
            }
          : habit
      ),
    })),

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
}));