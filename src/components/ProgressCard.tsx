import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';

type ProgressCardProps = {
  completedHabits: number;
  totalHabits: number;
};

export default function ProgressCard({
  completedHabits,
  totalHabits,
}: ProgressCardProps) {
  const {
    colors,
    colorScheme,
  } = useAppTheme();

  const progress =
    totalHabits === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (completedHabits /
              totalHabits) *
              100
          )
        );

  const isComplete =
    totalHabits > 0 &&
    completedHabits >= totalHabits;

  const percentageBackground =
    isComplete
      ? colorScheme === 'dark'
        ? '#14532D'
        : '#DCFCE7'
      : colorScheme === 'dark'
        ? '#12351F'
        : '#F0FDF4';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            colors.card,
          borderColor:
            colors.border,
        },
      ]}
    >
      <View
        style={styles.header}
      >
        <View
          style={styles.headerContent}
        >
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Today's Progress
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color:
                  colors.textSecondary,
              },
            ]}
          >
            {isComplete
              ? 'All habits completed! 🎉'
              : 'Keep going, you are doing great.'}
          </Text>
        </View>

        <View
          style={[
            styles.percentageContainer,
            {
              backgroundColor:
                percentageBackground,
            },
          ]}
        >
          <Text
            style={[
              styles.percentage,
              {
                color:
                  colors.success,
              },
            ]}
          >
            {progress}%
          </Text>
        </View>
      </View>

      <View
        style={styles.countRow}
      >
        <Text
          style={[
            styles.count,
            {
              color: colors.text,
            },
          ]}
        >
          {completedHabits} of {totalHabits}
        </Text>

        <Text
          style={[
            styles.countLabel,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          habits completed
        </Text>
      </View>

      <View
        style={[
          styles.progressBackground,
          {
            backgroundColor:
              colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress}%`,
              backgroundColor:
                colors.success,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent:
      'space-between',
  },

  headerContent: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },

  percentageContainer: {
    minWidth: 52,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  percentage: {
    fontSize: 15,
    fontWeight: '800',
  },

  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 20,
  },

  count: {
    fontSize: 15,
    fontWeight: '700',
  },

  countLabel: {
    fontSize: 13,
    marginLeft: 4,
  },

  progressBackground: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
  },

  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
});