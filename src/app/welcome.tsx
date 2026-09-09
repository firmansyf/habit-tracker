import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useHabitStore } from '@/store/habit-store';

export default function WelcomeScreen() {
  const router = useRouter();

  const setUsername = useHabitStore(
    (state) => state.setUsername
  );

  const [name, setName] = useState('');

  const trimmedName = name.trim();
  const isValid = trimmedName.length > 0;

  const handleContinue = () => {
    if (!isValid) {
      return;
    }

    setUsername(trimmedName);

    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.hero}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>👋</Text>
            </View>

            <Text style={styles.title}>
              Welcome to Habit Tracker
            </Text>

            <Text style={styles.description}>
              Let's start building better habits.
              {'\n'}
              First, what should we call you?
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Your Name</Text>

            <TextInput
              style={[
                styles.input,
                name.length > 0 && styles.inputFocused,
              ]}
              placeholder="Enter your name"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />

            <Text style={styles.helper}>
              This name will be used to personalize your experience.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                !isValid && styles.buttonDisabled,
                pressed && isValid && styles.buttonPressed,
              ]}
              onPress={handleContinue}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>
                Get Started
              </Text>

              <Text style={styles.buttonArrow}>→</Text>
            </Pressable>
          </View>

          <Text style={styles.footer}>
            Build better habits, one day at a time.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  keyboard: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  hero: {
    alignItems: 'center',
  },

  emojiContainer: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  emoji: {
    fontSize: 48,
  },

  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
  },

  form: {
    marginTop: 40,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },

  input: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  inputFocused: {
    borderColor: '#CBD5E1',
  },

  helper: {
    fontSize: 13,
    lineHeight: 20,
    color: '#94A3B8',
    marginTop: 8,
  },

  button: {
    height: 56,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    flexDirection: 'row',
  },

  buttonDisabled: {
    opacity: 0.4,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 10,
  },

  footer: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 40,
  },
});