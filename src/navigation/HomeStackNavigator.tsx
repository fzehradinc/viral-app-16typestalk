import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AffirmationsScreen from '../screens/AffirmationsScreen';
import DhikrListScreen from '../screens/DhikrListScreen';
import DhikrMaticScreen from '../screens/DhikrMaticScreen';
import RamadanTrackerScreen from '../screens/RamadanTrackerScreen';
import {typography} from '../theme/typography';
import type {HomeStackParamList} from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: 'dark',
        headerTintColor: '#FFFFFF',
        headerTitleStyle: typography.heading,
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Affirmations"
        component={AffirmationsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DhikrList"
        component={DhikrListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DhikrMatic"
        component={DhikrMaticScreen}
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="RamadanTracker"
        component={RamadanTrackerScreen}
        options={{
          headerShown: false,
          presentation: 'fullScreenModal',
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;
