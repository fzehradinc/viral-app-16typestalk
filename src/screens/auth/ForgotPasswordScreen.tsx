/**
 * ForgotPasswordScreen — Şifre sıfırlama e-postası gönder.
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GradientBackground, PrimaryButton} from '../../components';
import {useAuthStore} from '../../store/authStore';
import {useTranslation} from '../../hooks/useTranslation';
import type {TranslationKey} from '../../hooks/useTranslation';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

function ForgotPasswordScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {resetPassword, isLoading} = useAuthStore();

  const [email, setEmail] = useState('');

  const handleReset = useCallback(async () => {
    if (!email.trim()) {
      return;
    }
    await resetPassword(email.trim());
    const error = useAuthStore.getState().lastError;
    if (error) {
      Alert.alert(t('common.error'), t(error as TranslationKey));
    } else {
      Alert.alert(t('auth.resetSent'), t('auth.resetSentDesc'), [
        {text: t('common.ok'), onPress: () => navigation.goBack()},
      ]);
    }
  }, [email, resetPassword, navigation, t]);

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

          {/* Content */}
          <View style={styles.content}>
            <Ionicons
              name="mail-outline"
              size={64}
              color={palette.pinkStart}
              style={styles.icon}
            />
            <Text style={styles.title}>{t('auth.forgotPassword')}</Text>
            <Text style={styles.description}>
              {t('auth.forgotPasswordDesc')}
            </Text>

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

            <PrimaryButton
              title={t('auth.sendResetLink')}
              onPress={handleReset}
              loading={isLoading}
              disabled={!email.trim()}
            />
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.white,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 15,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  input: {
    backgroundColor: palette.glass,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.white,
    width: '100%',
    marginBottom: spacing.md,
  },
});

export default ForgotPasswordScreen;
