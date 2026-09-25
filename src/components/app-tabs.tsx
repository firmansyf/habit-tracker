import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useAppTheme } from '@/hooks/useAppTheme';

export default function AppTabs() {
  const { colors, colorScheme } =
    useAppTheme();

  const isDark = colorScheme === 'dark';

  return (
    <NativeTabs
      backgroundColor={colors.surface}
      tintColor={colors.primary}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label
          hidden={false}
        >
          Home
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: 'house',
            selected: 'house.fill',
          }}
          md={{
            default: 'home',
            selected: 'home_filled',
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="stats">
        <NativeTabs.Trigger.Label
          hidden={false}
        >
          Stats
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: 'chart.bar',
            selected: 'chart.bar.fill',
          }}
          md={{
            default: 'bar_chart',
            selected: 'bar_chart',
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label
          hidden={false}
        >
          Settings
        </NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          sf={{
            default: 'gearshape',
            selected: 'gearshape.fill',
          }}
          md={{
            default: 'settings',
            selected: 'settings',
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}