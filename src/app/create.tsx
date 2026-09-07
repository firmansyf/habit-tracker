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

  const habit = useHabitStore((state) =>
    state.habits.find(
      (habit) => habit.id === id
    )
  );

  const [name, setName] = useState('');
  const [description, setDescription] =
    useState('');

  const [frequency, setFrequency] =
    useState<HabitFrequency>('daily');

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description);

      setFrequency(
        habit.frequency ?? 'daily'
      );
    }
  }, [habit]);

  const handleSaveHabit = () => {
    if (!name.trim()) {
      return;
    }

    if (isEditMode && id) {
      updateHabit(
        id,
        name.trim(),
        description.trim() ||
          'No description',
        frequency
      );
    } else {
      addHabit(
        name.trim(),
        description.trim() ||
          'No description',
        frequency
      );
    }

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