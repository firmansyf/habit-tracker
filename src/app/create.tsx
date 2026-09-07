import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useEffect, useState } from 'react';
import {
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

const REMINDER_OPTIONS = [
  {
    hour: 8,
    minute: 0,
    label: '08:00',
  },
  {
    hour: 9,
    minute: 0,
    label: '09:00',
  },
  {
    hour: 12,
    minute: 0,
    label: '12:00',
  },
  {
    hour: 18,
    minute: 0,
    label: '18:00',
  },
  {
    hour: 20,
    minute: 0,
    label: '20:00',
  },
];

export default function CreateHabitScreen() {
  const router = useRouter();

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

  const notificationIds = habit?.notificationIds ?? [];

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

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (habit) {
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
    }
  }, [habit]);

 const handleSaveHabit = async () => {
  if (!name.trim()) {
    return;
  }

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
      name.trim(),
      description.trim() ||
        'No description',
      frequency
    );

    /*
     * Jika reminder OFF,
     * cukup kosongkan notification IDs.
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
     * Request permission.
     */
    const permissionGranted =
      await requestNotificationPermission();

    /*
     * Jika permission ditolak,
     * jangan membuat notification.
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
        name.trim(),
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
    name.trim(),
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
   * reminder tetap disimpan sebagai OFF.
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
      name.trim(),
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
};

  return (
    <SafeAreaView style={styles.container}>
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
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text
                style={styles.backButtonText}
              >
                ‹
              </Text>
            </Pressable>

            <Text style={styles.title}>
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
              <Text style={styles.label}>
                Habit Name
              </Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Drink Water"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                autoCapitalize="words"
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Description
              </Text>

              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="e.g. 8 glasses"
                placeholderTextColor="#94A3B8"
                style={[
                  styles.input,
                  styles.textArea,
                ]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Frequency */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Frequency
              </Text>

              <View style={styles.frequencyList}>
                {FREQUENCY_OPTIONS.map(
                  (option) => {
                    const isSelected =
                      frequency ===
                      option.value;

                    return (
                      <Pressable
                        key={option.value}
                        onPress={() =>
                          setFrequency(
                            option.value
                          )
                        }
                        style={({ pressed }) => [
                          styles.frequencyOption,
                          isSelected &&
                            styles.frequencyOptionSelected,
                          pressed &&
                            styles.frequencyOptionPressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.radio,
                            isSelected &&
                              styles.radioSelected,
                          ]}
                        >
                          {isSelected && (
                            <View
                              style={
                                styles.radioInner
                              }
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
                              isSelected &&
                                styles.frequencyLabelSelected,
                            ]}
                          >
                            {option.label}
                          </Text>

                          <Text
                            style={
                              styles.frequencyDescription
                            }
                          >
                            {
                              option.description
                            }
                          </Text>
                        </View>
                      </Pressable>
                    );
                  }
                )}
              </View>
            </View>

            {/* Reminder */}
            <View style={styles.inputGroup}>
              <View style={styles.reminderHeader}>
                <View
                  style={
                    styles.reminderHeaderContent
                  }
                >
                  <Text style={styles.label}>
                    Reminder
                  </Text>

                  <Text
                    style={
                      styles.reminderDescription
                    }
                  >
                    Get notified when it's time
                    to complete this habit
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    setReminderEnabled(
                      !reminderEnabled
                    )
                  }
                  style={[
                    styles.switch,
                    reminderEnabled &&
                      styles.switchActive,
                  ]}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      reminderEnabled &&
                        styles.switchThumbActive,
                    ]}
                  />
                </Pressable>
              </View>

              {reminderEnabled && (
                <View style={styles.reminderOptions}>
                  <Text
                    style={styles.reminderTimeLabel}
                  >
                    Reminder Time
                  </Text>

                  <View
                    style={
                      styles.reminderTimeList
                    }
                  >
                    {REMINDER_OPTIONS.map(
                      (option) => {
                        const isSelected =
                          reminderHour ===
                            option.hour &&
                          reminderMinute ===
                            option.minute;

                        return (
                          <Pressable
                            key={option.label}
                            onPress={() => {
                              setReminderHour(
                                option.hour
                              );
                              setReminderMinute(
                                option.minute
                              );
                            }}
                            style={({ pressed }) => [
                              styles.reminderTimeOption,
                              isSelected &&
                                styles.reminderTimeOptionSelected,
                              pressed &&
                                styles.reminderTimeOptionPressed,
                            ]}
                          >
                            <Text
                              style={[
                                styles.reminderTimeText,
                                isSelected &&
                                  styles.reminderTimeTextSelected,
                              ]}
                            >
                              {option.label}
                            </Text>
                          </Pressable>
                        );
                      }
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              !name.trim() &&
                styles.saveButtonDisabled,
              pressed &&
                name.trim() &&
                styles.saveButtonPressed,
            ]}
            onPress={handleSaveHabit}
            disabled={!name.trim()}
          >
            <Text
              style={styles.saveButtonText}
            >
              {isEditMode
                ? 'Update Habit'
                : 'Save Habit'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    marginBottom: 32,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    fontSize: 32,
    color: '#0F172A',
    lineHeight: 36,
    marginTop: -4,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
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

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
  },

  textArea: {
    minHeight: 120,
  },

  frequencyList: {
    gap: 10,
  },

  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
  },

  frequencyOptionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },

  frequencyOptionPressed: {
    opacity: 0.8,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  radioSelected: {
    borderColor: '#2563EB',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },

  frequencyContent: {
    flex: 1,
  },

  frequencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },

  frequencyLabelSelected: {
    color: '#2563EB',
  },

  frequencyDescription: {
    fontSize: 13,
    color: '#64748B',
  },

  /* Reminder */

  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
  },

  reminderHeaderContent: {
    flex: 1,
    paddingRight: 16,
  },

  reminderDescription: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },

  switch: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },

  switchActive: {
    backgroundColor: '#2563EB',
  },

  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  switchThumbActive: {
    alignSelf: 'flex-end',
  },

  reminderOptions: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
    marginTop: 2,
  },

  reminderTimeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },

  reminderTimeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  reminderTimeOption: {
    minWidth: 70,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },

  reminderTimeOptionSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },

  reminderTimeOptionPressed: {
    opacity: 0.7,
  },

  reminderTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },

  reminderTimeTextSelected: {
    color: '#2563EB',
  },

  /* Save */

  saveButton: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 17,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },

  saveButtonDisabled: {
    backgroundColor: '#CBD5E1',
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