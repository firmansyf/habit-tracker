import { StyleSheet, Text, View } from 'react-native';

type ProgressCardProps = {
  completedHabits: number;
  totalHabits: number;
};

export default function ProgressCard({
  completedHabits,
  totalHabits,
}: ProgressCardProps) {
  const progress =
    totalHabits === 0
      ? 0
      : Math.round(
          (completedHabits / totalHabits) * 100
        );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Today's Progress
        </Text>

        <Text style={styles.percentage}>
          {progress}%
        </Text>
      </View>

      <Text style={styles.count}>
        {completedHabits} / {totalHabits} habits completed
      </Text>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  percentage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16A34A',
  },

  count: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },

  progressBackground: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 16,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 5,
  },
});