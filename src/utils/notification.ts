import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { HabitFrequency } from '@/store/habit-store';

const NOTIFICATION_CHANNEL_ID =
  'habit-reminders';

export const requestNotificationPermission =
  async (): Promise<boolean> => {
    const {
      status: existingStatus,
    } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const {
        status,
      } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(
        NOTIFICATION_CHANNEL_ID,
        {
          name: 'Habit Reminders',
          importance:
            Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
        }
      );
    }

    return true;
  };

/*
 * Membuat notification untuk satu hari
 * dalam satu minggu.
 *
 * Expo:
 * 1 = Sunday
 * 2 = Monday
 * 3 = Tuesday
 * 4 = Wednesday
 * 5 = Thursday
 * 6 = Friday
 * 7 = Saturday
 */
const scheduleWeeklyNotification =
  async (
    habitName: string,
    weekday: number,
    hour: number,
    minute: number
  ): Promise<string> => {
    return Notifications.scheduleNotificationAsync(
      {
        content: {
          title: 'Habit Reminder 🔔',
          body: `Time to complete "${habitName}"`,
        },

        trigger: {
          type:
            Notifications
              .SchedulableTriggerInputTypes
              .WEEKLY,

          weekday,
          hour,
          minute,

          channelId:
            NOTIFICATION_CHANNEL_ID,
        },
      }
    );
  };

export const scheduleHabitReminder =
  async (
    habitName: string,
    frequency: HabitFrequency,
    hour: number,
    minute: number
  ): Promise<string[]> => {
    const notificationIds: string[] = [];

    /*
     * Daily
     *
     * Satu notification setiap hari.
     */
    if (frequency === 'daily') {
      const notificationId =
        await Notifications.scheduleNotificationAsync(
          {
            content: {
              title: 'Habit Reminder 🔔',
              body: `Time to complete "${habitName}"`,
            },

            trigger: {
              type:
                Notifications
                  .SchedulableTriggerInputTypes
                  .DAILY,

              hour,
              minute,

              channelId:
                NOTIFICATION_CHANNEL_ID,
            },
          }
        );

      notificationIds.push(
        notificationId
      );

      return notificationIds;
    }

    /*
     * Weekdays
     *
     * Monday - Friday
     *
     * 2 = Monday
     * 3 = Tuesday
     * 4 = Wednesday
     * 5 = Thursday
     * 6 = Friday
     */
    if (frequency === 'weekdays') {
      const weekdays = [
        2,
        3,
        4,
        5,
        6,
      ];

      for (const weekday of weekdays) {
        const notificationId =
          await scheduleWeeklyNotification(
            habitName,
            weekday,
            hour,
            minute
          );

        notificationIds.push(
          notificationId
        );
      }

      return notificationIds;
    }

    /*
     * Weekends
     *
     * Saturday - Sunday
     *
     * 7 = Saturday
     * 1 = Sunday
     */
    const weekends = [
      7,
      1,
    ];

    for (const weekday of weekends) {
      const notificationId =
        await scheduleWeeklyNotification(
          habitName,
          weekday,
          hour,
          minute
        );

      notificationIds.push(
        notificationId
      );
    }

    return notificationIds;
  };

export const cancelHabitReminder =
  async (
    notificationIds: string[]
  ): Promise<void> => {
    if (notificationIds.length === 0) {
      return;
    }

    await Promise.all(
      notificationIds.map(
        (notificationId) =>
          Notifications.cancelScheduledNotificationAsync(
            notificationId
          )
      )
    );
  };