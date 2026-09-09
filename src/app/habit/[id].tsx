import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const habit = useHabitStore((state) =>
    state.habits.find(
      (habit) => habit.id === id
    )
  );

  if (!habit) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>
            🔍
          </Text>

          <Text style={styles.notFoundTitle}>
            Habit Not Found
          </Text>

          <Text
            style={styles.notFoundDescription}
          >
            This habit may have been deleted.
          </Text>

          <Pressable
            style={styles.backHomeButton}
            onPress={() => router.back()}
          >
            <Text
              style={styles.backHomeButtonText}
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text
              style={styles.backButtonText}
            >
              ‹
            </Text>
          </Pressable>

          <Text style={styles.headerTitle}>
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
            <Text style={styles.editButtonText}>
              Edit
            </Text>
          </Pressable>
        </View>

        {/* Habit Info */}

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroEmoji}>
              ✓
            </Text>
          </View>

          <Text style={styles.habitName}>
            {habit.name}
          </Text>

          <Text style={styles.habitDescription}>
            {habit.description}
          </Text>
        </View>

        {/* Quick Stats */}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>
              🔥
            </Text>

            <Text style={styles.statLabel}>
              Current Streak
            </Text>

            <Text style={styles.statValue}>
              {currentStreak}
            </Text>

            <Text style={styles.statUnit}>
              {currentStreak === 1
                ? 'day'
                : 'days'}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>
              ✓
            </Text>

            <Text style={styles.statLabel}>
              Completed
            </Text>

            <Text style={styles.statValue}>
              {completedDates.length}
            </Text>

            <Text style={styles.statUnit}>
              total
            </Text>
          </View>
        </View>

        {/* Completion */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Weekly Completion
          </Text>

          <View style={styles.completionCard}>
            <View
              style={
                styles.completionHeader
              }
            >
              <Text
                style={
                  styles.completionDescription
                }
              >
                Last 7 days
              </Text>

              <Text
                style={
                  styles.completionPercentage
                }
              >
                {completionRate}%
              </Text>
            </View>

            <View
              style={
                styles.progressBackground
              }
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${completionRate}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.completionCount}>
              {weeklyCompleted} of{' '}
              {weeklyScheduled} scheduled
              check-ins completed
            </Text>
          </View>
        </View>

        {/* 7 Day History */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Last 7 Days
          </Text>

          <View style={styles.historyCard}>
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
                      isToday &&
                        styles.historyDayToday,
                    ]}
                  >
                    {dayName}
                  </Text>

                  <View
                    style={[
                      styles.historyCircle,
                      isCompleted &&
                        styles.historyCircleCompleted,
                      !isScheduled &&
                        styles.historyCircleDisabled,
                      isToday &&
                        styles.historyCircleToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.historyCircleText,
                        isCompleted &&
                          styles.historyCircleTextCompleted,
                        !isScheduled &&
                          styles.historyCircleTextDisabled,
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
                      isToday &&
                        styles.historyNumberToday,
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
          <Text style={styles.sectionTitle}>
            Habit Settings
          </Text>

          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View
                style={styles.settingIcon}
              >
                <Text>📅</Text>
              </View>

              <View
                style={styles.settingContent}
              >
                <Text
                  style={styles.settingLabel}
                >
                  Frequency
                </Text>

                <Text
                  style={
                    styles.settingValue
                  }
                >
                  {frequencyLabel}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View
                style={styles.settingIcon}
              >
                <Text>🔔</Text>
              </View>

              <View
                style={styles.settingContent}
              >
                <Text
                  style={styles.settingLabel}
                >
                  Reminder
                </Text>

                <Text
                  style={styles.settingValue}
                >
                  {habit.reminderEnabled
                    ? `Every scheduled day at ${String(
                        habit.reminderHour
                      ).padStart(2, '0')}:${String(
                        habit.reminderMinute
                      ).padStart(2, '0')}`
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
            style={styles.editHabitButtonText}
          >
            ✏️  Edit Habit
          </Text>
        </Pressable>
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButtonText: {
    fontSize: 32,
    color: '#0F172A',
    lineHeight: 36,
    marginTop: -4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },

  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  editButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },

  /* Hero */

  heroCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    marginBottom: 16,
  },

  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  heroEmoji: {
    fontSize: 30,
    fontWeight: '800',
    color: '#2563EB',
  },

  habitName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },

  habitDescription: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748B',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
  },

  statEmoji: {
    fontSize: 22,
    marginBottom: 10,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },

  statValue: {
    marginTop: 5,
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },

  statUnit: {
    fontSize: 12,
    color: '#94A3B8',
  },

  /* Sections */

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },

  /* Completion */

  completionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
  },

  completionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  completionDescription: {
    fontSize: 13,
    color: '#64748B',
  },

  completionPercentage: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563EB',
  },

  progressBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 14,
  },

  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },

  completionCount: {
    marginTop: 10,
    fontSize: 12,
    color: '#64748B',
  },

  /* History */

  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#64748B',
    marginBottom: 8,
  },

  historyDayToday: {
    color: '#2563EB',
  },

  historyCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },

  historyCircleCompleted: {
    backgroundColor: '#DCFCE7',
  },

  historyCircleDisabled: {
    backgroundColor: '#E2E8F0',
  },

  historyCircleToday: {
    borderWidth: 2,
    borderColor: '#2563EB',
  },

  historyCircleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },

  historyCircleTextCompleted: {
    color: '#16A34A',
  },

  historyCircleTextDisabled: {
    color: '#CBD5E1',
  },

  historyNumber: {
    marginTop: 7,
    fontSize: 11,
    color: '#94A3B8',
  },

  historyNumberToday: {
    color: '#2563EB',
    fontWeight: '700',
  },

  /* Settings */

  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  settingContent: {
    flex: 1,
  },

  settingLabel: {
    fontSize: 13,
    color: '#64748B',
  },

  settingValue: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },

  /* Edit */

  editHabitButton: {
    backgroundColor: '#0F172A',
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
    color: '#0F172A',
  },

  notFoundDescription: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },

  backHomeButton: {
    marginTop: 20,
    backgroundColor: '#0F172A',
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