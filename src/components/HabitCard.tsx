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

const getFrequencyLabel = (
  frequency: Habit['frequency']
) => {
  switch (frequency) {
    case 'weekdays':
      return 'Weekdays';

    case 'weekends':
      return 'Weekends';

    default:
      return 'Daily';
  }
};

export default function HabitCard({
  habit,
  onToggle,
  onEdit,
  onDelete,
  onDetail,
}: HabitCardProps) {
  const today = getToday();

  const isScheduledToday = isScheduledDate(
    today,
    habit.frequency ?? 'daily'
  );

  const isCompletedToday =
    habit.completedDates.includes(today);

  const frequencyLabel =
    getFrequencyLabel(
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
      {/* Main Habit */}
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
            isCompletedToday &&
              isScheduledToday &&
              styles.checkboxCompleted,
            !isScheduledToday &&
              styles.checkboxDisabled,
          ]}
        >
          {isCompletedToday &&
            isScheduledToday && (
              <Text style={styles.checkmark}>
                ✓
              </Text>
            )}
        </View>

        {/* Habit Information */}
        <View style={styles.habitInfo}>
          <Text
            numberOfLines={1}
            style={[
              styles.habitName,
              isCompletedToday &&
                isScheduledToday &&
                styles.habitCompleted,
              !isScheduledToday &&
                styles.habitNameDisabled,
            ]}
          >
            {habit.name}
          </Text>

          {!!habit.description && (
            <Text
              numberOfLines={2}
              style={[
                styles.habitDescription,
                !isScheduledToday &&
                  styles.habitDescriptionDisabled,
              ]}
            >
              {habit.description}
            </Text>
          )}

          {/* Habit Metadata */}
          <View style={styles.metadata}>
            <View style={styles.metadataItem}>
              <Text
                style={styles.metadataIcon}
              >
                ↻
              </Text>

              <Text
                style={[
                  styles.metadataText,
                  !isScheduledToday &&
                    styles.metadataTextDisabled,
                ]}
              >
                {frequencyLabel}
              </Text>
            </View>

            {habit.reminderEnabled && (
              <View style={styles.metadataItem}>
                <Text
                  style={styles.metadataIcon}
                >
                  🔔
                </Text>

                <Text
                  style={[
                    styles.metadataText,
                    !isScheduledToday &&
                      styles.metadataTextDisabled,
                  ]}
                >
                  {String(
                    habit.reminderHour
                  ).padStart(2, '0')}
                  :
                  {String(
                    habit.reminderMinute
                  ).padStart(2, '0')}
                </Text>
              </View>
            )}
          </View>

          {/* Not Scheduled */}
          {!isScheduledToday && (
            <Text
              style={styles.notScheduledText}
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
          accessibilityRole="button"
          accessibilityLabel={`Edit ${habit.name}`}
          hitSlop={6}
          style={({ pressed }) => [
            styles.actionButton,
            pressed &&
              styles.actionButtonPressed,
          ]}
          onPress={onEdit}
        >
          <Text style={styles.actionIcon}>
            ✏️
          </Text>
        </Pressable>

        {/* Delete */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Delete ${habit.name}`}
          hitSlop={6}
          style={({ pressed }) => [
            styles.actionButton,
            pressed &&
              styles.actionButtonPressed,
          ]}
          onPress={onDelete}
        >
          <Text style={styles.actionIcon}>
            🗑️
          </Text>
        </Pressable>

        {/* Detail */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${habit.name}`}
          hitSlop={6}
          style={({ pressed }) => [
            styles.detailButton,
            pressed &&
              styles.detailButtonPressed,
          ]}
          onPress={onDetail}
        >
          <Text style={styles.detailButtonText}>
            View
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
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  habitCardDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },

  habitCardPressed: {
    opacity: 0.7,
  },

  habitMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 1,
  },

  checkboxCompleted: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },

  checkboxDisabled: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
  },

  checkmark: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  habitInfo: {
    flex: 1,
    minWidth: 0,
  },

  habitName: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
    color: '#0F172A',
  },

  habitCompleted: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },

  habitNameDisabled: {
    color: '#94A3B8',
  },

  habitDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
    marginTop: 4,
  },

  habitDescriptionDisabled: {
    color: '#94A3B8',
  },

  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 9,
  },

  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metadataIcon: {
    fontSize: 12,
    marginRight: 4,
  },

  metadataText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },

  metadataTextDisabled: {
    color: '#94A3B8',
  },

  notScheduledText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 7,
  },

  actions: {
    alignItems: 'center',
    marginLeft: 8,
    gap: 2,
  },

  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionButtonPressed: {
    backgroundColor: '#F1F5F9',
  },

  actionIcon: {
    fontSize: 16,
  },

  detailButton: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    marginTop: 2,
  },

  detailButtonPressed: {
    opacity: 0.6,
  },

  detailButtonText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
});