import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { ComponentProps } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

import { HomeScreen } from '../screens/HomeScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useI18n } from '../i18n/I18nContext';
import { colors, typography } from '../theme';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function tabBarIcon(routeName: string, color: string, size: number, focused: boolean) {
  const icons: Record<string, IoniconName> = {
    Home: focused ? 'home' : 'home-outline',
    Practice: focused ? 'book' : 'book-outline',
    Progress: focused ? 'stats-chart' : 'stats-chart-outline',
    Profile: focused ? 'person' : 'person-outline',
  };
  return <Ionicons name={icons[routeName]} size={size} color={color} />;
}

export function MainTabs() {
  const { t } = useI18n();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surfaceContainerLowest,
          borderTopColor: colors.surfaceContainer,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: typography.labelSm,
        tabBarIcon: ({ color, size, focused }) => tabBarIcon(route.name, color, size, focused),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('nav.home') }} />
      <Tab.Screen name="Practice" component={PracticeScreen} options={{ title: t('nav.practice') }} />
      <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: t('nav.progress') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t('nav.profile') }} />
    </Tab.Navigator>
  );
}
