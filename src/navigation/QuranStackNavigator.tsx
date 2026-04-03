import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import QuranHomeScreen from '../screens/QuranHomeScreen';
import QuranReaderScreen from '../screens/QuranReaderScreen';
import {typography} from '../theme/typography';
import type {QuranStackParamList} from './types';

const Stack = createNativeStackNavigator<QuranStackParamList>();

function QuranStackNavigator(): React.JSX.Element {
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
        name="QuranHome"
        component={QuranHomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="QuranReader"
        component={QuranReaderScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default QuranStackNavigator;

/**
 * Quran stack — sure listesi, ayet detayı gibi
 * push ekranları ilerleyen promptlarda eklenecek.
 */
