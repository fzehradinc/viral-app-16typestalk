/**
 * HeaderSection — selamlama metni, kullanıcı adı, giriş/profil butonu.
 * Gün saatine göre selamlama, Pro rozeti desteği.
 */

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {palette, darkTheme} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

interface HeaderSectionProps {
  userName: string;
  isPro: boolean;
  isAuthenticated: boolean;
  onSignInPress: () => void;
  onProfilePress: () => void;
}

function getGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'greetings.goodMorning';
  }
  if (hour >= 12 && hour < 17) {
    return 'greetings.goodAfternoon';
  }
  if (hour >= 17 && hour < 21) {
    return 'greetings.goodEvening';
  }
  return 'greetings.assalamuAlaikum';
}

function HeaderSection({
  userName,
  isPro,
  isAuthenticated,
  onSignInPress,
  onProfilePress,
}: HeaderSectionProps): React.JSX.Element {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={styles.greeting}>{t(getGreetingKey())}</Text>
        <Text style={styles.userName} numberOfLines={1}>
          {userName}
        </Text>
      </View>

      {isAuthenticated ? (
        <TouchableOpacity
          onPress={onProfilePress}
          style={styles.avatarWrapper}
          hitSlop={8}>
          <View style={styles.avatar}>
            <Icon name="person" size={22} color={palette.white} />
          </View>
          {isPro && (
            <View style={styles.proBadge}>
              <Icon name="checkmark-circle" size={14} color={palette.pinkStart} />
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onSignInPress} style={styles.signInButton}>
          <Text style={styles.signInText}>{t('auth.signIn')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.select({ios: spacing.sm, android: spacing.md}),
  },
  textWrapper: {
    flex: 1,
    marginRight: spacing.md,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '600',
    color: darkTheme.textPrimary,
    opacity: 0.7,
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: darkTheme.textPrimary,
    marginTop: spacing.xs,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.glass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  proBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: darkTheme.background,
    borderRadius: 8,
    padding: 1,
  },
  signInButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: palette.glass,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  signInText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.pinkStart,
  },
});

export default HeaderSection;
