import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ReflectScreen from '../screens/ReflectScreen';
import ReflectCalendarScreen from '../screens/ReflectCalendarScreen';
import ReflectDetailScreen from '../screens/ReflectDetailScreen';
import {typography} from '../theme/typography';
import type {ReflectStackParamList} from './types';

const Stack = createNativeStackNavigator<ReflectStackParamList>();

function ReflectStackNavigator(): React.JSX.Element {
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
        name="ReflectMain"
        component={ReflectScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ReflectCalendar"
        component={ReflectCalendarScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ReflectDetail"
        component={ReflectDetailScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default ReflectStackNavigator;
