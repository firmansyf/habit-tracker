import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useAppTheme,
} from '@/hooks/useAppTheme';

import type {
  Habit,
} from '@/store/habit-store';

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
  const { colors } =
    useAppTheme();

  const today = getToday();

  const isScheduledToday =
    isScheduledDate(
      today,
      habit.frequency ?? 'daily'
    );

  const isCompletedToday =
    habit.completedDates.includes(
      today
    );

  const frequencyLabel =
    getFrequencyLabel(
      habit.frequency ?? 'daily'
    );

  return (
    <View
      style={[
        styles.habitCard,
        {
          backgroundColor:
            colors.card,
          borderColor:
            colors.border,
        },

        !isScheduledToday && {
          backgroundColor:
            colors.input,
        },
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
        disabled={
          !isScheduledToday
        }
      >
        {/* Checkbox */}

        <View
          style={[
            styles.checkbox,
            {
              borderColor:
                colors.textMuted,
            },

            isCompletedToday &&
              isScheduledToday && {
                backgroundColor:
                  colors.success,
                borderColor:
                  colors.success,
              },

            !isScheduledToday && {
              backgroundColor:
                colors.border,
              borderColor:
                colors.textMuted,
            },
          ]}
        >
          {isCompletedToday &&
            isScheduledToday && (
              <Text
                style={
                  styles.checkmark
                }
              >
                ✓
              </Text>
            )}
        </View>

        {/* Information */}

        <View
          style={styles.habitInfo}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.habitName,
              {
                color: colors.text,
              },

              isCompletedToday &&
                isScheduledToday && {
                  color:
                    colors.textMuted,
                  textDecorationLine:
                    'line-through',
                },

              !isScheduledToday && {
                color:
                  colors.textMuted,
              },
            ]}
          >
            {habit.name}
          </Text>

          {!!habit.description && (
            <Text
              numberOfLines={2}
              style={[
                styles.habitDescription,
                {
                  color:
                    colors.textSecondary,
                },

                !isScheduledToday && {
                  color:
                    colors.textMuted,
                },
              ]}
            >
              {habit.description}
            </Text>
          )}

          {/* Metadata */}

          <View
            style={styles.metadata}
          >
            <View
              style={
                styles.metadataItem
              }
            >
              <Text
                style={
                  styles.metadataIcon
                }
              >
                ↻
              </Text>

              <Text
                style={[
                  styles.metadataText,
                  {
                    color:
                      colors.textSecondary,
                  },

                  !isScheduledToday && {
                    color:
                      colors.textMuted,
                  },
                ]}
              >
                {frequencyLabel}
              </Text>
            </View>

            {habit.reminderEnabled && (
              <View
                style={
                  styles.metadataItem
                }
              >
                <Text
                  style={
                    styles.metadataIcon
                  }
                >
                  🔔
                </Text>

                <Text
                  style={[
                    styles.metadataText,
                    {
                      color:
                        colors.textSecondary,
                    },

                    !isScheduledToday && {
                      color:
                        colors.textMuted,
                    },
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

          {!isScheduledToday && (
            <Text
              style={[
                styles.notScheduledText,
                {
                  color:
                    colors.textMuted,
                },
              ]}
            >
              Not scheduled today
            </Text>
          )}
        </View>
      </Pressable>

      {/* Actions */}

      <View
        style={styles.actions}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit ${habit.name}`}
          hitSlop={6}
          style={({ pressed }) => [
            styles.actionButton,

            pressed && {
              backgroundColor:
                colors.input,
            },
          ]}
          onPress={onEdit}
        >
          <Text
            style={styles.actionIcon}
          >
            ✏️
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Delete ${habit.name}`}
          hitSlop={6}
          style={({ pressed }) => [
            styles.actionButton,

            pressed && {
              backgroundColor:
                colors.input,
            },
          ]}
          onPress={onDelete}
        >
          <Text
            style={styles.actionIcon}
          >
            🗑️
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${habit.name}`}
          hitSlop={6}
          style={({ pressed }) => [
            styles.detailButton,
            {
              backgroundColor:
                colors.primarySoft,
            },

            pressed &&
              styles.detailButtonPressed,
          ]}
          onPress={onDetail}
        >
          <Text
            style={[
              styles.detailButtonText,
              {
                color:
                  colors.primary,
              },
            ]}
          >
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
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 1,
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
  },

  habitDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
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
  },

  notScheduledText: {
    fontSize: 11,
    fontWeight: '600',
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

  actionIcon: {
    fontSize: 16,
  },

  detailButton: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 2,
  },

  detailButtonPressed: {
    opacity: 0.6,
  },

  detailButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
});