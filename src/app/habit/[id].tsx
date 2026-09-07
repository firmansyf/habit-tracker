import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useState } from 'react';
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

import {
  formatDate,
  getCurrentStreak,
  getDaysInMonth,
  getFirstDayOfMonth,
  getToday,
} from '@/utils/date';

import { isScheduledDate } from '@/utils/frequency';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_NAMES = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

const getFrequencyLabel = (
  frequency?: string
): string => {
  switch (frequency) {
    case 'weekdays':
      return 'Weekdays';

    case 'weekends':
      return 'Weekends';

    case 'daily':
    default:
      return 'Every Day';
  }
};

export default function HabitDetailScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [calendarDate, setCalendarDate] =
    useState(new Date());

  const habit = useHabitStore((state) =>
    state.habits.find(
      (item) => item.id === id
    )
  );

  const deleteHabit = useHabitStore(
    (state) => state.deleteHabit
  );

  if (!habit) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        <SafeAreaView style={styles.container}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              Habit not found
            </Text>

            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text
                style={styles.backButtonText}
              >
                Go Back
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const streak = getCurrentStreak(
    habit.completedDates
  );

  const completedCount =
    habit.completedDates.length;

  const frequency =
    habit.frequency ?? 'daily';

  const frequencyLabel =
    getFrequencyLabel(frequency);

  const calendarYear =
    calendarDate.getFullYear();

  const calendarMonth =
    calendarDate.getMonth();

  const daysInMonth = getDaysInMonth(
    calendarYear,
    calendarMonth
  );

  const firstDay = getFirstDayOfMonth(
    calendarYear,
    calendarMonth
  );

  const today = getToday();

  const handlePreviousMonth = () => {
    setCalendarDate(
      new Date(
        calendarYear,
        calendarMonth - 1,
        1
      )
    );
  };

  const handleNextMonth = () => {
    setCalendarDate(
      new Date(
        calendarYear,
        calendarMonth + 1,
        1
      )
    );
  };

  const handleEdit = () => {
    router.push({
      pathname: '/create',
      params: {
        id: habit.id,
      },
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteHabit(habit.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            style={styles.back}
          >
            <Text style={styles.backText}>
              ← Back
            </Text>
          </Pressable>

          {/* Habit Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {habit.name}
            </Text>

            <Text style={styles.description}>
              {habit.description ||
                'No description'}
            </Text>

            {/* Frequency */}
            <View
              style={styles.frequencyBadge}
            >
              <Text
                style={styles.frequencyBadgeLabel}
              >
                Frequency
              </Text>

              <Text
                style={styles.frequencyBadgeValue}
              >
                {frequencyLabel}
              </Text>
            </View>
          </View>

          {/* Statistics */}
          <View
            style={styles.statsContainer}
          >
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>
                🔥
              </Text>

              <Text style={styles.statValue}>
                {streak}
              </Text>

              <Text style={styles.statLabel}>
                Current Streak
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>
                ✅
              </Text>

              <Text style={styles.statValue}>
                {completedCount}
              </Text>

              <Text style={styles.statLabel}>
                Completed
              </Text>
            </View>
          </View>

          {/* Calendar */}
          <View
            style={styles.calendarSection}
          >
            <Text style={styles.sectionTitle}>
              Completion Calendar
            </Text>

            {/* Calendar Header */}
            <View
              style={styles.calendarHeader}
            >
              <Pressable
                onPress={
                  handlePreviousMonth
                }
                style={styles.monthButton}
              >
                <Text
                  style={
                    styles.monthButtonText
                  }
                >
                  ‹
                </Text>
              </Pressable>

              <Text
                style={styles.monthTitle}
              >
                {MONTH_NAMES[calendarMonth]}{' '}
                {calendarYear}
              </Text>

              <Pressable
                onPress={handleNextMonth}
                style={styles.monthButton}
              >
                <Text
                  style={
                    styles.monthButtonText
                  }
                >
                  ›
                </Text>
              </Pressable>
            </View>

            {/* Days */}
            <View style={styles.weekHeader}>
              {DAY_NAMES.map((day) => (
                <View
                  key={day}
                  style={styles.dayHeader}
                >
                  <Text
                    style={
                      styles.dayHeaderText
                    }
                  >
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View
              style={styles.calendarGrid}
            >
              {/* Empty cells before first day */}
              {Array.from({
                length: firstDay,
              }).map((_, index) => (
                <View
                  key={`empty-${index}`}
                  style={styles.calendarDay}
                />
              ))}

              {/* Calendar days */}
              {Array.from({
                length: daysInMonth,
              }).map((_, index) => {
                const day = index + 1;

                const date = formatDate(
                  calendarYear,
                  calendarMonth,
                  day
                );

                const isCompleted =
                  habit.completedDates.includes(
                    date
                  );

                const isToday =
                  date === today;

                const isScheduled =
                  isScheduledDate(
                    date,
                    frequency
                  );

                return (
                  <View
                    key={date}
                    style={styles.calendarDay}
                  >
                    <View
                      style={[
                        styles.dayCircle,

                        !isScheduled &&
                          styles.unscheduledCircle,

                        isToday &&
                          styles.todayCircle,

                        isCompleted &&
                          styles.completedCircle,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,

                          !isScheduled &&
                            styles.unscheduledText,

                          isToday &&
                            styles.todayText,

                          isCompleted &&
                            styles.completedText,
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              <View
                style={styles.legendItem}
              >
                <View
                  style={[
                    styles.legendCircle,
                    styles.completedCircle,
                  ]}
                >
                  <Text
                    style={styles.completedText}
                  >
                    ✓
                  </Text>
                </View>

                <Text style={styles.legendText}>
                  Completed
                </Text>
              </View>

              <View
                style={styles.legendItem}
              >
                <View
                  style={[
                    styles.legendCircle,
                    styles.todayCircle,
                  ]}
                />

                <Text style={styles.legendText}>
                  Today
                </Text>
              </View>

              <View
                style={styles.legendItem}
              >
                <View
                  style={[
                    styles.legendCircle,
                    styles.unscheduledCircle,
                  ]}
                />

                <Text style={styles.legendText}>
                  Not scheduled
                </Text>
              </View>
            </View>
          </View>

          {/* Completion History */}
          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
            >
              Completion History
            </Text>

            {habit.completedDates.length ===
            0 ? (
              <Text
                style={styles.emptyHistory}
              >
                No completion history yet.
              </Text>
            ) : (
              [...habit.completedDates]
                .reverse()
                .map((date) => (
                  <View
                    key={date}
                    style={styles.historyItem}
                  >
                    <Text
                      style={
                        styles.historyIcon
                      }
                    >
                      ✓
                    </Text>

                    <Text
                      style={
                        styles.historyDate
                      }
                    >
                      {date}
                    </Text>
                  </View>
                ))
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.editButton,
                pressed &&
                  styles.buttonPressed,
              ]}
              onPress={handleEdit}
            >
              <Text
                style={styles.editButtonText}
              >
                Edit Habit
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.deleteButton,
                pressed &&
                  styles.buttonPressed,
              ]}
              onPress={handleDelete}
            >
              <Text
                style={
                  styles.deleteButtonText
                }
              >
                Delete Habit
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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

  back: {
    marginBottom: 24,
  },

  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#64748B',
  },

  frequencyBadge: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  frequencyBadgeLabel: {
    fontSize: 13,
    color: '#64748B',
  },

  frequencyBadgeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },

  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },

  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },

  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },

  statLabel: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },

  calendarSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },

  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },

  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  monthTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },

  monthButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  monthButtonText: {
    fontSize: 28,
    lineHeight: 30,
    color: '#2563EB',
  },

  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  dayHeader: {
    flex: 1,
    alignItems: 'center',
  },

  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  calendarDay: {
    width: '14.2857%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayText: {
    fontSize: 14,
    color: '#334155',
  },

  unscheduledCircle: {
    backgroundColor: '#F1F5F9',
  },

  unscheduledText: {
    color: '#CBD5E1',
  },

  completedCircle: {
    backgroundColor: '#DCFCE7',
  },

  completedText: {
    color: '#16A34A',
    fontWeight: '700',
  },

  todayCircle: {
    borderWidth: 2,
    borderColor: '#2563EB',
  },

  todayText: {
    color: '#2563EB',
    fontWeight: '700',
  },

  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  legendCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  legendText: {
    fontSize: 12,
    color: '#64748B',
  },

  emptyHistory: {
    fontSize: 14,
    color: '#94A3B8',
  },

  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  historyIcon: {
    marginRight: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#16A34A',
  },

  historyDate: {
    fontSize: 15,
    color: '#334155',
  },

  actions: {
    gap: 12,
  },

  editButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  deleteButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  deleteButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },

  buttonPressed: {
    opacity: 0.8,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});