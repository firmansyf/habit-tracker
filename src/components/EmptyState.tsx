import { Pressable, StyleSheet, Text, View } from 'react-native';

type EmptyStateProps = {
  onAddHabit: () => void;
};

export default function EmptyState({
  onAddHabit,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📝</Text>

      <Text style={styles.title}>
        No habits yet
      </Text>

      <Text style={styles.description}>
        Start building better habits by creating
        your first one.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={onAddHabit}
      >
        <Text style={styles.buttonText}>
          + Create Your First Habit
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
  },

  button: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: 20,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});