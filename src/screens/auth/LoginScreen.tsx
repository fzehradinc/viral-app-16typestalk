/**
 * LoginScreen — Email/Password, Google ve Apple ile giriş.
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

function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const {t} = useTranslation();
  const {signInWithEmail, signInWithGoogle, signInWithApple, isLoading, lastError} =
    useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      return;
    }
    await signInWithEmail(email.trim(), password);
    const error = useAuthStore.getState().lastError;
    if (error) {
      Alert.alert(t('common.error'), t(error as TranslationKey));
    } else {
      navigation.goBack();
    }
  }, [email, password, signInWithEmail, navigation, t]);

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
            <Text style={styles.title}>{t('auth.signIn')}</Text>
            <Text style={styles.subtitle}>{t('auth.orContinueWith')}</Text>
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

          {/* Email/Password */}
          <View style={styles.formSection}>
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

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotButton}>
              <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>

            <PrimaryButton
              title={t('auth.signIn')}
              onPress={handleEmailLogin}
              loading={isLoading}
              disabled={!email.trim() || !password.trim()}
            />
          </View>

          {/* Register link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.noAccount')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>{t('auth.signUp')}</Text>
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
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    color: palette.textSecondary,
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.sm,
  },
  forgotText: {
    color: palette.pinkStart,
    fontSize: 14,
    fontWeight: '600',
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

export default LoginScreen;
