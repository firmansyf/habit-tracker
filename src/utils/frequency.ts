import { HabitFrequency } from '@/store/habit-store';

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