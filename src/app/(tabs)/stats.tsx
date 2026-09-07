import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHabitStore } from '@/store/habit-store';
import { getToday } from '@/utils/date';


const getLastSevenDays = () => {
  const days: string[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    days.push(
      date.toISOString().split('T')[0]
    );
  }

  return days;
};

export default function StatisticsScreen() {
  const habits = useHabitStore(
    (state) => state.habits
  );

  const today = getToday();

  const completedToday = habits.filter(
    (habit) =>
      habit.completedDates?.includes(today)
  ).length;

  const totalHabits = habits.length;

  const completionRate =
    totalHabits === 0
      ? 0
      : Math.round(
          (completedToday / totalHabits) * 100
        );

  const lastSevenDays = getLastSevenDays();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Statistics
        </Text>

        <Text style={styles.subtitle}>
          Track your habit progress
        </Text>

        {/* Completion Rate */}
        <View style={styles.progressCard}>
          <Text style={styles.cardLabel}>
            Today's Progress
          </Text>

          <Text style={styles.percentage}>
            {completionRate}%
          </Text>

          <Text style={styles.completedText}>
            {completedToday} of {totalHabits}{' '}
            habits completed
          </Text>

          <View style={styles.progressBackground}>
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
          <View style={styles.summaryCard}>
            <Text style={styles.summaryEmoji}>
              ✅
            </Text>

            <Text style={styles.summaryNumber}>
              {completedToday}
            </Text>

            <Text style={styles.summaryLabel}>
              Completed
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryEmoji}>
              📋
            </Text>

            <Text style={styles.summaryNumber}>
              {totalHabits}
            </Text>

            <Text style={styles.summaryLabel}>
              Total Habits
            </Text>
          </View>
        </View>

        {/* Last 7 Days */}
        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>
            Last 7 Days
          </Text>

          <View style={styles.daysRow}>
            {lastSevenDays.map((date) => {
              const hasCompleted = habits.some(
                (habit) =>
                  habit.completedDates?.includes(
                    date
                  )
              );

              const day = new Date(
                `${date}T00:00:00`
              ).toLocaleDateString('en-US', {
                weekday: 'short',
              });

              return (
                <View
                  key={date}
                  style={styles.dayItem}
                >
                  <Text style={styles.dayLabel}>
                    {day.charAt(0)}
                  </Text>

                  <View
                    style={[
                      styles.dayCircle,
                      hasCompleted &&
                        styles.dayCircleCompleted,
                    ]}
                  >
                    {hasCompleted && (
                      <Text
                        style={styles.dayCheck}
                      >
                        ✓
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
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
    width: 34,
    height: 34,
    borderRadius: 17,
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
  },
});