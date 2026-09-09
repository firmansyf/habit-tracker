import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { HabitFrequency } from '@/store/habit-store';

const NOTIFICATION_CHANNEL_ID =
  'habit-reminders';

/*
 * Menentukan bagaimana notification
 * ditampilkan ketika aplikasi sedang terbuka.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermission =
  async (): Promise<boolean> => {
    /*
     * Android:
     * Buat notification channel terlebih dahulu.
     */
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

    /*
     * Check permission.
     */
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
      console.log(
        '❌ Notification permission denied'
      );

      return false;
    }

    console.log(
      '✅ Notification permission granted'
    );

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
                .WEEKLY,

            weekday,
            hour,
            minute,

            channelId:
              NOTIFICATION_CHANNEL_ID,
          },
        }
      );

    console.log(
      `✅ Weekly notification scheduled: ${notificationId}`
    );

    return notificationId;
  };

export const scheduleHabitReminder =
  async (
    habitName: string,
    frequency: HabitFrequency,
    hour: number,
    minute: number
  ): Promise<string[]> => {
    const notificationIds: string[] = [];

    console.log(
      '🔔 Scheduling habit reminder:',
      {
        habitName,
        frequency,
        hour,
        minute,
      }
    );

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

      console.log(
        '✅ Daily notification scheduled:',
        notificationId
      );

      /*
       * Diagnostic:
       * cek semua notification yang
       * sedang terjadwal.
       */
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();

      console.log(
        '📋 Scheduled notifications:',
        scheduledNotifications
      );

      return notificationIds;
    }

    /*
     * Weekdays
     *
     * Monday - Friday
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

      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();

      console.log(
        '📋 Scheduled notifications:',
        scheduledNotifications
      );

      return notificationIds;
    }

    /*
     * Weekends
     *
     * Saturday - Sunday
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

    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    console.log(
      '📋 Scheduled notifications:',
      scheduledNotifications
    );

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

    console.log(
      '🗑️ Cancelled notifications:',
      notificationIds
    );
  };