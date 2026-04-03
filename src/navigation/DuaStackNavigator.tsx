import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DuaScreen from '../screens/DuaScreen';
import DuaShareScreen from '../screens/DuaShareScreen';
import DelailHayratScreen from '../screens/DelailHayratScreen';
import DuaCommunityScreen from '../screens/DuaCommunityScreen';
import {typography} from '../theme/typography';
import type {DuaStackParamList} from './types';

const Stack = createNativeStackNavigator<DuaStackParamList>();

function DuaStackNavigator(): React.JSX.Element {
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
        name="DuaMain"
        component={DuaScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DuaShare"
        component={DuaShareScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DelailHayrat"
        component={DelailHayratScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DuaCommunity"
        component={DuaCommunityScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default DuaStackNavigator;
