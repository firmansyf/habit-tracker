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