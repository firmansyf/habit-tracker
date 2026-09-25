import { useRouter } from 'expo-router';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/EmptyState';
import HabitCard from '@/components/HabitCard';
import ProgressCard from '@/components/ProgressCard';
import StreakCard from '@/components/StreakCard';

import { useAppTheme } from '@/hooks/useAppTheme';

import { useHabitStore } from '@/store/habit-store';

import {
  getCurrentStreak,
  getToday,
  isScheduledDate,
} from '@/utils/date';

import { cancelHabitReminder } from '@/utils/notification';

import {
  getGreeting,
  getInitial,
} from '@/utils/greeting';

import { useEffect } from 'react';

export default function HomeScreen() {
  const router = useRouter();

  const { colors } = useAppTheme();

  const greeting = getGreeting();

  const habits = useHabitStore(
    (state) => state.habits
  );

  const toggleHabit = useHabitStore(
    (state) => state.toggleHabit
  );

  const username = useHabitStore(
    (state) => state.username
  );

  const deleteHabit = useHabitStore(
    (state) => state.deleteHabit
  );

  const initial = getInitial(
    username ?? ''
  );

  const today = getToday();

  const scheduledHabits = habits.filter(
    (habit) =>
      isScheduledDate(
        today,
        habit.frequency ?? 'daily'
      )
  );

  const completedHabits =
    scheduledHabits.filter(
      (habit) =>
        habit.completedDates.includes(today)
    ).length;

  const totalHabits =
    scheduledHabits.length;

  const allCompletedDates =
    habits.flatMap(
      (habit) =>
        habit.completedDates ?? []
    );

  const currentStreak =
    getCurrentStreak([
      ...new Set(allCompletedDates),
    ]);

  const handleDeleteHabit = (
    id: string,
    name: string,
    notificationIds: string[]
  ) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            try {
              await cancelHabitReminder(
                notificationIds
              );

              deleteHabit(id);
            } catch (error) {
              console.error(
                'Failed to cancel habit reminder:',
                error
              );

              deleteHabit(id);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (!username) {
      router.replace('/welcome');
    }
  }, [username, router]);

  if (!username) {
    return null;
  }

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
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}

            <View style={styles.header}>
              <View>
                <Text
                  style={[
                    styles.greeting,
                    {
                      color:
                        colors.textSecondary,
                    },
                  ]}
                >
                  {greeting} 👋
                </Text>

                <Text
                  style={[
                    styles.name,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {username}
                </Text>
              </View>

              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor:
                      colors.primary,
                  },
                ]}
              >
                <Text
                  style={styles.avatarText}
                >
                  {initial}
                </Text>
              </View>
            </View>

            {/* Streak */}

            <StreakCard
              currentStreak={
                currentStreak
              }
            />

            {/* Progress */}

            <ProgressCard
              completedHabits={
                completedHabits
              }
              totalHabits={
                totalHabits
              }
            />
          </View>
        }
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onToggle={() =>
              toggleHabit(item.id)
            }
            onEdit={() =>
              router.push({
                pathname: '/create',
                params: {
                  id: item.id,
                },
              })
            }
            onDelete={() =>
              handleDeleteHabit(
                item.id,
                item.name,
                item.notificationIds ??
                  []
              )
            }
            onDetail={() =>
              router.push({
                pathname: '/habit/[id]',
                params: {
                  id: item.id,
                },
              })
            }
          />
        )}
        ListFooterComponent={
          habits.length > 0 ? (
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                {
                  backgroundColor:
                    colors.primary,
                },
                pressed &&
                  styles.addButtonPressed,
              ]}
              onPress={() =>
                router.push('/create')
              }
            >
              <Text
                style={
                  styles.addButtonText
                }
              >
                + Add Habit
              </Text>
            </Pressable>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            onAddHabit={() =>
              router.push('/create')
            }
          />
        }
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },

  name: {
    fontSize: 28,
    fontWeight: '700',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  addButton: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },

  addButtonPressed: {
    opacity: 0.7,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});