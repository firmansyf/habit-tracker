
import * as Notifications from 'expo-notifications';
import {
  useFocusEffect,
  useRouter,
} from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHabitStore } from '@/store/habit-store';
import { cancelHabitReminder } from '@/utils/notification';

type NotificationStatus =
  | 'granted'
  | 'denied'
  | 'undetermined';

export default function SettingsScreen() {
  const router = useRouter();

  const username = useHabitStore(
    (state) => state.username
  );

  const habits = useHabitStore(
    (state) => state.habits
  );

  const resetAllData = useHabitStore(
    (state) => state.resetAllData
  );

  const [notificationStatus, setNotificationStatus] =
    useState<NotificationStatus>('undetermined');

  const checkNotificationPermission =
    useCallback(async () => {
      try {
        const { status } =
          await Notifications.getPermissionsAsync();

        if (status === 'granted') {
          setNotificationStatus('granted');
        } else if (status === 'denied') {
          setNotificationStatus('denied');
        } else {
          setNotificationStatus('undetermined');
        }
      } catch (error) {
        console.error(
          'Failed to check notification permission:',
          error
        );
      }
    }, []);

  useFocusEffect(
    useCallback(() => {
      checkNotificationPermission();
    }, [checkNotificationPermission])
  );

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all habits, progress, and your username. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              const notificationIds =
                habits.flatMap(
                  (habit) =>
                    habit.notificationIds ?? []
                );

              await cancelHabitReminder(
                notificationIds
              );
            } catch (error) {
              console.error(
                'Failed to cancel notifications during reset:',
                error
              );
            } finally {
              resetAllData();
            }
          },
        },
      ]
    );
  };

  const getNotificationLabel = () => {
    switch (notificationStatus) {
      case 'granted':
        return 'Active';

      case 'denied':
        return 'Disabled';

      default:
        return 'Not Set';
    }
  };

  const getNotificationBadgeStyle = () => {
    switch (notificationStatus) {
      case 'granted':
        return styles.statusBadge;

      case 'denied':
        return styles.statusBadgeDanger;

      default:
        return styles.statusBadgeDisabled;
    }
  };

  const getNotificationTextStyle = () => {
    switch (notificationStatus) {
      case 'granted':
        return styles.statusText;

      case 'denied':
        return styles.statusTextDanger;

      default:
        return styles.statusTextDisabled;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <Text style={styles.title}>
            Settings
          </Text>

          <Text style={styles.subtitle}>
            Manage your Habit Tracker
          </Text>
        </View>

        {/* Profile */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Profile
          </Text>

          <View style={styles.card}>
            <Pressable
              style={({ pressed }) => [
                styles.settingRow,
                pressed &&
                  styles.settingPressed,
              ]}
              onPress={() =>
                router.push('/profile')
              }
            >
              <View style={styles.iconBox}>
                <Text style={styles.icon}>
                  👤
                </Text>
              </View>

              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>
                  Username
                </Text>

                <Text
                  style={
                    styles.settingDescription
                  }
                >
                  {username ??
                    'Set your username'}
                </Text>
              </View>

              <Text style={styles.chevron}>
                ›
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Preferences */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Preferences
          </Text>

          <View style={styles.card}>
            {/* Notifications */}

            <View style={styles.settingRow}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>
                  🔔
                </Text>
              </View>

              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>
                  Notifications
                </Text>

                <Text
                  style={
                    styles.settingDescription
                  }
                >
                  Manage reminders from your
                  device settings
                </Text>
              </View>

              <View
                style={getNotificationBadgeStyle()}
              >
                <Text
                  style={getNotificationTextStyle()}
                >
                  {getNotificationLabel()}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Dark Mode */}

            <View style={styles.settingRow}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>
                  🌙
                </Text>
              </View>

              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>
                  Dark Mode
                </Text>

                <Text
                  style={
                    styles.settingDescription
                  }
                >
                  Coming soon
                </Text>
              </View>

              <View
                style={
                  styles.statusBadgeDisabled
                }
              >
                <Text
                  style={
                    styles.statusTextDisabled
                  }
                >
                  Soon
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Data */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Data
          </Text>

          <View style={styles.card}>
            {/* Habit Count */}

            <View style={styles.settingRow}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>
                  📊
                </Text>
              </View>

              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>
                  Your Habits
                </Text>

                <Text
                  style={
                    styles.settingDescription
                  }
                >
                  {habits.length}{' '}
                  {habits.length === 1
                    ? 'habit'
                    : 'habits'}{' '}
                  stored locally
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Reset */}

            <Pressable
              style={({ pressed }) => [
                styles.settingRow,
                pressed &&
                  styles.settingPressed,
              ]}
              onPress={handleResetData}
            >
              <View
                style={[
                  styles.iconBox,
                  styles.dangerIconBox,
                ]}
              >
                <Text style={styles.icon}>
                  🗑️
                </Text>
              </View>

              <View style={styles.settingContent}>
                <Text style={styles.dangerTitle}>
                  Reset All Data
                </Text>

                <Text
                  style={
                    styles.settingDescription
                  }
                >
                  Delete all habits and progress
                </Text>
              </View>

              <Text style={styles.chevron}>
                ›
              </Text>
            </Pressable>
          </View>
        </View>

        {/* About */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            About
          </Text>

          <View style={styles.aboutCard}>
            <View style={styles.appIcon}>
              <Text style={styles.appIconText}>
                ✓
              </Text>
            </View>

            <Text style={styles.appName}>
              Habit Tracker
            </Text>

            <Text style={styles.appVersion}>
              Version 1.0.0
            </Text>

            <Text style={styles.aboutText}>
              Build better habits, one day at a
              time.
            </Text>
          </View>
        </View>

        {/* Footer */}

        <Text style={styles.footer}>
          Made with Yusuf Firmansyah
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748B',
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 10,
    paddingHorizontal: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 72,
  },

  settingPressed: {
    backgroundColor: '#F8FAFC',
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  dangerIconBox: {
    backgroundColor: '#FEF2F2',
  },

  icon: {
    fontSize: 19,
  },

  settingContent: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  dangerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },

  settingDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: '#64748B',
  },

  chevron: {
    marginLeft: 12,
    fontSize: 25,
    color: '#94A3B8',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginLeft: 72,
  },

  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },

  statusBadgeDanger: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusTextDanger: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },

  statusBadgeDisabled: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusTextDisabled: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },

  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    padding: 24,
  },

  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  appIconText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },

  appVersion: {
    marginTop: 4,
    fontSize: 12,
    color: '#94A3B8',
  },

  aboutText: {
    marginTop: 14,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },

  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
});