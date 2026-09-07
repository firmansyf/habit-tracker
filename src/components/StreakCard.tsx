import { StyleSheet, Text, View } from 'react-native';

type StreakCardProps = {
  currentStreak: number;
};

export default function StreakCard({
  currentStreak,
}: StreakCardProps) {
  return (
    <View style={styles.streakCard}>
      <Text style={styles.streakEmoji}>
        🔥
      </Text>

      <View>
        <Text style={styles.streakNumber}>
          {currentStreak}{' '}
          {currentStreak === 1 ? 'Day' : 'Days'}
        </Text>

        <Text style={styles.streakLabel}>
          Current Streak
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
  },

  streakEmoji: {
    fontSize: 36,
    marginRight: 16,
  },

  streakNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#9A3412',
  },

  streakLabel: {
    fontSize: 14,
    color: '#C2410C',
    marginTop: 2,
  },
});