import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/useAppTheme';

import {
  HabitFrequency,
  useHabitStore,
} from '@/store/habit-store';

import {
  cancelHabitReminder,
  requestNotificationPermission,
  scheduleHabitReminder,
} from '@/utils/notification';

const FREQUENCY_OPTIONS: {
  value: HabitFrequency;
  label: string;
  description: string;
}[] = [
  {
    value: 'daily',
    label: 'Every Day',
    description: 'Complete this habit every day',
  },
  {
    value: 'weekdays',
    label: 'Weekdays',
    description: 'Monday to Friday',
  },
  {
    value: 'weekends',
    label: 'Weekends',
    description: 'Saturday and Sunday',
  },
];

const formatTime = (
  hour: number,
  minute: number
) => {
  return `${String(hour).padStart(2, '0')}:${String(
    minute
  ).padStart(2, '0')}`;
};

export default function CreateHabitScreen() {
  const router = useRouter();

  const { colors, colorScheme } = useAppTheme();

  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const addHabit = useHabitStore(
    (state) => state.addHabit
  );

  const updateHabit = useHabitStore(
    (state) => state.updateHabit
  );

  const updateReminder = useHabitStore(
    (state) => state.updateReminder
  );

  const habit = useHabitStore((state) =>
    state.habits.find(
      (habit) => habit.id === id
    )
  );

  const notificationIds =
    habit?.notificationIds ?? [];

  const [name, setName] = useState('');
  const [description, setDescription] =
    useState('');

  const [frequency, setFrequency] =
    useState<HabitFrequency>('daily');

  const [reminderEnabled, setReminderEnabled] =
    useState(false);

  const [reminderHour, setReminderHour] =
    useState(8);

  const [reminderMinute, setReminderMinute] =
    useState(0);

  const [showTimePicker, setShowTimePicker] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const isEditMode = Boolean(id);

  const trimmedName = name.trim();
  const isValid = trimmedName.length > 0;

  useEffect(() => {
    if (!habit) {
      return;
    }

    setName(habit.name);
    setDescription(habit.description);

    setFrequency(
      habit.frequency ?? 'daily'
    );

    setReminderEnabled(
      habit.reminderEnabled ?? false
    );

    setReminderHour(
      habit.reminderHour ?? 8
    );

    setReminderMinute(
      habit.reminderMinute ?? 0
    );
  }, [habit]);

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (
      event.type === 'dismissed' ||
      !selectedDate
    ) {
      return;
    }

    setReminderHour(
      selectedDate.getHours()
    );

    setReminderMinute(
      selectedDate.getMinutes()
    );
  };

  const handleSaveHabit = async () => {
    if (!isValid || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      /*
       * EDIT HABIT
       */

      if (isEditMode && id) {
        /*
         * Cancel notification lama terlebih dahulu.
         */

        if (notificationIds.length > 0) {
          await cancelHabitReminder(
            notificationIds
          );
        }

        /*
         * Update informasi habit.
         */

        updateHabit(
          id,
          trimmedName,
          description.trim() ||
            'No description',
          frequency
        );

        /*
         * Jika reminder OFF,
         * kosongkan notification IDs.
         */

        if (!reminderEnabled) {
          updateReminder(
            id,
            false,
            reminderHour,
            reminderMinute,
            []
          );

          router.back();
          return;
        }

        /*
         * Request notification permission.
         */

        const permissionGranted =
          await requestNotificationPermission();

        /*
         * Jika permission ditolak,
         * reminder dibuat OFF.
         */

        if (!permissionGranted) {
          updateReminder(
            id,
            false,
            reminderHour,
            reminderMinute,
            []
          );

          router.back();
          return;
        }

        /*
         * Schedule notification baru.
         */

        const newNotificationIds =
          await scheduleHabitReminder(
            trimmedName,
            frequency,
            reminderHour,
            reminderMinute
          );

        /*
         * Simpan notification IDs.
         */

        updateReminder(
          id,
          true,
          reminderHour,
          reminderMinute,
          newNotificationIds
        );

        router.back();
        return;
      }

      /*
       * CREATE HABIT
       */

      const newHabitId = addHabit(
        trimmedName,
        description.trim() ||
          'No description',
        frequency,
        reminderEnabled,
        reminderHour,
        reminderMinute
      );

      /*
       * Jika reminder OFF,
       * tidak perlu membuat notification.
       */

      if (!reminderEnabled) {
        router.back();
        return;
      }

      /*
       * Request notification permission.
       */

      const permissionGranted =
        await requestNotificationPermission();

      /*
       * Jika permission ditolak,
       * reminder tetap OFF.
       */

      if (!permissionGranted) {
        updateReminder(
          newHabitId,
          false,
          reminderHour,
          reminderMinute,
          []
        );

        router.back();
        return;
      }

      /*
       * Schedule notification.
       */

      const newNotificationIds =
        await scheduleHabitReminder(
          trimmedName,
          frequency,
          reminderHour,
          reminderMinute
        );

      /*
       * Simpan notification IDs.
       */

      updateReminder(
        newHabitId,
        true,
        reminderHour,
        reminderMinute,
        newNotificationIds
      );

      router.back();
    } catch (error) {
      console.error(
        'Failed to save habit:',
        error
      );
    } finally {
      setIsSaving(false);
    }
  };

  const inputBackground = colors.input;

  const selectedFrequencyBackground =
    colorScheme === 'dark'
      ? colors.primarySoft
      : '#EFF6FF';

  const reminderActiveBackground =
    colorScheme === 'dark'
      ? colors.primarySoft
      : '#F8FBFF';

  const pressedBackground =
    colorScheme === 'dark'
      ? colors.border
      : colors.input;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}

          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
                pressed && {
                  backgroundColor:
                    pressedBackground,
                },
              ]}
            >
              <Text
                style={[
                  styles.backButtonText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                ‹
              </Text>
            </Pressable>

            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              {isEditMode
                ? 'Edit Habit'
                : 'Add Habit'}
            </Text>

            <View
              style={styles.headerSpacer}
            />
          </View>

          {/* Form */}

          <View style={styles.form}>
            {/* Habit Name */}

            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Habit Name
              </Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Drink Water"
                placeholderTextColor={
                  colors.textMuted
                }
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      inputBackground,
                    borderColor:
                      colors.border,
                    color: colors.text,
                  },
                  name.length > 0 && {
                    borderColor:
                      colors.primary,
                  },
                ]}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            {/* Description */}

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Description
                </Text>

                <Text
                  style={[
                    styles.optionalText,
                    {
                      color: colors.textMuted,
                    },
                  ]}
                >
                  Optional
                </Text>
              </View>

              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="e.g. 8 glasses"
                placeholderTextColor={
                  colors.textMuted
                }
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor:
                      inputBackground,
                    borderColor:
                      colors.border,
                    color: colors.text,
                  },
                  description.length > 0 && {
                    borderColor:
                      colors.primary,
                  },
                ]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Frequency */}

            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Frequency
              </Text>

              <Text
                style={[
                  styles.sectionHint,
                  {
                    color: colors.textMuted,
                  },
                ]}
              >
                Choose when this habit should
                be completed.
              </Text>

              <View
                style={styles.frequencyList}
              >
                {FREQUENCY_OPTIONS.map(
                  (option) => {
                    const isSelected =
                      frequency ===
                      option.value;

                    return (
                      <Pressable
                        key={option.value}
                        accessibilityRole="radio"
                        accessibilityState={{
                          selected:
                            isSelected,
                        }}
                        onPress={() =>
                          setFrequency(
                            option.value
                          )
                        }
                        style={({ pressed }) => [
                          styles.frequencyOption,
                          {
                            backgroundColor:
                              colors.card,
                            borderColor:
                              colors.border,
                          },
                          isSelected && {
                            borderColor:
                              colors.primary,
                            backgroundColor:
                              selectedFrequencyBackground,
                          },
                          pressed &&
                            styles.frequencyOptionPressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.radio,
                            {
                              borderColor:
                                colors.border,
                            },
                            isSelected && {
                              borderColor:
                                colors.primary,
                            },
                          ]}
                        >
                          {isSelected && (
                            <View
                              style={[
                                styles.radioInner,
                                {
                                  backgroundColor:
                                    colors.primary,
                                },
                              ]}
                            />
                          )}
                        </View>

                        <View
                          style={
                            styles.frequencyContent
                          }
                        >
                          <Text
                            style={[
                              styles.frequencyLabel,
                              {
                                color:
                                  colors.text,
                              },
                              isSelected && {
                                color:
                                  colors.primary,
                              },
                            ]}
                          >
                            {option.label}
                          </Text>

                          <Text
                            style={[
                              styles.frequencyDescription,
                              {
                                color:
                                  colors.textSecondary,
                              },
                            ]}
                          >
                            {option.description}
                          </Text>
                        </View>

                        {isSelected && (
                          <Text
                            style={[
                              styles.selectedCheck,
                              {
                                color:
                                  colors.primary,
                              },
                            ]}
                          >
                            ✓
                          </Text>
                        )}
                      </Pressable>
                    );
                  }
                )}
              </View>
            </View>

            {/* Reminder */}

            <View style={styles.inputGroup}>
              <View
                style={[
                  styles.reminderHeader,
                  {
                    backgroundColor:
                      colors.card,
                    borderColor:
                      colors.border,
                  },
                  reminderEnabled && {
                    borderColor:
                      colors.primary,
                    backgroundColor:
                      reminderActiveBackground,
                  },
                ]}
              >
                <View
                  style={
                    styles.reminderHeaderContent
                  }
                >
                  <View
                    style={
                      styles.reminderTitleRow
                    }
                  >
                    <Text
                      style={styles.reminderIcon}
                    >
                      🔔
                    </Text>

                    <Text
                      style={[
                        styles.label,
                        {
                          color: colors.text,
                        },
                      ]}
                    >
                      Reminder
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.reminderDescription,
                      {
                        color:
                          colors.textSecondary,
                      },
                    ]}
                  >
                    Get notified when it's time
                    to complete this habit.
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="switch"
                  accessibilityState={{
                    checked:
                      reminderEnabled,
                  }}
                  accessibilityLabel="Habit reminder"
                  onPress={() =>
                    setReminderEnabled(
                      !reminderEnabled
                    )
                  }
                  style={[
                    styles.switch,
                    {
                      backgroundColor:
                        colors.border,
                    },
                    reminderEnabled && {
                      backgroundColor:
                        colors.primary,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      {
                        backgroundColor:
                          '#FFFFFF',
                      },
                      reminderEnabled &&
                        styles.switchThumbActive,
                    ]}
                  />
                </Pressable>
              </View>

              {reminderEnabled && (
                <View
                  style={[
                    styles.reminderOptions,
                    {
                      backgroundColor:
                        colors.card,
                      borderColor:
                        colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.reminderTimeLabel,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    Reminder Time
                  </Text>

                  <Text
                    style={[
                      styles.sectionHint,
                      {
                        color:
                          colors.textMuted,
                      },
                    ]}
                  >
                    Choose a time that works best
                    for you.
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Choose reminder time"
                    onPress={() =>
                      setShowTimePicker(true)
                    }
                    style={({ pressed }) => [
                      styles.timePickerButton,
                      {
                        borderColor:
                          colors.border,
                        backgroundColor:
                          colors.input,
                      },
                      pressed && {
                        opacity: 0.7,
                      },
                    ]}
                  >
                    <View>
                      <Text
                        style={[
                          styles.timePickerLabel,
                          {
                            color:
                              colors.textSecondary,
                          },
                        ]}
                      >
                        Reminder time
                      </Text>

                      <Text
                        style={[
                          styles.timePickerValue,
                          {
                            color:
                              colors.primary,
                          },
                        ]}
                      >
                        {formatTime(
                          reminderHour,
                          reminderMinute
                        )}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.timePickerChevron,
                        {
                          color:
                            colors.textMuted,
                        },
                      ]}
                    >
                      ›
                    </Text>
                  </Pressable>

                  {showTimePicker && (
                    <DateTimePicker
                      value={(() => {
                        const date =
                          new Date();

                        date.setHours(
                          reminderHour,
                          reminderMinute,
                          0,
                          0
                        );

                        return date;
                      })()}
                      mode="time"
                      is24Hour
                      display="default"
                      onChange={
                        handleTimeChange
                      }
                    />
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Save Button */}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{
              disabled:
                !isValid || isSaving,
              busy: isSaving,
            }}
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor:
                  colors.primary,
              },
              !isValid && {
                backgroundColor:
                  colors.border,
              },
              isSaving &&
                styles.saveButtonSaving,
              pressed &&
                isValid &&
                !isSaving &&
                styles.saveButtonPressed,
            ]}
            onPress={handleSaveHabit}
            disabled={!isValid || isSaving}
          >
            {isSaving ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

                <Text
                  style={styles.saveButtonText}
                >
                  Saving...
                </Text>
              </>
            ) : (
              <Text
                style={styles.saveButtonText}
              >
                {isEditMode
                  ? 'Update Habit'
                  : 'Save Habit'}
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    fontSize: 32,
    lineHeight: 36,
    marginTop: -4,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
  },

  headerSpacer: {
    width: 44,
  },

  form: {
    gap: 24,
  },

  inputGroup: {
    gap: 8,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  label: {
    fontSize: 16,
    fontWeight: '700',
  },

  optionalText: {
    fontSize: 12,
    fontWeight: '500',
  },

  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },

  textArea: {
    minHeight: 120,
  },

  sectionHint: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: -2,
  },

  frequencyList: {
    gap: 10,
    marginTop: 2,
  },

  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },

  frequencyOptionPressed: {
    opacity: 0.75,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  frequencyContent: {
    flex: 1,
  },

  frequencyLabel: {
    fontSize: 15,
    fontWeight: '700',
  },

  frequencyDescription: {
    fontSize: 13,
    marginTop: 4,
  },

  selectedCheck: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },

  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },

  reminderHeaderContent: {
    flex: 1,
    paddingRight: 16,
  },

  reminderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  reminderIcon: {
    fontSize: 17,
    marginRight: 7,
  },

  reminderDescription: {
    fontSize: 13,
    marginTop: 5,
    lineHeight: 18,
  },

  switch: {
    width: 52,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },

  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },

  switchThumbActive: {
    alignSelf: 'flex-end',
  },

  reminderOptions: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },

  reminderTimeLabel: {
    fontSize: 14,
    fontWeight: '700',
  },

  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },

  timePickerLabel: {
    fontSize: 12,
    marginBottom: 4,
  },

  timePickerValue: {
    fontSize: 22,
    fontWeight: '800',
  },

  timePickerChevron: {
    fontSize: 26,
  },

  saveButton: {
    minHeight: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 32,
    marginBottom: 20,
  },

  saveButtonSaving: {
    opacity: 0.8,
  },

  saveButtonPressed: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});