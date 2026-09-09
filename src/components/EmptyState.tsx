import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type EmptyStateProps = {
  onAddHabit: () => void;
};

export default function EmptyState({
  onAddHabit,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📝</Text>
      </View>

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
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 20,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  icon: {
    fontSize: 40,
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
    maxWidth: 290,
    marginTop: 8,
  },

  button: {
    minHeight: 52,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});