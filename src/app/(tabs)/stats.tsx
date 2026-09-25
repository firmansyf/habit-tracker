import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/useAppTheme';
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
  const { colors, colorScheme } =
    useAppTheme();

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

  /*
   * Dark mode specific colors.
   */
  const completionCardBackground =
    colorScheme === 'dark'
      ? '#1E293B'
      : '#0F172A';

  const completionProgressBackground =
    colorScheme === 'dark'
      ? '#334155'
      : '#334155';

  const statCardBackground =
    colors.card;

  const calendarCompletedBackground =
    colorScheme === 'dark'
      ? '#14532D'
      : '#DCFCE7';

  const barActiveBackground =
    colorScheme === 'dark'
      ? '#1E40AF'
      : '#BFDBFE';

  const emptyBackground =
    colors.card;

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
        contentContainerStyle={
          styles.content
        }
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
            Statistics
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            Track your progress and consistency
          </Text>
        </View>

        {/* Completion Card */}

        <View
          style={[
            styles.completionCard,
            {
              backgroundColor:
                completionCardBackground,
            },
          ]}
        >
          <View
            style={
              styles.completionHeader
            }
          >
            <View>
              <Text
                style={[
                  styles.completionLabel,
                  {
                    color: '#FFFFFF',
                  },
                ]}
              >
                Weekly Completion
              </Text>

              <Text
                style={[
                  styles.completionDescription,
                  {
                    color: '#CBD5E1',
                  },
                ]}
              >
                Your progress over the last
                7 days
              </Text>
            </View>

            <Text
              style={[
                styles.completionPercentage,
                {
                  color: '#FFFFFF',
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
                  completionProgressBackground,
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
                color: '#CBD5E1',
              },
            ]}
          >
            {weeklyCompleted} of{' '}
            {weeklyScheduled} habit check-ins
            completed
          </Text>
        </View>

        {/* Streak Cards */}

        <View
          style={styles.statsRow}
        >
          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  statCardBackground,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Text
              style={styles.statEmoji}
            >
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
                  color:
                    colors.textMuted,
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
                  statCardBackground,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Text
              style={styles.statEmoji}
            >
              🏆
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
              Best Streak
            </Text>

            <Text
              style={[
                styles.statValue,
                {
                  color: colors.text,
                },
              ]}
            >
              {bestStreak}
            </Text>

            <Text
              style={[
                styles.statUnit,
                {
                  color:
                    colors.textMuted,
                },
              ]}
            >
              {bestStreak === 1
                ? 'day'
                : 'days'}
            </Text>
          </View>
        </View>

        {/* Total Completed */}

        <View
          style={[
            styles.totalCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          <View>
            <Text
              style={[
                styles.totalLabel,
                {
                  color: colors.text,
                },
              ]}
            >
              Total Completed
            </Text>

            <Text
              style={[
                styles.totalDescription,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              All completed habits
            </Text>
          </View>

          <Text
            style={[
              styles.totalValue,
              {
                color: colors.primary,
              },
            ]}
          >
            {totalCompleted}
          </Text>
        </View>

        {/* Weekly Activity */}

        <View style={styles.section}>
          <View
            style={styles.sectionHeader}
          >
            <View>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Weekly Activity
              </Text>

              <Text
                style={[
                  styles.sectionSubtitle,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                Last 7 days
              </Text>
            </View>

            <Text
              style={[
                styles.weeklyTotal,
                {
                  color: colors.primary,
                },
              ]}
            >
              {weeklyCompleted} completed
            </Text>
          </View>

          <View
            style={[
              styles.activityCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
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
                            height:
                              barHeight,
                            backgroundColor:
                              colors.border,
                          },

                          day.completedCount >
                            0 && {
                            backgroundColor:
                              barActiveBackground,
                          },

                          isToday && {
                            backgroundColor:
                              colors.primary,
                          },
                        ]}
                      />
                    </View>

                    <Text
                      style={[
                        styles.dayLabel,
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

                    <Text
                      style={[
                        styles.dayNumber,
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
              }
            )}
          </View>
        </View>

        {/* Monthly Calendar */}

        <View style={styles.section}>
          <View
            style={styles.sectionHeader}
          >
            <View>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Monthly Activity
              </Text>

              <Text
                style={[
                  styles.sectionSubtitle,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                {monthName}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.calendarCard,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            {/* Day headers */}

            <View
              style={
                styles.calendarRow
              }
            >
              {DAY_LABELS.map(
                (day) => (
                  <Text
                    key={day}
                    style={[
                      styles.calendarDayHeader,
                      {
                        color:
                          colors.textMuted,
                      },
                    ]}
                  >
                    {day.charAt(0)}
                  </Text>
                )
              )}
            </View>

            {/* Calendar */}

            <View
              style={
                styles.calendarGrid
              }
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

                          completed > 0 && {
                            backgroundColor:
                              calendarCompletedBackground,
                          },

                          isToday && {
                            borderWidth: 2,
                            borderColor:
                              colors.primary,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.calendarNumber,
                            {
                              color:
                                colors.textSecondary,
                            },

                            completed >
                              0 && {
                              color:
                                colors.success,
                              fontWeight:
                                '700',
                            },

                            isToday && {
                              color:
                                colors.primary,
                            },
                          ]}
                        >
                          {new Date(
                            `${date}T00:00:00`
                          ).getDate()}
                        </Text>
                      </View>

                      {completed > 0 && (
                        <View
                          style={[
                            styles.activityDot,
                            {
                              backgroundColor:
                                colors.success,
                            },
                          ]}
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
            style={[
              styles.emptyCard,
              {
                backgroundColor:
                  emptyBackground,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Text
              style={styles.emptyEmoji}
            >
              📊
            </Text>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              No statistics yet
            </Text>

            <Text
              style={[
                styles.emptyDescription,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
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
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
  },

  /* Completion */

  completionCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },

  completionHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  completionLabel: {
    fontSize: 17,
    fontWeight: '700',
  },

  completionDescription: {
    marginTop: 5,
    fontSize: 13,
  },

  completionPercentage: {
    fontSize: 30,
    fontWeight: '800',
  },

  progressBackground: {
    height: 8,
    borderRadius: 4,
    marginTop: 20,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

  completionCount: {
    marginTop: 10,
    fontSize: 12,
  },

  /* Stats */

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
  },

  statEmoji: {
    fontSize: 24,
    marginBottom: 10,
  },

  statLabel: {
    fontSize: 13,
    fontWeight: '600',
  },

  statValue: {
    marginTop: 5,
    fontSize: 30,
    fontWeight: '800',
  },

  statUnit: {
    fontSize: 12,
  },

  /* Total */

  totalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginBottom: 28,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },

  totalDescription: {
    marginTop: 4,
    fontSize: 13,
  },

  totalValue: {
    fontSize: 32,
    fontWeight: '800',
  },

  /* Section */

  section: {
    marginBottom: 28,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
  },

  weeklyTotal: {
    fontSize: 12,
    fontWeight: '600',
  },

  /* Weekly Activity */

  activityCard: {
    height: 190,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent:
      'space-around',
    borderRadius: 18,
    borderWidth: 1,
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
    justifyContent:
      'flex-end',
  },

  bar: {
    width: 18,
    borderRadius: 9,
  },

  dayLabel: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '600',
  },

  dayNumber: {
    marginTop: 3,
    fontSize: 11,
  },

  /* Calendar */

  calendarCard: {
    borderRadius: 18,
    borderWidth: 1,
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

  calendarNumber: {
    fontSize: 13,
    fontWeight: '600',
  },

  activityDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  /* Empty */

  emptyCard: {
    alignItems: 'center',
    borderRadius: 18,
    padding: 30,
    borderWidth: 1,
  },

  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  emptyDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});