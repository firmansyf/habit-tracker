import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHabitStore } from '@/store/habit-store';

import {
  formatDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  getLastSevenDays,
  getOverallBestStreak,
  getOverallCurrentStreak,
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

export default function StatsScreen() {
  const habits = useHabitStore(
    (state) => state.habits
  );

  const today = getToday();

  /*
   * Total completion.
   */
  const totalCompleted = habits.reduce(
    (total, habit) =>
      total +
      (habit.completedDates?.length ?? 0),
    0
  );

  /*
   * Current streak per habit.
   *
   * Kita ambil streak terbaik saat ini
   * dari semua habit.
   */
  const currentStreak =
  getOverallCurrentStreak(habits);

  /*
   * Best streak per habit.
   */
  const bestStreak =
  getOverallBestStreak(habits);

  /*
   * Weekly activity.
   */
  const lastSevenDays =
    getLastSevenDays();

  const weeklyActivity =
    lastSevenDays.map((date) => {
      const completedCount =
        habits.filter((habit) =>
          habit.completedDates?.includes(
            date
          )
        ).length;

      const scheduledCount =
        habits.filter((habit) =>
          isScheduledDate(
            date,
            habit.frequency ?? 'daily'
          )
        ).length;

      return {
        date,
        completedCount,
        scheduledCount,
      };
    });

  const weeklyCompleted =
    weeklyActivity.reduce(
      (total, day) =>
        total + day.completedCount,
      0
    );

  const weeklyScheduled =
    weeklyActivity.reduce(
      (total, day) =>
        total + day.scheduledCount,
      0
    );

  const completionRate =
    weeklyScheduled === 0
      ? 0
      : Math.round(
          (weeklyCompleted /
            weeklyScheduled) *
            100
        );

  const maxWeeklyActivity =
    Math.max(
      ...weeklyActivity.map(
        (day) => day.completedCount
      ),
      1
    );

  /*
   * Monthly calendar.
   */
  const todayDate = new Date(
    `${today}T00:00:00`
  );

  const currentYear =
    todayDate.getFullYear();

  const currentMonth =
    todayDate.getMonth();

  const daysInMonth =
    getDaysInMonth(
      currentYear,
      currentMonth
    );

  const firstDay =
    getFirstDayOfMonth(
      currentYear,
      currentMonth
    );

  const calendarDays: (
    string | null
  )[] = [];

  /*
   * Empty cells before day 1.
   */
  for (
    let i = 0;
    i < firstDay;
    i++
  ) {
    calendarDays.push(null);
  }

  /*
   * Actual days.
   */
  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(
      formatDate(
        currentYear,
        currentMonth,
        day
      )
    );
  }

  const monthName =
    todayDate.toLocaleDateString(
      'en-US',
      {
        month: 'long',
        year: 'numeric',
      }
    );

  const getCompletedCount =
    (date: string) =>
      habits.filter((habit) =>
        habit.completedDates?.includes(
          date
        )
      ).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <Text style={styles.title}>
            Statistics
          </Text>

          <Text style={styles.subtitle}>
            Track your progress and consistency
          </Text>
        </View>

        {/* Completion Card */}

        <View style={styles.completionCard}>
          <View
            style={
              styles.completionHeader
            }
          >
            <View>
              <Text
                style={
                  styles.completionLabel
                }
              >
                Weekly Completion
              </Text>

              <Text
                style={
                  styles.completionDescription
                }
              >
                Your progress over the last
                7 days
              </Text>
            </View>

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
            {weeklyScheduled} habit check-ins completed
          </Text>
        </View>

        {/* Streak Cards */}

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
              🏆
            </Text>

            <Text style={styles.statLabel}>
              Best Streak
            </Text>

            <Text style={styles.statValue}>
              {bestStreak}
            </Text>

            <Text style={styles.statUnit}>
              {bestStreak === 1
                ? 'day'
                : 'days'}
            </Text>
          </View>
        </View>

        {/* Total Completed */}

        <View style={styles.totalCard}>
          <View>
            <Text style={styles.totalLabel}>
              Total Completed
            </Text>

            <Text
              style={styles.totalDescription}
            >
              All completed habits
            </Text>
          </View>

          <Text style={styles.totalValue}>
            {totalCompleted}
          </Text>
        </View>

        {/* Weekly Activity */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Weekly Activity
              </Text>

              <Text
                style={
                  styles.sectionSubtitle
                }
              >
                Last 7 days
              </Text>
            </View>

            <Text
              style={styles.weeklyTotal}
            >
              {weeklyCompleted} completed
            </Text>
          </View>

          <View
            style={styles.activityCard}
          >
            {weeklyActivity.map(
              (day) => {
                const date =
                  new Date(
                    `${day.date}T00:00:00`
                  );

                const dayName =
                  DAY_LABELS[
                    date.getDay()
                  ];

                const dayNumber =
                  date.getDate();

                const barHeight =
                  day.completedCount ===
                  0
                    ? 6
                    : Math.max(
                        12,
                        (day.completedCount /
                          maxWeeklyActivity) *
                          100
                      );

                const isToday =
                  day.date === today;

                return (
                  <View
                    key={day.date}
                    style={
                      styles.activityColumn
                    }
                  >
                    <View
                      style={
                        styles.barContainer
                      }
                    >
                      <View
                        style={[
                          styles.bar,
                          {
                            height: barHeight,
                          },
                          day.completedCount >
                            0 &&
                            styles.barActive,
                          isToday &&
                            styles.barToday,
                        ]}
                      />
                    </View>

                    <Text
                      style={[
                        styles.dayLabel,
                        isToday &&
                          styles.dayLabelToday,
                      ]}
                    >
                      {dayName}
                    </Text>

                    <Text
                      style={[
                        styles.dayNumber,
                        isToday &&
                          styles.dayNumberToday,
                      ]}
                    >
                      {dayNumber}
                    </Text>
                  </View>
                );
              }
            )}
          </View>
        </View>

        {/* Monthly Calendar */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Monthly Activity
              </Text>

              <Text
                style={
                  styles.sectionSubtitle
                }
              >
                {monthName}
              </Text>
            </View>
          </View>

          <View
            style={styles.calendarCard}
          >
            {/* Day headers */}

            <View
              style={styles.calendarRow}
            >
              {DAY_LABELS.map(
                (day) => (
                  <Text
                    key={day}
                    style={
                      styles.calendarDayHeader
                    }
                  >
                    {day.charAt(0)}
                  </Text>
                )
              )}
            </View>

            {/* Calendar */}

            <View
              style={styles.calendarGrid}
            >
              {calendarDays.map(
                (date, index) => {
                  if (!date) {
                    return (
                      <View
                        key={`empty-${index}`}
                        style={
                          styles.calendarDay
                        }
                      />
                    );
                  }

                  const completed =
                    getCompletedCount(
                      date
                    );

                  const isToday =
                    date === today;

                  return (
                    <View
                      key={date}
                      style={
                        styles.calendarDay
                      }
                    >
                      <View
                        style={[
                          styles.calendarCircle,
                          completed > 0 &&
                            styles.calendarCircleCompleted,
                          isToday &&
                            styles.calendarCircleToday,
                        ]}
                      >
                        <Text
                          style={[
                            styles.calendarNumber,
                            completed > 0 &&
                              styles.calendarNumberCompleted,
                            isToday &&
                              styles.calendarNumberToday,
                          ]}
                        >
                          {new Date(
                            `${date}T00:00:00`
                          ).getDate()}
                        </Text>
                      </View>

                      {completed > 0 && (
                        <View
                          style={
                            styles.activityDot
                          }
                        />
                      )}
                    </View>
                  );
                }
              )}
            </View>
          </View>
        </View>

        {/* Empty State */}

        {habits.length === 0 && (
          <View
            style={styles.emptyCard}
          >
            <Text style={styles.emptyEmoji}>
              📊
            </Text>

            <Text style={styles.emptyTitle}>
              No statistics yet
            </Text>

            <Text
              style={
                styles.emptyDescription
              }
            >
              Start completing your habits
              to see your progress here.
            </Text>
          </View>
        )}
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
    marginBottom: 24,
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

  /* Completion */

  completionCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  completionLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  completionDescription: {
    marginTop: 5,
    fontSize: 13,
    color: '#CBD5E1',
  },

  completionPercentage: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  progressBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#334155',
    marginTop: 20,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#60A5FA',
  },

  completionCount: {
    marginTop: 10,
    fontSize: 12,
    color: '#CBD5E1',
  },

  /* Stats */

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  statEmoji: {
    fontSize: 24,
    marginBottom: 10,
  },

  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  statValue: {
    marginTop: 5,
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
  },

  statUnit: {
    fontSize: 12,
    color: '#94A3B8',
  },

  /* Total */

  totalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 28,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  totalDescription: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },

  totalValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2563EB',
  },

  /* Section */

  section: {
    marginBottom: 28,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },

  weeklyTotal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },

  /* Weekly Activity */

  activityCard: {
    height: 190,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 18,
  },

  activityColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },

  barContainer: {
    height: 105,
    justifyContent: 'flex-end',
  },

  bar: {
    width: 18,
    borderRadius: 9,
    backgroundColor: '#E2E8F0',
  },

  barActive: {
    backgroundColor: '#BFDBFE',
  },

  barToday: {
    backgroundColor: '#2563EB',
  },

  dayLabel: {
    marginTop: 10,
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },

  dayLabelToday: {
    color: '#2563EB',
  },

  dayNumber: {
    marginTop: 3,
    fontSize: 11,
    color: '#94A3B8',
  },

  dayNumberToday: {
    color: '#2563EB',
    fontWeight: '700',
  },

  /* Calendar */

  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },

  calendarRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  calendarDayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  calendarDay: {
    width: '14.2857%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendarCircleCompleted: {
    backgroundColor: '#DCFCE7',
  },

  calendarCircleToday: {
    borderWidth: 2,
    borderColor: '#2563EB',
  },

  calendarNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },

  calendarNumberCompleted: {
    color: '#16A34A',
    fontWeight: '700',
  },

  calendarNumberToday: {
    color: '#2563EB',
  },

  activityDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#16A34A',
  },

  /* Empty */

  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 30,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  emptyDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    color: '#64748B',
  },
});