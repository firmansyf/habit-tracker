import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useHabitStore } from '@/store/habit-store';

import {
  getCurrentStreak,
  getLastSevenDays,
  getToday,
  isScheduledDate,
} from '@/utils/date';

const DAY_LABELS = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

const FREQUENCY_LABELS = {
  daily: 'Every Day',
  weekdays: 'Weekdays',
  weekends: 'Weekends',
};

export default function HabitDetailScreen() {
  const router = useRouter();

  const { colors, colorScheme } = useAppTheme();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const habit = useHabitStore((state) =>
    state.habits.find(
      (habit) => habit.id === id
    )
  );

  const isDark = colorScheme === 'dark';

  const completedCircleBackground = isDark
    ? '#14532D'
    : '#DCFCE7';

  const disabledCircleBackground = isDark
    ? '#334155'
    : '#E2E8F0';

  const todayCircleBackground = isDark
    ? '#1E3A5F'
    : '#EFF6FF';

  const settingIconBackground = isDark
    ? '#334155'
    : '#F1F5F9';

  if (!habit) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>
            🔍
          </Text>

          <Text
            style={[
              styles.notFoundTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Habit Not Found
          </Text>

          <Text
            style={[
              styles.notFoundDescription,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            This habit may have been deleted.
          </Text>

          <Pressable
            style={[
              styles.backHomeButton,
              {
                backgroundColor:
                  colors.primary,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text
              style={
                styles.backHomeButtonText
              }
            >
              Go Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const today = getToday();

  const completedDates =
    habit.completedDates ?? [];

  const currentStreak =
    getCurrentStreak(
      completedDates,
      habit.frequency ?? 'daily'
    );

  const lastSevenDays =
    getLastSevenDays();

  /*
   * Weekly statistics.
   */

  const weeklyCompleted =
    lastSevenDays.filter((date) =>
      completedDates.includes(date)
    ).length;

  const weeklyScheduled =
    lastSevenDays.filter((date) =>
      isScheduledDate(
        date,
        habit.frequency ?? 'daily'
      )
    ).length;

  const completionRate =
    weeklyScheduled === 0
      ? 0
      : Math.round(
          (weeklyCompleted /
            weeklyScheduled) *
            100
        );

  const frequencyLabel =
    FREQUENCY_LABELS[
      habit.frequency ?? 'daily'
    ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <Pressable
            style={[
              styles.backButton,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text
              style={[
                styles.backButtonText,
                {
                  color: colors.text,
                },
              ]}
            >
              ‹
            </Text>
          </Pressable>

          <Text
            style={[
              styles.headerTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Habit Detail
          </Text>

          <Pressable
            style={styles.editButton}
            onPress={() =>
              router.push({
                pathname: '/create',
                params: { id: habit.id },
              })
            }
          >
            <Text
              style={[
                styles.editButtonText,
                {
                  color: colors.primary,
                },
              ]}
            >
              Edit
            </Text>
          </Pressable>
        </View>

        {/* Habit Info */}

        <View
          style={[
            styles.heroCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.heroIcon,
              {
                backgroundColor:
                  colors.primarySoft,
              },
            ]}
          >
            <Text
              style={[
                styles.heroEmoji,
                {
                  color: colors.primary,
                },
              ]}
            >
              ✓
            </Text>
          </View>

          <Text
            style={[
              styles.habitName,
              {
                color: colors.text,
              },
            ]}
          >
            {habit.name}
          </Text>

          <Text
            style={[
              styles.habitDescription,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            {habit.description}
          </Text>
        </View>

        {/* Quick Stats */}

        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Text style={styles.statEmoji}>
              🔥
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Current Streak
            </Text>

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {currentStreak}
            </Text>

            <Text
              style={[
                styles.statUnit,
                {
                  color: colors.textMuted,
                },
              ]}
            >
              {currentStreak === 1
                ? 'day'
                : 'days'}
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Text style={styles.statEmoji}>
              ✓
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Completed
            </Text>

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {completedDates.length}
            </Text>

            <Text
              style={[
                styles.statUnit,
                {
                  color: colors.textMuted,
                },
              ]}
            >
              total
            </Text>
          </View>
        </View>

        {/* Completion */}

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Weekly Completion
          </Text>

          <View
            style={[
              styles.completionCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <View
              style={
                styles.completionHeader
              }
            >
              <Text
                style={[
                  styles.completionDescription,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                Last 7 days
              </Text>

              <Text
                style={[
                  styles.completionPercentage,
                  {
                    color:
                      colors.primary,
                  },
                ]}
              >
                {completionRate}%
              </Text>
            </View>

            <View
              style={[
                styles.progressBackground,
                {
                  backgroundColor:
                    colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${completionRate}%`,
                    backgroundColor:
                      colors.primary,
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.completionCount,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              {weeklyCompleted} of{' '}
              {weeklyScheduled} scheduled
              check-ins completed
            </Text>
          </View>
        </View>

        {/* 7 Day History */}

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Last 7 Days
          </Text>

          <View
            style={[
              styles.historyCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            {lastSevenDays.map((date) => {
              const dateObject =
                new Date(
                  `${date}T00:00:00`
                );

              const dayName =
                DAY_LABELS[
                  dateObject.getDay()
                ];

              const dayNumber =
                dateObject.getDate();

              const isCompleted =
                completedDates.includes(
                  date
                );

              const isScheduled =
                isScheduledDate(
                  date,
                  habit.frequency ??
                    'daily'
                );

              const isToday =
                date === today;

              return (
                <View
                  key={date}
                  style={
                    styles.historyItem
                  }
                >
                  <Text
                    style={[
                      styles.historyDay,
                      {
                        color:
                          colors.textSecondary,
                      },
                      isToday && {
                        color:
                          colors.primary,
                      },
                    ]}
                  >
                    {dayName}
                  </Text>

                  <View
                    style={[
                      styles.historyCircle,
                      {
                        backgroundColor:
                          colors.input,
                      },
                      isCompleted && {
                        backgroundColor:
                          completedCircleBackground,
                      },
                      !isScheduled && {
                        backgroundColor:
                          disabledCircleBackground,
                      },
                      isToday && {
                        borderWidth: 2,
                        borderColor:
                          colors.primary,
                        backgroundColor:
                          isCompleted
                            ? completedCircleBackground
                            : todayCircleBackground,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.historyCircleText,
                        {
                          color:
                            colors.textMuted,
                        },
                        isCompleted && {
                          color:
                            colors.success,
                        },
                        !isScheduled && {
                          color:
                            colors.textMuted,
                        },
                      ]}
                    >
                      {isCompleted
                        ? '✓'
                        : isScheduled
                          ? '–'
                          : '·'}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.historyNumber,
                      {
                        color:
                          colors.textMuted,
                      },
                      isToday && {
                        color:
                          colors.primary,
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {dayNumber}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Habit Settings */}

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
              },
            ]}
          >
            Habit Settings
          </Text>

          <View
            style={[
              styles.settingsCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <View style={styles.settingRow}>
              <View
                style={[
                  styles.settingIcon,
                  {
                    backgroundColor:
                      settingIconBackground,
                  },
                ]}
              >
                <Text>📅</Text>
              </View>

              <View
                style={
                  styles.settingContent
                }
              >
                <Text
                  style={[
                    styles.settingLabel,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  Frequency
                </Text>

                <Text
                  style={[
                    styles.settingValue,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {frequencyLabel}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.divider,
                {
                  backgroundColor:
                    colors.border,
                },
              ]}
            />

            <View style={styles.settingRow}>
              <View
                style={[
                  styles.settingIcon,
                  {
                    backgroundColor:
                      settingIconBackground,
                  },
                ]}
              >
                <Text>🔔</Text>
              </View>

              <View
                style={
                  styles.settingContent
                }
              >
                <Text
                  style={[
                    styles.settingLabel,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  Reminder
                </Text>

                <Text
                  style={[
                    styles.settingValue,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {habit.reminderEnabled
                    ? `Every scheduled day at ${String(
                        habit.reminderHour
                      ).padStart(
                        2,
                        '0'
                      )}:${String(
                        habit.reminderMinute
                      ).padStart(
                        2,
                        '0'
                      )}`
                    : 'Disabled'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Edit Button */}

        <Pressable
          style={({ pressed }) => [
            styles.editHabitButton,
            {
              backgroundColor:
                colors.primary,
            },
            pressed &&
              styles.editHabitButtonPressed,
          ]}
          onPress={() =>
            router.push({
              pathname: '/create',
              params: { id: habit.id },
            })
          }
        >
          <Text
            style={
              styles.editHabitButtonText
            }
          >
            ✏️ Edit Habit
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Header */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  backButtonText: {
    fontSize: 32,
    lineHeight: 36,
    marginTop: -4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  editButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },

  /* Hero */

  heroCard: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    marginBottom: 16,
  },

  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  heroEmoji: {
    fontSize: 30,
    fontWeight: '800',
  },

  habitName: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },

  habitDescription: {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
  },

  /* Stats */

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },

  statCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },

  statEmoji: {
    fontSize: 22,
    marginBottom: 10,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },

  statValue: {
    marginTop: 5,
    fontSize: 28,
    fontWeight: '800',
  },

  statUnit: {
    fontSize: 12,
  },

  /* Sections */

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },

  /* Completion */

  completionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },

  completionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  completionDescription: {
    fontSize: 13,
  },

  completionPercentage: {
    fontSize: 24,
    fontWeight: '800',
  },

  progressBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 14,
  },

  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

  completionCount: {
    marginTop: 10,
    fontSize: 12,
  },

  /* History */

  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 18,
  },

  historyItem: {
    flex: 1,
    alignItems: 'center',
  },

  historyDay: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },

  historyCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  historyCircleText: {
    fontSize: 14,
    fontWeight: '700',
  },

  historyNumber: {
    marginTop: 7,
    fontSize: 11,
  },

  /* Settings */

  settingsCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 18,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },

  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  settingContent: {
    flex: 1,
  },

  settingLabel: {
    fontSize: 13,
  },

  settingValue: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: '600',
  },

  divider: {
    height: 1,
  },

  /* Edit */

  editHabitButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },

  editHabitButtonPressed: {
    opacity: 0.7,
  },

  editHabitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  /* Not Found */

  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  notFoundEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },

  notFoundTitle: {
    fontSize: 22,
    fontWeight: '800',
  },

  notFoundDescription: {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
  },

  backHomeButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 12,
  },

  backHomeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});