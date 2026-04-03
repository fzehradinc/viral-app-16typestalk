import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import BannerAdView from '../components/common/BannerAdView';
import HomeStackNavigator from './HomeStackNavigator';
import QuranStackNavigator from './QuranStackNavigator';
import DuaStackNavigator from './DuaStackNavigator';
import ReflectStackNavigator from './ReflectStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import {useSubscriptionStore} from '../store/subscriptionStore';
import {darkTheme, palette} from '../theme/colors';
import {typography} from '../theme/typography';
import type {MainTabParamList} from './types';

const INACTIVE_COLOR = 'rgba(255,255,255,0.4)';
const TAB_BAR_BASE_HEIGHT = 60;
const BANNER_HEIGHT = 50;

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const isPro = useSubscriptionStore(s => s.isPro);

  return (
    <View style={styles.root}>
      {!isPro && <BannerAdView />}
      <View style={styles.flex}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: palette.pinkStart,
            tabBarInactiveTintColor: INACTIVE_COLOR,
            tabBarLabelStyle: typography.small,
            tabBarStyle: {
              backgroundColor: darkTheme.tabBarBackground,
              borderTopWidth: 0,
              elevation: 0,
              height: TAB_BAR_BASE_HEIGHT + insets.bottom,
              paddingBottom: insets.bottom,
              paddingTop: 6,
            },
          }}>
          <Tab.Screen
            name="HomeTab"
            component={HomeStackNavigator}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({color, focused}) => (
                <Icon
                  name={focused ? 'home' : 'home-outline'}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="QuranTab"
            component={QuranStackNavigator}
            options={{
              tabBarLabel: 'Quran',
              tabBarIcon: ({color, focused}) => (
                <Icon
                  name={focused ? 'book' : 'book-outline'}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="DuaTab"
            component={DuaStackNavigator}
            options={{
              tabBarLabel: 'Dua',
              tabBarIcon: ({color, focused}) => (
                <Icon
                  name={focused ? 'star' : 'star-outline'}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="ReflectTab"
            component={ReflectStackNavigator}
            options={{
              tabBarLabel: 'Reflect',
              tabBarIcon: ({color, focused}) => (
                <Icon
                  name={focused ? 'moon' : 'moon-outline'}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={ProfileStackNavigator}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({color, focused}) => (
                <Icon
                  name={focused ? 'person-circle' : 'person-circle-outline'}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  flex: {
    flex: 1,
  },

});

export default MainTabNavigator;

/**
 * MainTabNavigator mimari kararları:
 * 1. Her sekme kendi NativeStackNavigator'ına sahip → her tab bağımsız stack geçmişi tutar.
 * 2. BannerAdPlaceholder tab bar'ın üstünde, yalnızca free kullanıcılara gösterilir.
 * 3. Tab bar yüksekliği SafeArea inset'i ile dinamik hesaplanır (çentikli cihaz uyumluluğu).
 * 4. Ionicons ikonu: filled (aktif) / outline (pasif) prensibi iOS HIG ile uyumlu.
 */
