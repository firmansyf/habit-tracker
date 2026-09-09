import type { HabitFrequency } from '@/store/habit-store';

export const getToday = (): string => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getDateBefore = (
  dateString: string,
  days: number
): string => {
  const date = new Date(
    `${dateString}T00:00:00`
  );

  date.setDate(
    date.getDate() - days
  );

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getCurrentStreak = (
  completedDates: string[],
  frequency: HabitFrequency = 'daily'
): number => {
  if (completedDates.length === 0) {
    return 0;
  }

  const completedSet = new Set(
    completedDates
  );

  let streak = 0;
  let currentDate = getToday();

  while (true) {
    const isScheduled =
      isScheduledDate(
        currentDate,
        frequency
      );

    if (isScheduled) {
      if (!completedSet.has(currentDate)) {
        break;
      }

      streak++;
    }

    currentDate = getDateBefore(
      currentDate,
      1
    );
  }

  return streak;
};

export const isScheduledDate = (
  dateString: string,
  frequency: HabitFrequency
): boolean => {
  const date = new Date(
    `${dateString}T00:00:00`
  );

  const day = date.getDay();

  if (frequency === 'daily') {
    return true;
  }

  if (frequency === 'weekdays') {
    return day >= 1 && day <= 5;
  }

  if (frequency === 'weekends') {
    return day === 0 || day === 6;
  }

  return true;
};

export const getLastSevenDays = (): string[] => {
  const days: string[] = [];

  const today = getToday();

  for (let i = 6; i >= 0; i--) {
    days.push(
      getDateBefore(today, i)
    );
  }

  return days;
};

export const getCompletedCountForDate = (
  completedDates: string[],
  date: string
): number => {
  return completedDates.filter(
    (completedDate) =>
      completedDate === date
  ).length;
};

export const getDaysInMonth = (
  year: number,
  month: number
): number => {
  return new Date(
    year,
    month + 1,
    0
  ).getDate();
};

export const getFirstDayOfMonth = (
  year: number,
  month: number
): number => {
  return new Date(
    year,
    month,
    1
  ).getDay();
};

export const formatDate = (
  year: number,
  month: number,
  day: number
): string => {
  const monthString = String(
    month + 1
  ).padStart(2, '0');

  const dayString = String(
    day
  ).padStart(2, '0');

  return `${year}-${monthString}-${dayString}`;
};

export const getBestStreak = (
  completedDates: string[],
  frequency: HabitFrequency = 'daily'
): number => {
  if (completedDates.length === 0) {
    return 0;
  }

  const completedSet = new Set(
    completedDates
  );

  const sortedDates = [
    ...completedSet,
  ].sort();

  const firstDate = sortedDates[0];
  const today = getToday();

  let currentDate = firstDate;
  let streak = 0;
  let bestStreak = 0;

  while (currentDate <= today) {
    const isScheduled = isScheduledDate(
      currentDate,
      frequency
    );

    if (isScheduled) {
      if (completedSet.has(currentDate)) {
        streak++;

        bestStreak = Math.max(
          bestStreak,
          streak
        );
      } else {
        streak = 0;
      }
    }

    currentDate = getDateBefore(
      currentDate,
      -1
    );
  }

  return bestStreak;
};

export const getOverallCurrentStreak = (
  habits: {
    completedDates: string[];
    frequency: HabitFrequency;
  }[]
): number => {
  if (habits.length === 0) {
    return 0;
  }

  let streak = 0;
  let currentDate = getToday();

  while (true) {
    const hasCompletedHabit =
      habits.some((habit) => {
        const isScheduled = isScheduledDate(
          currentDate,
          habit.frequency ?? 'daily'
        );

        return (
          isScheduled &&
          habit.completedDates.includes(
            currentDate
          )
        );
      });

    if (!hasCompletedHabit) {
      break;
    }

    streak++;

    currentDate = getDateBefore(
      currentDate,
      1
    );
  }

  return streak;
};

export const getOverallBestStreak = (
  habits: {
    completedDates: string[];
    frequency: HabitFrequency;
  }[]
): number => {
  if (habits.length === 0) {
    return 0;
  }

  const allDates = new Set<string>();

  habits.forEach((habit) => {
    habit.completedDates.forEach((date) => {
      allDates.add(date);
    });
  });

  if (allDates.size === 0) {
    return 0;
  }

  const sortedDates = [
    ...allDates,
  ].sort();

  const firstDate = sortedDates[0];
  const today = getToday();

  let currentDate = firstDate;
  let streak = 0;
  let bestStreak = 0;

  while (currentDate <= today) {
    const hasCompletedHabit =
      habits.some((habit) => {
        const isScheduled = isScheduledDate(
          currentDate,
          habit.frequency ?? 'daily'
        );

        return (
          isScheduled &&
          habit.completedDates.includes(
            currentDate
          )
        );
      });

    if (hasCompletedHabit) {
      streak++;

      bestStreak = Math.max(
        bestStreak,
        streak
      );
    } else {
      streak = 0;
    }

    currentDate = getDateBefore(
      currentDate,
      -1
    );
  }

  return bestStreak;
};