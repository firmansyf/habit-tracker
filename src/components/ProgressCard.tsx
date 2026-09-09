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
      : Math.min(
          100,
          Math.round(
            (completedHabits / totalHabits) * 100
          )
        );

  const isComplete =
    totalHabits > 0 &&
    completedHabits >= totalHabits;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Today's Progress
          </Text>

          <Text style={styles.subtitle}>
            {isComplete
              ? 'All habits completed! 🎉'
              : 'Keep going, you are doing great.'}
          </Text>
        </View>

        <View
          style={[
            styles.percentageContainer,
            isComplete &&
              styles.percentageContainerComplete,
          ]}
        >
          <Text
            style={[
              styles.percentage,
              isComplete &&
                styles.percentageComplete,
            ]}
          >
            {progress}%
          </Text>
        </View>
      </View>

      <View style={styles.countRow}>
        <Text style={styles.count}>
          {completedHabits} of {totalHabits}
        </Text>

        <Text style={styles.countLabel}>
          habits completed
        </Text>
      </View>

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
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },

  percentageContainer: {
    minWidth: 52,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  percentageContainerComplete: {
    backgroundColor: '#DCFCE7',
  },

  percentage: {
    fontSize: 15,
    fontWeight: '800',
    color: '#16A34A',
  },

  percentageComplete: {
    color: '#15803D',
  },

  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 20,
  },

  count: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  countLabel: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 4,
  },

  progressBackground: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 5,
  },
});