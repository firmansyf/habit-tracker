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

export default function HomeScreen() {
  const router = useRouter();

  const habits = useHabitStore((state) => state.habits);
  const toggleHabit = useHabitStore((state) => state.toggleHabit);

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
                  Good Morning 👋
                </Text>

                <Text style={styles.name}>
                  Yusuf
                </Text>
              </View>

              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  Y
                </Text>
              </View>
            </View>

            {/* Streak Card */}
            <View style={styles.streakCard}>
              <Text style={styles.streakEmoji}>
                🔥
              </Text>

              <View>
                <Text style={styles.streakNumber}>
                  {currentStreak} { currentStreak === 1 ? 'Day' : 'Days' }
                </Text>

                <Text style={styles.streakLabel}>
                  Current Streak
                </Text>
              </View>
            </View>

            {/* Today's Habits */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Today's Habits
              </Text>

              <Text style={styles.progress}>
                {completedHabits} / {totalHabits}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
         <View style={styles.habitCard}>
          <Pressable
            style={({ pressed }) => [
              styles.habitMain,
              pressed && styles.habitCardPressed,
            ]}
            onPress={() => toggleHabit(item.id)}
          >
            {/* Checkbox */}
            <View
              style={[
                styles.checkbox,
                item.completed && styles.checkboxCompleted,
              ]}
            >
              {item.completed && (
                <Text style={styles.checkmark}>
                  ✓
                </Text>
              )}
            </View>

            {/* Habit Information */}
            <View style={styles.habitInfo}>
              <Text
                style={[
                  styles.habitName,
                  item.completed && styles.habitCompleted,
                ]}
              >
                {item.name}
              </Text>

              <Text style={styles.habitDescription}>
                {item.description}
              </Text>
            </View>
          </Pressable>

          <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed,
                ]}
                onPress={() =>
                  router.push({
                    pathname: '/create',
                    params: {
                      id: item.id,
                    },
                  })
                }
              >
                <Text style={styles.actionButtonText}>✏️</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed,
                ]}
                onPress={() =>
                  handleDeleteHabit(item.id, item.name)
                }
              >
                <Text style={styles.actionButtonText}>🗑️</Text>
              </Pressable>
            </View>
          
          </View>
        )}
        ListFooterComponent={
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

  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
  },

  streakEmoji: {
    fontSize: 36,
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

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },

  progress: {
    fontSize: 14,
    color: '#64748B',
  },

  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  habitCardPressed: {
    opacity: 0.7,
  },

  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  checkboxCompleted: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },

  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  habitInfo: {
    flex: 1,
  },

  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },

  habitCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },

  habitDescription: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
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

  habitMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },

  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionButtonPressed: {
    opacity: 0.5,
  },

  actionButtonText: {
    fontSize: 18,
  },
});