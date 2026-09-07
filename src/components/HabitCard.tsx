import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { Habit } from '@/store/habit-store';

type HabitCardProps = {
  habit: Habit;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function HabitCard({
  habit,
  onToggle,
  onEdit,
  onDelete,
}: HabitCardProps) {
  return (
    <View style={styles.habitCard}>
      <Pressable
        style={({ pressed }) => [
          styles.habitMain,
          pressed && styles.habitCardPressed,
        ]}
        onPress={onToggle}
      >
        {/* Checkbox */}
        <View
          style={[
            styles.checkbox,
            habit.completed &&
              styles.checkboxCompleted,
          ]}
        >
          {habit.completed && (
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
              habit.completed &&
                styles.habitCompleted,
            ]}
          >
            {habit.name}
          </Text>

          <Text style={styles.habitDescription}>
            {habit.description}
          </Text>
        </View>
      </Pressable>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed &&
              styles.actionButtonPressed,
          ]}
          onPress={onEdit}
        >
          <Text style={styles.actionButtonText}>
            ✏️
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed &&
              styles.actionButtonPressed,
          ]}
          onPress={onDelete}
        >
          <Text style={styles.actionButtonText}>
            🗑️
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

  habitMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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