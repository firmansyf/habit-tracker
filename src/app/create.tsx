import { useRouter } from 'expo-router';
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

import { useLocalSearchParams } from 'expo-router';

import { useHabitStore } from '@/store/habit-store';

export default function CreateHabitScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{id?: string}>();

  const addHabit = useHabitStore((state) => state.addHabit);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const isEditMode = Boolean(id);

  const habit = useHabitStore((state) =>
    state.habits.find((habit) => habit.id === id)
  );

  const updateHabit = useHabitStore((state) => state.updateHabit );

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description);
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
      description.trim() || 'No description'
    );
  } else {
    addHabit(
      name.trim(),
      description.trim() || 'No description'
    );
  }

  router.back();
};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>‹</Text>
            </Pressable>

            <Text style={styles.title}>
              {isEditMode ? 'Edit Habit' : 'Add Habit'}
            </Text>

            <View style={styles.headerSpacer} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Habit Name</Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Drink Water"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>

              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="e.g. 8 glasses"
                placeholderTextColor="#94A3B8"
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              !name.trim() && styles.saveButtonDisabled,
              pressed &&
                name.trim() &&
                styles.saveButtonPressed,
            ]}
            onPress={handleSaveHabit}
            disabled={!name.trim()}
          >
            <Text style={styles.saveButtonText}>
              {isEditMode ? 'Update Habit' : 'Save Habit'}
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

  saveButton: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 17,
    alignItems: 'center',
    marginTop: 'auto',
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