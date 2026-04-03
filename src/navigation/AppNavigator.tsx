import React, {useEffect, useState} from 'react';
import {AppState} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainTabNavigator from './MainTabNavigator';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import type {RootStackParamList} from './types';

const ONBOARDING_KEY = '@noorbloom/hasCompletedOnboarding';
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator(): React.JSX.Element {
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    async function check() {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasOnboarded(value === 'true');
    }
    check();

    // Storage değişimini dinle — onboarding tamamlanınca re-check
    const interval = setInterval(check, 500);
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        check();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  if (hasOnboarded === null) {
    return <></>;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      {hasOnboarded ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      )}

      {/* Modal auth screens */}
      <Stack.Group
        screenOptions={{presentation: 'modal', headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default AppNavigator;

/**
 * Kök navigator — onboarding / main split:
 * 1. AsyncStorage'dan "hasCompletedOnboarding" flag'i okunur.
 * 2. false ise → OnboardingScreen (tab bar yok, fullscreen).
 * 3. true ise → MainTabNavigator (5 sekmeli uygulama).
 * 4. Geçiş: fade animasyonu — iOS modal hissi verir.
 * 5. Koşullu rendering (conditional screens) pattern'i
 *    react-navigation v7'nin önerdiği auth-flow yapısıdır.
 */
