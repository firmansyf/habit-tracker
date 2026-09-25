import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';

type StreakCardProps = {
  currentStreak: number;
};

export default function StreakCard({
  currentStreak,
}: StreakCardProps) {
  const {
    colors,
    colorScheme,
  } = useAppTheme();

  const streakLabel =
    currentStreak === 1
      ? 'day streak'
      : 'day streaks';

  const cardBackground =
    colorScheme === 'dark'
      ? '#3A2415'
      : '#FFF7ED';

  const cardBorder =
    colorScheme === 'dark'
      ? '#7C3F16'
      : '#FED7AA';

  const iconBackground =
    colorScheme === 'dark'
      ? '#4A2D17'
      : '#FFEDD5';

  const accent =
    colorScheme === 'dark'
      ? '#FDBA74'
      : '#C2410C';

  const numberColor =
    colorScheme === 'dark'
      ? '#FB923C'
      : '#9A3412';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            cardBackground,
          borderColor:
            cardBorder,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              iconBackground,
          },
        ]}
      >
        <Text style={styles.icon}>
          🔥
        </Text>
      </View>

      <View
        style={styles.content}
      >
        <Text
          style={[
            styles.eyebrow,
            {
              color: accent,
            },
          ]}
        >
          CURRENT STREAK
        </Text>

        <View
          style={styles.valueRow}
        >
          <Text
            style={[
              styles.number,
              {
                color:
                  numberColor,
              },
            ]}
          >
            {currentStreak}
          </Text>

          <Text
            style={[
              styles.unit,
              {
                color: accent,
              },
            ]}
          >
            {streakLabel}
          </Text>
        </View>

        <Text
          style={[
            styles.description,
            {
              color: accent,
            },
          ]}
        >
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
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
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
  },

  unit: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  description: {
    fontSize: 12,
    marginTop: 2,
  },
});