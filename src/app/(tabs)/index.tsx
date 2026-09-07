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

import { useHabitStore } from '@/store/habit-store';
import { getCurrentStreak } from '@/utils/date';

import {
  getGreeting,
  getInitial,
} from '@/utils/greeting';

import { useEffect } from 'react';
 
import EmptyState from '@/components/EmptyState';
import HabitCard from '@/components/HabitCard';
import ProgressCard from '@/components/ProgressCard';
import StreakCard from '@/components/StreakCard';

export default function HomeScreen() {
  const router = useRouter();
  const greeting = getGreeting();
  
  const habits = useHabitStore((state) => state.habits);
  const toggleHabit = useHabitStore((state) => state.toggleHabit);
  
  const username = useHabitStore((state) => state.username);
  const initial = getInitial(username ?? "");
  
  const deleteHabit = useHabitStore((state) => state.deleteHabit);

  const completedHabits = habits.filter(
    (habit) => habit.completed
  ).length;

  const totalHabits = habits.length;

  const allCompletedDates = habits.flatMap(
    (habit) => habit.completedDates ?? []
  );

  const currentStreak = getCurrentStreak(
    [...new Set(allCompletedDates)]
  );

  const handleDeleteHabit = (
    id: string,
    name: string
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
          onPress: () => deleteHabit(id),
        },
      ]
    );
  };


  useEffect(() => {
    if (!username) {
      router.replace('/welcome');
    }
  }, [username]);


  if (!username) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>
                  {greeting} 👋
                </Text>

                <Text style={styles.name}>
                  {username}
                </Text>
              </View>

              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {initial}
                </Text>
              </View>
            </View>

            {/* Streak Card */}
           <StreakCard currentStreak={currentStreak} />

            {/* Today's Habits */}
            <ProgressCard
              completedHabits={completedHabits}
              totalHabits={totalHabits}
            />
          </View>
        }
        renderItem={({ item }) => (
         <HabitCard
            habit={item}
            onToggle={() => toggleHabit(item.id)}
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
                item.name
              )
            }
          />
        )}
        ListFooterComponent={
          habits.length > 0 ? (
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
              ]}
              onPress={() => router.push('/create')}
            >
              <Text style={styles.addButtonText}>
                + Add Habit
              </Text>
            </Pressable>
          ) : null
        }
         ListEmptyComponent={
          <EmptyState
            onAddHabit={() => router.push('/create')}
          />
        }

      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  greeting: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },

  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  addButton: {
    backgroundColor: '#0F172A',
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

  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  deleteButtonPressed: {
    opacity: 0.5,
  },

  deleteButtonText: {
    fontSize: 18,
  },

});