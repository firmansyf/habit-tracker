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

import { useHabitStore } from '@/store/habit-store';

export default function ProfileScreen() {
  const router = useRouter();

  const username = useHabitStore(
    (state) => state.username
  );

  const setUsername = useHabitStore(
    (state) => state.setUsername
  );

  const [name, setName] = useState(
    username ?? ''
  );

  useEffect(() => {
    setName(username ?? '');
  }, [username]);

  const handleSave = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    setUsername(trimmedName);

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}

          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text
                style={styles.backButtonText}
              >
                ‹
              </Text>
            </Pressable>

            <Text style={styles.title}>
              Edit Profile
            </Text>

            <View style={styles.headerSpacer} />
          </View>

          {/* Avatar */}

          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {name.trim()
                  ? name
                      .trim()
                      .charAt(0)
                      .toUpperCase()
                  : '?'}
              </Text>
            </View>

            <Text style={styles.profileTitle}>
              Your Profile
            </Text>

            <Text
              style={styles.profileDescription}
            >
              Update your display name
            </Text>
          </View>

          {/* Form */}

          <View style={styles.form}>
            <Text style={styles.label}>
              Username
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your username"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />

            <Text style={styles.helper}>
              This name will be displayed on
              your Home screen.
            </Text>
          </View>

          {/* Actions */}

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed &&
                  styles.buttonPressed,
              ]}
              onPress={() => router.back()}
            >
              <Text
                style={styles.cancelButtonText}
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                !name.trim() &&
                  styles.saveButtonDisabled,
                pressed &&
                  name.trim() &&
                  styles.buttonPressed,
              ]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text
                style={styles.saveButtonText}
              >
                Save Changes
              </Text>
            </Pressable>
          </View>
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

  keyboard: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButtonText: {
    fontSize: 32,
    color: '#0F172A',
    lineHeight: 36,
    marginTop: -4,
  },

  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#0F172A',
  },

  headerSpacer: {
    width: 44,
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: 36,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  avatarText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  profileTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },

  profileDescription: {
    marginTop: 5,
    fontSize: 13,
    color: '#64748B',
  },

  form: {
    gap: 8,
  },

  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: '#0F172A',
  },

  helper: {
    fontSize: 12,
    lineHeight: 18,
    color: '#94A3B8',
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
    paddingTop: 40,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },

  saveButton: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  saveButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  buttonPressed: {
    opacity: 0.7,
  },
});