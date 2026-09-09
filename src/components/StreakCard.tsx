import { StyleSheet, Text, View } from 'react-native';

type StreakCardProps = {
  currentStreak: number;
};

export default function StreakCard({
  currentStreak,
}: StreakCardProps) {
  const streakLabel =
    currentStreak === 1
      ? 'day streak'
      : 'day streaks';

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔥</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.eyebrow}>
          CURRENT STREAK
        </Text>

        <View style={styles.valueRow}>
          <Text style={styles.number}>
            {currentStreak}
          </Text>

          <Text style={styles.unit}>
            {streakLabel}
          </Text>
        </View>

        <Text style={styles.description}>
          {currentStreak === 0
            ? 'Start today and build your streak.'
            : currentStreak === 1
              ? 'Great start! Keep going.'
              : 'Keep the momentum going!'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 18,
    marginBottom: 20,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  icon: {
    fontSize: 30,
  },

  content: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#C2410C',
  },

  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },

  number: {
    fontSize: 25,
    lineHeight: 32,
    fontWeight: '800',
    color: '#9A3412',
  },

  unit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C2410C',
    marginLeft: 6,
  },

  description: {
    fontSize: 12,
    color: '#9A3412',
    marginTop: 2,
  },
});