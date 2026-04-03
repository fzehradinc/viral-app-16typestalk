/**
 * RegisterScreen — Yeni hesap oluşturma (Email + Sosyal).
 */

import React, {useCallback, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GradientBackground, PrimaryButton} from '../../components';
import {useAuthStore} from '../../store/authStore';
import {useTranslation} from '../../hooks/useTranslation';
import type {TranslationKey} from '../../hooks/useTranslation';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import type {RootStackParamList} from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function RegisterScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const {t} = useTranslation();
  const {signUpWithEmail, signInWithGoogle, signInWithApple, isLoading} =
    useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = useCallback(async () => {
    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordMismatch'));
      return;
    }
    await signUpWithEmail(email.trim(), password, name.trim());
    const error = useAuthStore.getState().lastError;
    if (error) {
      Alert.alert(t('common.error'), t(error as TranslationKey));
    } else {
      navigation.goBack();
    }
  }, [email, password, confirmPassword, name, signUpWithEmail, navigation, t]);

  const handleGoogleLogin = useCallback(async () => {
    await signInWithGoogle();
    const error = useAuthStore.getState().lastError;
    if (error) {
      Alert.alert(t('common.error'), t(error as TranslationKey));
    } else {
      navigation.goBack();
    }
  }, [signInWithGoogle, navigation, t]);

  const handleAppleLogin = useCallback(async () => {
    await signInWithApple();
    const error = useAuthStore.getState().lastError;
    if (error) {
      Alert.alert(t('common.error'), t(error as TranslationKey));
    } else {
      navigation.goBack();
    }
  }, [signInWithApple, navigation, t]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    confirmPassword.length > 0;

  return (
    <View style={styles.root}>
      <GradientBackground />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={28} color={palette.white} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{t('auth.signUp')}</Text>
          </View>

          {/* Social Buttons */}
          <View style={styles.socialSection}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleLogin}
              disabled={isLoading}>
              <Ionicons name="logo-google" size={22} color={palette.white} />
              <Text style={styles.socialText}>
                {t('auth.continueWithGoogle')}
              </Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleAppleLogin}
                disabled={isLoading}>
                <Ionicons name="logo-apple" size={22} color={palette.white} />
                <Text style={styles.socialText}>
                  {t('auth.continueWithApple')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('auth.orContinueWith')}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <TextInput
              style={styles.input}
              placeholder={t('auth.name')}
              placeholderTextColor={palette.textSecondary}
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder={t('auth.email')}
              placeholderTextColor={palette.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder={t('auth.password')}
              placeholderTextColor={palette.textSecondary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder={t('auth.confirmPassword')}
              placeholderTextColor={palette.textSecondary}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <PrimaryButton
              title={t('auth.signUp')}
              onPress={handleRegister}
              loading={isLoading}
              disabled={!isFormValid}
            />
          </View>

          {/* Login link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.hasAccount')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>{t('auth.signIn')}</Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text style={styles.terms}>{t('auth.agreeToTerms')}</Text>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.white,
  },
  socialSection: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.glass,
    borderRadius: 14,
    paddingVertical: 14,
    gap: spacing.sm,
  },
  socialText: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: palette.glass,
  },
  dividerText: {
    color: palette.textSecondary,
    fontSize: 13,
    marginHorizontal: spacing.sm,
  },
  formSection: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  input: {
    backgroundColor: palette.glass,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  footerText: {
    color: palette.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: palette.pinkStart,
    fontSize: 14,
    fontWeight: '700',
  },
  terms: {
    textAlign: 'center',
    color: palette.textSecondary,
    fontSize: 12,
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    lineHeight: 18,
  },
});

export default RegisterScreen;
