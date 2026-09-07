import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHabitStore } from '@/store/habit-store';

import {
  getCurrentStreak,
  getLastSevenDays,
  getToday,
  isScheduledDate,
} from '@/utils/date';

export default function StatisticsScreen() {
  const habits = useHabitStore(
    (state) => state.habits
  );

  const today = getToday();

   const scheduledHabits = habits.filter(
      (habit) =>
        isScheduledDate(
          today,
          habit.frequency ?? 'daily'
        )
    );

  /*
   * Habits yang memang dijadwalkan
   * untuk hari ini.
   */
  const scheduledHabitsToday =
    habits.filter((habit) =>
      isScheduledDate(
        today,
        habit.frequency ?? 'daily'
      )
    );

  /*
   * Jumlah habit yang selesai hari ini.
   */
  const completedToday =
    scheduledHabits.filter((habit) =>
      habit.completedDates?.includes(today)
    ).length;

  /*
   * Total habit yang seharusnya
   * dikerjakan hari ini.
   */
  const totalHabits =
    scheduledHabitsToday.length;

  /*
   * Semua tanggal completion.
   */
  const allCompletedDates =
    habits.flatMap(
      (habit) =>
        habit.completedDates ?? []
    );

  const currentStreak =
    getCurrentStreak(
      [
        ...new Set(
          allCompletedDates
        ),
      ]
    );

  /*
   * Completion rate hari ini.
   */
  const completionRate =
    totalHabits === 0
      ? 0
      : Math.round(
          (completedToday /
            totalHabits) *
            100
        );

  const lastSevenDays =
    getLastSevenDays();

  /*
   * Menghitung completion untuk
   * tanggal tertentu.
   *
   * Hanya habit yang scheduled
   * pada tanggal tersebut yang dihitung.
   */
  const getCompletedCount = (
    date: string
  ) => {
    const scheduledHabits =
      habits.filter((habit) =>
        isScheduledDate(
          date,
          habit.frequency ?? 'daily'
        )
      );

    return scheduledHabits.filter(
      (habit) =>
        habit.completedDates?.includes(
          date
        )
    ).length;
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <Text style={styles.title}>
          Statistics
        </Text>

        <Text style={styles.subtitle}>
          Track your habit progress
        </Text>

        {/* Current Streak */}
        <View style={styles.streakCard}>
          <Text
            style={styles.streakEmoji}
          >
            🔥
          </Text>

          <View>
            <Text
              style={styles.streakNumber}
            >
              {currentStreak}{' '}
              {currentStreak === 1
                ? 'Day'
                : 'Days'}
            </Text>

            <Text
              style={styles.streakLabel}
            >
              Current Streak
            </Text>
          </View>
        </View>

        {/* Completion Rate */}
        <View
          style={styles.progressCard}
        >
          <Text style={styles.cardLabel}>
            Today's Progress
          </Text>

          <Text
            style={styles.percentage}
          >
            {completionRate}%
          </Text>

          <Text
            style={styles.completedText}
          >
            {completedToday} of{' '}
            {totalHabits} habits
            {' '}
            completed
          </Text>

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
        </View>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <View
            style={styles.summaryCard}
          >
            <Text
              style={styles.summaryEmoji}
            >
              ✅
            </Text>

            <Text
              style={styles.summaryNumber}
            >
              {completedToday}
            </Text>

            <Text
              style={styles.summaryLabel}
            >
              Completed
            </Text>
          </View>

          <View
            style={styles.summaryCard}
          >
            <Text
              style={styles.summaryEmoji}
            >
              📋
            </Text>

            <Text
              style={styles.summaryNumber}
            >
              {totalHabits}
            </Text>

            <Text
              style={styles.summaryLabel}
            >
              Today's Habits
            </Text>
          </View>
        </View>

        {/* Last 7 Days */}
        <View
          style={styles.historyCard}
        >
          <Text
            style={styles.historyTitle}
          >
            Last 7 Days
          </Text>

          <View style={styles.daysRow}>
            {lastSevenDays.map(
              (date) => {
                const completedCount =
                  getCompletedCount(
                    date
                  );

                const day =
                  new Date(
                    `${date}T00:00:00`
                  ).toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'short',
                    }
                  );

                return (
                  <View
                    key={date}
                    style={
                      styles.dayItem
                    }
                  >
                    <Text
                      style={
                        styles.dayLabel
                      }
                    >
                      {day.charAt(0)}
                    </Text>

                    <View
                      style={[
                        styles.dayCircle,
                        completedCount >
                          0 &&
                          styles.dayCircleCompleted,
                      ]}
                    >
                      {completedCount >
                        0 && (
                        <Text
                          style={
                            styles.dayCheck
                          }
                        >
                          {
                            completedCount
                          }
                        </Text>
                      )}
                    </View>
                  </View>
                );
              }
            )}
          </View>
        </View>
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

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 24,
  },

  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },

  cardLabel: {
    fontSize: 15,
    color: '#64748B',
  },

  percentage: {
    fontSize: 48,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },

  completedText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 18,
  },

  progressBackground: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#16A34A',
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },

  summaryEmoji: {
    fontSize: 24,
    marginBottom: 12,
  },

  summaryNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },

  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },

  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },

  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dayItem: {
    alignItems: 'center',
    gap: 8,
  },

  dayLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayCircleCompleted: {
    backgroundColor: '#16A34A',
  },

  dayCheck: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  streakEmoji: {
    fontSize: 32,
    marginRight: 16,
  },

  streakNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#9A3412',
  },

  streakLabel: {
    fontSize: 14,
    color: '#C2410C',
    marginTop: 2,
  },
});