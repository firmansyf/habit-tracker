import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { Habit } from '@/store/habit-store';

import {
  getToday,
  isScheduledDate,
} from '@/utils/date';

type HabitCardProps = {
  habit: Habit;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDetail: () => void;
};

export default function HabitCard({
  habit,
  onToggle,
  onEdit,
  onDelete,
  onDetail,
}: HabitCardProps) {
  const today = getToday();

  const isScheduledToday =
    isScheduledDate(
      today,
      habit.frequency ?? 'daily'
    );

  return (
    <View
      style={[
        styles.habitCard,
        !isScheduledToday &&
          styles.habitCardDisabled,
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.habitMain,
          pressed &&
            isScheduledToday &&
            styles.habitCardPressed,
        ]}
        onPress={onToggle}
        disabled={!isScheduledToday}
      >
        {/* Checkbox */}
        <View
          style={[
            styles.checkbox,

            habit.completed &&
              isScheduledToday &&
              styles.checkboxCompleted,

            !isScheduledToday &&
              styles.checkboxDisabled,
          ]}
        >
          {habit.completed &&
            isScheduledToday && (
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
                isScheduledToday &&
                styles.habitCompleted,

              !isScheduledToday &&
                styles.habitNameDisabled,
            ]}
          >
            {habit.name}
          </Text>

          <Text
            style={[
              styles.habitDescription,
              !isScheduledToday &&
                styles.habitDescriptionDisabled,
            ]}
          >
            {habit.description}
          </Text>

          {/* Not Scheduled Label */}
          {!isScheduledToday && (
            <Text
              style={
                styles.notScheduledText
              }
            >
              Not scheduled today
            </Text>
          )}
        </View>
      </Pressable>

      {/* Actions */}
      <View style={styles.actions}>
        {/* Edit */}
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed &&
              styles.actionButtonPressed,
          ]}
          onPress={onEdit}
        >
          <Text
            style={styles.actionButtonText}
          >
            ✏️
          </Text>
        </Pressable>

        {/* Delete */}
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed &&
              styles.actionButtonPressed,
          ]}
          onPress={onDelete}
        >
          <Text
            style={styles.actionButtonText}
          >
            🗑️
          </Text>
        </Pressable>

        {/* Detail */}
        <Pressable
          style={({ pressed }) => [
            styles.detailButton,
            pressed &&
              styles.actionButtonPressed,
          ]}
          onPress={onDetail}
        >
          <Text
            style={styles.detailButtonText}
          >
            👁️
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

  /*
   * Card ketika habit tidak dijadwalkan
   * hari ini.
   */
  habitCardDisabled: {
    backgroundColor: '#F1F5F9',
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

  /*
   * Checkbox untuk habit yang belum
   * dijadwalkan hari ini.
   */
  checkboxDisabled: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
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

  /*
   * Nama habit yang tidak dijadwalkan.
   */
  habitNameDisabled: {
    color: '#94A3B8',
  },

  habitDescription: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },

  habitDescriptionDisabled: {
    color: '#94A3B8',
  },

  /*
   * Label kecil untuk menunjukkan
   * bahwa habit tidak tersedia hari ini.
   */
  notScheduledText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 6,
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

  detailButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  detailButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
});