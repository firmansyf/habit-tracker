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
import { useThemeStore } from '@/store/theme-store';
import { cancelHabitReminder } from '@/utils/notification';

type NotificationStatus =
  | 'active'
  | 'disabled'
  | 'not-set';

export default function SettingsScreen() {
  const router = useRouter();

  const habits = useHabitStore(
    (state) => state.habits
  );

  const resetAllData = useHabitStore(
    (state) => state.resetAllData
  );

  const themeMode = useThemeStore(
    (state) => state.themeMode
  );

  const setThemeMode = useThemeStore(
    (state) => state.setThemeMode
  );

  const [notificationStatus, setNotificationStatus] =
    useState<NotificationStatus>('not-set');

  /* -------------------------------------------------------------------------- */
  /* Notification Status                                                        */
  /* -------------------------------------------------------------------------- */

  const checkNotificationPermission =
    useCallback(async () => {
      const { status } =
        await Notifications.getPermissionsAsync();

      if (status === 'granted') {
        setNotificationStatus('active');
        return;
      }

      if (status === 'denied') {
        setNotificationStatus('disabled');
        return;
      }

      setNotificationStatus('not-set');
    }, []);

  useFocusEffect(
    useCallback(() => {
      checkNotificationPermission();
    }, [checkNotificationPermission])
  );

  /* -------------------------------------------------------------------------- */
  /* Reset All Data                                                             */
  /* -------------------------------------------------------------------------- */

  const handleResetAllData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all habits and your profile. This action cannot be undone.',
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
              /*
               * Cancel semua scheduled notifications
               * sebelum data habit dihapus.
               */
              const notificationIds =
                habits.flatMap(
                  (habit) =>
                    habit.notificationIds ?? []
                );

              if (notificationIds.length > 0) {
                await cancelHabitReminder(
                  notificationIds
                );
              }

              resetAllData();

              router.replace('/welcome');
            } catch (error) {
              console.error(
                'Failed to reset all data:',
                error
              );

              Alert.alert(
                'Error',
                'Failed to reset all data.'
              );
            }
          },
        },
      ]
    );
  };

  /* -------------------------------------------------------------------------- */
  /* Helpers                                                                    */
  /* -------------------------------------------------------------------------- */

  const notificationLabel =
    notificationStatus === 'active'
      ? 'Active'
      : notificationStatus === 'disabled'
        ? 'Disabled'
        : 'Not Set';

  const notificationDescription =
    notificationStatus === 'active'
      ? 'Notifications are enabled'
      : notificationStatus === 'disabled'
        ? 'Notifications are disabled'
        : 'Notification permission has not been set';

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

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
            Customize your HabitTracker experience.
          </Text>
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* Appearance                                                         */}
        {/* ------------------------------------------------------------------ */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Appearance
          </Text>

          <Text style={styles.sectionDescription}>
            Choose how HabitTracker looks on your
            device.
          </Text>

          <View style={styles.themeOptions}>
            {/* System */}
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{
                selected:
                  themeMode === 'system',
              }}
              onPress={() =>
                setThemeMode('system')
              }
              style={({ pressed }) => [
                styles.themeOption,
                themeMode === 'system' &&
                  styles.themeOptionSelected,
                pressed &&
                  styles.themeOptionPressed,
              ]}
            >
              <View style={styles.themeOptionIcon}>
                <Text style={styles.themeIconText}>
                  📱
                </Text>
              </View>

              <View
                style={styles.themeOptionContent}
              >
                <Text
                  style={[
                    styles.themeOptionTitle,
                    themeMode === 'system' &&
                      styles.themeOptionTitleSelected,
                  ]}
                >
                  System
                </Text>

                <Text
                  style={styles.themeOptionDescription}
                >
                  Follow your device theme
                </Text>
              </View>

              {themeMode === 'system' && (
                <View style={styles.checkCircle}>
                  <Text style={styles.checkText}>
                    ✓
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Light */}
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{
                selected:
                  themeMode === 'light',
              }}
              onPress={() =>
                setThemeMode('light')
              }
              style={({ pressed }) => [
                styles.themeOption,
                themeMode === 'light' &&
                  styles.themeOptionSelected,
                pressed &&
                  styles.themeOptionPressed,
              ]}
            >
              <View style={styles.themeOptionIcon}>
                <Text style={styles.themeIconText}>
                  ☀️
                </Text>
              </View>

              <View
                style={styles.themeOptionContent}
              >
                <Text
                  style={[
                    styles.themeOptionTitle,
                    themeMode === 'light' &&
                      styles.themeOptionTitleSelected,
                  ]}
                >
                  Light
                </Text>

                <Text
                  style={styles.themeOptionDescription}
                >
                  Always use light mode
                </Text>
              </View>

              {themeMode === 'light' && (
                <View style={styles.checkCircle}>
                  <Text style={styles.checkText}>
                    ✓
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Dark */}
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{
                selected:
                  themeMode === 'dark',
              }}
              onPress={() =>
                setThemeMode('dark')
              }
              style={({ pressed }) => [
                styles.themeOption,
                themeMode === 'dark' &&
                  styles.themeOptionSelected,
                pressed &&
                  styles.themeOptionPressed,
              ]}
            >
              <View style={styles.themeOptionIcon}>
                <Text style={styles.themeIconText}>
                  🌙
                </Text>
              </View>

              <View
                style={styles.themeOptionContent}
              >
                <Text
                  style={[
                    styles.themeOptionTitle,
                    themeMode === 'dark' &&
                      styles.themeOptionTitleSelected,
                  ]}
                >
                  Dark
                </Text>

                <Text
                  style={styles.themeOptionDescription}
                >
                  Always use dark mode
                </Text>
              </View>

              {themeMode === 'dark' && (
                <View style={styles.checkCircle}>
                  <Text style={styles.checkText}>
                    ✓
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* Notifications                                                      */}
        {/* ------------------------------------------------------------------ */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Notifications
          </Text>

          <View style={styles.settingCard}>
            <View style={styles.settingIcon}>
              <Text style={styles.settingIconText}>
                🔔
              </Text>
            </View>

            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                Habit Reminders
              </Text>

              <Text style={styles.settingDescription}>
                {notificationDescription}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                notificationStatus === 'active' &&
                  styles.statusBadgeActive,
                notificationStatus === 'disabled' &&
                  styles.statusBadgeDisabled,
                notificationStatus === 'not-set' &&
                  styles.statusBadgeNotSet,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  notificationStatus === 'active' &&
                    styles.statusTextActive,
                  notificationStatus === 'disabled' &&
                    styles.statusTextDisabled,
                  notificationStatus === 'not-set' &&
                    styles.statusTextNotSet,
                ]}
              >
                {notificationLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* Profile                                                            */}
        {/* ------------------------------------------------------------------ */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Profile
          </Text>

          <Pressable
            onPress={() =>
              router.push('/profile')
            }
            style={({ pressed }) => [
              styles.settingCard,
              pressed &&
                styles.settingCardPressed,
            ]}
          >
            <View style={styles.settingIcon}>
              <Text style={styles.settingIconText}>
                👤
              </Text>
            </View>

            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                Profile
              </Text>

              <Text style={styles.settingDescription}>
                Manage your profile information
              </Text>
            </View>

            <Text style={styles.chevron}>
              ›
            </Text>
          </Pressable>
        </View>

        {/* ------------------------------------------------------------------ */}
        {/* Data                                                               */}
        {/* ------------------------------------------------------------------ */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Data
          </Text>

          <Pressable
            onPress={handleResetAllData}
            style={({ pressed }) => [
              styles.resetButton,
              pressed &&
                styles.resetButtonPressed,
            ]}
          >
            <Text style={styles.resetButtonText}>
              Reset All Data
            </Text>
          </Pressable>

          <Text style={styles.resetDescription}>
            Delete all habits, completion history,
            reminders, and profile information.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            HabitTracker
          </Text>

          <Text style={styles.footerText}>
            Build better habits, one day at a time.
          </Text>

          <Text style={styles.version}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ========================================================================== */
/* Styles                                                                     */
/* ========================================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Header */

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
    lineHeight: 21,
    color: '#64748B',
  },

  /* Section */

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },

  sectionDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
    marginTop: -4,
    marginBottom: 16,
  },

  /* Appearance */

  themeOptions: {
    gap: 10,
  },

  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },

  themeOptionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },

  themeOptionPressed: {
    opacity: 0.75,
  },

  themeOptionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    marginRight: 12,
  },

  themeIconText: {
    fontSize: 20,
  },

  themeOptionContent: {
    flex: 1,
  },

  themeOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  themeOptionTitleSelected: {
    color: '#2563EB',
  },

  themeOptionDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },

  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  /* Settings Card */

  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },

  settingCardPressed: {
    opacity: 0.75,
  },

  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    marginRight: 12,
  },

  settingIconText: {
    fontSize: 20,
  },

  settingContent: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  settingDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
  },

  chevron: {
    fontSize: 28,
    color: '#94A3B8',
    marginLeft: 8,
  },

  /* Notification Status */

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },

  statusBadgeActive: {
    backgroundColor: '#DCFCE7',
  },

  statusBadgeDisabled: {
    backgroundColor: '#FEE2E2',
  },

  statusBadgeNotSet: {
    backgroundColor: '#F1F5F9',
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  statusTextActive: {
    color: '#15803D',
  },

  statusTextDisabled: {
    color: '#B91C1C',
  },

  statusTextNotSet: {
    color: '#64748B',
  },

  /* Reset */

  resetButton: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resetButtonPressed: {
    opacity: 0.7,
  },

  resetButtonText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
  },

  resetDescription: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: '#94A3B8',
  },

  /* Footer */

  footer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },

  footerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },

  footerText: {
    marginTop: 4,
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },

  version: {
    marginTop: 8,
    fontSize: 11,
    color: '#CBD5E1',
  },
});