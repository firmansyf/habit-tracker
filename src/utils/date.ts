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

  date.setDate(date.getDate() - days);

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
  completedDates: string[]
): number => {
  if (completedDates.length === 0) {
    return 0;
  }

  const dates = new Set(completedDates);

  let streak = 0;
  let currentDate = getToday();

  while (dates.has(currentDate)) {
    streak++;

    currentDate = getDateBefore(
      currentDate,
      1
    );
  }

  return streak;
};

export const getLastSevenDays = (): string[] => {
  const days: string[] = [];

  const today = getToday();

  for (let i = 6; i >= 0; i--) {
    days.push(getDateBefore(today, i));
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

export const formatDate = (
  year: number,
  month: number,
  day: number
): string => {
  const monthString = String(month + 1).padStart(2, '0');
  const dayString = String(day).padStart(2, '0');

  return `${year}-${monthString}-${dayString}`;
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