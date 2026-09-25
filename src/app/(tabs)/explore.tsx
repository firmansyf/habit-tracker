import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useHabitStore } from '@/store/habit-store';
import { ThemeMode, useThemeStore } from '@/store/theme-store';

export default function SettingsScreen() {
  const { colors, colorScheme } = useAppTheme();

  const username = useHabitStore((state) => state.username);
  const resetAllData = useHabitStore((state) => state.resetAllData);

  const themeMode = useThemeStore((state) => state.themeMode);
  const setThemeMode = useThemeStore((state) => state.setThemeMode);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const isDark = colorScheme === 'dark';

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to delete all your habits and profile data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetAllData();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Settings
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Customize your Habit Tracker
          </Text>
        </View>

        {/* Profile */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Profile
          </Text>

          <View style={styles.profileRow}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: colors.primarySoft,
                },
              ]}
            >
              <Text
                style={[
                  styles.avatarText,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                {username?.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>

            <View style={styles.profileInfo}>
              <Text
                style={[
                  styles.profileName,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {username || 'User'}
              </Text>

              <Text
                style={[
                  styles.profileDescription,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Habit Tracker user
              </Text>
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Appearance
          </Text>

          <Text
            style={[
              styles.sectionDescription,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Choose how the app looks.
          </Text>

          <View
            style={[
              styles.themeOptions,
              {
                backgroundColor: colors.input,
              },
            ]}
          >
            <ThemeOption
              label="System"
              value="system"
              selected={themeMode === 'system'}
              onPress={() => handleThemeChange('system')}
              colors={colors}
            />

            <ThemeOption
              label="Light"
              value="light"
              selected={themeMode === 'light'}
              onPress={() => handleThemeChange('light')}
              colors={colors}
            />

            <ThemeOption
              label="Dark"
              value="dark"
              selected={themeMode === 'dark'}
              onPress={() => handleThemeChange('dark')}
              colors={colors}
            />
          </View>
        </View>

        {/* Notifications */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Notifications
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Reminder Notifications
              </Text>

              <Text
                style={[
                  styles.settingDescription,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Receive reminders for your habits.
              </Text>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor={
                isDark ? colors.surface : '#FFFFFF'
              }
            />
          </View>
        </View>

        {/* App Information */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            About
          </Text>

          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              App
            </Text>

            <Text
              style={[
                styles.infoValue,
                {
                  color: colors.text,
                },
              ]}
            >
              Habit Tracker
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[
                styles.infoLabel,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Version
            </Text>

            <Text
              style={[
                styles.infoValue,
                {
                  color: colors.text,
                },
              ]}
            >
              1.0.0
            </Text>
          </View>
        </View>

        {/* Reset */}
        <Pressable
          onPress={handleResetData}
          style={({ pressed }) => [
            styles.resetButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.danger,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.resetButtonText,
              {
                color: colors.danger,
              },
            ]}
          >
            Reset All Data
          </Text>
        </Pressable>

        <Text
          style={[
            styles.footer,
            {
              color: colors.textMuted,
            },
          ]}
        >
          Habit Tracker • Stay consistent, one day at a time.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

type ThemeOptionProps = {
  label: string;
  value: ThemeMode;
  selected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useAppTheme>['colors'];
};

function ThemeOption({
  label,
  selected,
  onPress,
  colors,
}: ThemeOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.themeOption,
        {
          backgroundColor: selected
            ? colors.card
            : 'transparent',
          borderColor: selected
            ? colors.border
            : 'transparent',
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.themeOptionText,
          {
            color: selected
              ? colors.text
              : colors.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
  },

  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },

  sectionDescription: {
    fontSize: 14,
    marginBottom: 14,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },

  profileInfo: {
    marginLeft: 14,
  },

  profileName: {
    fontSize: 16,
    fontWeight: '700',
  },

  profileDescription: {
    marginTop: 4,
    fontSize: 13,
  },

  themeOptions: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },

  themeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 9,
  },

  themeOptionText: {
    fontSize: 13,
    fontWeight: '600',
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
  },

  settingDescription: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  infoLabel: {
    fontSize: 14,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },

  resetButton: {
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },

  resetButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },

  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
  },
});