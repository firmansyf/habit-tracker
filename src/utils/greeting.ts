export const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  }

  if (hour >= 12 && hour < 18) {
    return 'Good Afternoon';
  }

  return 'Good Evening';
};

export const getInitial = (
  username: string
): string => {
  return username
    .trim()
    .charAt(0)
    .toUpperCase();
};