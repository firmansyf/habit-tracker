import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
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

  const handleContinue = () => {
    const username = name.trim();

    if (!username) {
      return;
    }

    setUsername?.(username);

    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>👋</Text>

        <Text style={styles.title}>
          Welcome to Habit Tracker
        </Text>

        <Text style={styles.description}>
          Let's start building better habits.
          {'\n'}
          First, what should we call you?
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            !name.trim() && styles.buttonDisabled,
            pressed && name.trim() && styles.buttonPressed,
          ]}
          onPress={handleContinue}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>
            Get Started
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  emoji: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
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
    marginBottom: 32,
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

  button: {
    height: 56,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
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
});