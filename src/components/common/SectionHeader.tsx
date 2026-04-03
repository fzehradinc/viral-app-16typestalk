import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {darkTheme} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';

/**
 * SectionHeader
 *
 * Swift'teki HStack başlık + sağda küçük buton düzeni.
 * Tüm section başlıklarında kullanılır.
 */

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

function SectionHeader({
  title,
  subtitle,
  action,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action ? (
        <TouchableOpacity onPress={action.onPress} hitSlop={8}>
          <Text style={styles.action}>{action.label}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.heading,
    color: darkTheme.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: darkTheme.textSecondary,
    marginTop: 2,
  },
  action: {
    ...typography.caption,
    color: darkTheme.tabBarActive,
  },
});

export default SectionHeader;

/**
 * SectionHeader düzeni:
 * Sol taraf: başlık + isteğe bağlı alt başlık.
 * Sağ taraf: isteğe bağlı aksiyon butonu (örnek: "Tümünü Gör").
 * hitSlop=8 ile küçük dokunma alanı genişletilir.
 */
