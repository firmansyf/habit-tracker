import {
    Stack,
    useLocalSearchParams,
    useRouter,
} from 'expo-router';
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
import { getCurrentStreak } from '@/utils/date';

export default function HabitDetailScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const habit = useHabitStore((state) =>
    state.habits.find((item) => item.id === id)
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
              <Text style={styles.backButtonText}>
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
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
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
              {habit.description || 'No description'}
            </Text>
          </View>

          {/* Statistics */}
          <View style={styles.statsContainer}>
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

          {/* Completion History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Completion History
            </Text>

            {habit.completedDates.length === 0 ? (
              <Text style={styles.emptyHistory}>
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
                    <Text style={styles.historyIcon}>
                      ✓
                    </Text>

                    <Text style={styles.historyDate}>
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
                pressed && styles.buttonPressed,
              ]}
              onPress={handleEdit}
            >
              <Text style={styles.editButtonText}>
                Edit Habit
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>
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

  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
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