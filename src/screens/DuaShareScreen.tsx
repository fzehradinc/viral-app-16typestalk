/**
 * DuaShareScreen — Dua paylaşım ve kopyalama ekranı.
 */

import React, {useCallback, useState} from 'react';
import {
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import {GradientBackground} from '../components';
import {palette} from '../theme/colors';
import {spacing} from '../theme/spacing';
import type {DuaStackParamList} from '../navigation/types';

function DuaShareScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<DuaStackParamList, 'DuaShare'>>();
  const {dua, recipientName} = route.params;

  const [copied, setCopied] = useState(false);

  const shareText =
    `Dua for ${recipientName}:\n\n` +
    `${dua}\n\n` +
    '— Shared from Noorbloom';

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleShare = useCallback(() => {
    Share.share({message: shareText});
  }, [shareText]);

  const handleCopy = useCallback(() => {
    Clipboard.setString(dua);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [dua]);

  const handleWhatsApp = useCallback(() => {
    const encoded = encodeURIComponent(shareText);
    const url = `whatsapp://send?text=${encoded}`;
    Linking.canOpenURL(url).then(can => {
      if (can) {
        Linking.openURL(url);
      }
    });
  }, [shareText]);

  return (
    <View style={styles.root}>
      <GradientBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
            <Ionicons name="chevron-back" size={26} color={palette.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Share Dua</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          {/* Dua kartı */}
          <View style={styles.duaCard}>
            <View style={styles.cardAccent} />
            <Text style={styles.cardTitle}>Dua for {recipientName}</Text>
            <Text style={styles.cardDua}>{dua}</Text>
            <Text style={styles.cardSignature}>
              — Shared from Noorbloom
            </Text>
          </View>

          {/* Paylaş butonu */}
          <TouchableOpacity
            style={styles.sharePrimaryBtn}
            onPress={handleShare}
            activeOpacity={0.8}>
            <Ionicons name="share-outline" size={20} color={palette.white} />
            <Text style={styles.sharePrimaryText}>Share via...</Text>
          </TouchableOpacity>

          {/* Kopyala butonu */}
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={handleCopy}
            activeOpacity={0.8}>
            <Ionicons
              name={copied ? 'checkmark-circle' : 'copy-outline'}
              size={20}
              color={palette.white}
            />
            <Text style={styles.copyBtnText}>
              {copied ? 'Copied!' : 'Copy Dua'}
            </Text>
          </TouchableOpacity>

          {/* WhatsApp butonu */}
          <TouchableOpacity
            style={styles.whatsappBtn}
            onPress={handleWhatsApp}
            activeOpacity={0.8}>
            <Ionicons name="logo-whatsapp" size={22} color={palette.white} />
            <Text style={styles.whatsappText}>Share via WhatsApp</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
  },
  headerSpacer: {
    width: 26,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  duaCard: {
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: spacing.lg,
    overflow: 'hidden',
    shadowColor: palette.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: palette.pinkStart,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.backgroundDark,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  cardDua: {
    fontSize: 18,
    color: palette.backgroundDark,
    lineHeight: 28,
  },
  cardSignature: {
    fontSize: 13,
    color: 'rgba(26,10,46,0.5)',
    marginTop: spacing.md,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  sharePrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: palette.pinkEnd,
    borderRadius: 16,
    paddingVertical: 14,
  },
  sharePrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.white,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: palette.glass,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  copyBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.white,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#25D366',
    borderRadius: 16,
    paddingVertical: 14,
  },
  whatsappText: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.white,
  },
  bottomSpacer: {
    height: 120,
  },
});

export default DuaShareScreen;
