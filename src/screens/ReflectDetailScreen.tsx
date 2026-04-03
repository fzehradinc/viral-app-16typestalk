/**
 * ReflectDetailScreen — tek bir tefekkür girdisinin detay görünümü.
 * Konu rozeti, kullanıcı metni, AI reflection, paylaş/kopyala/sil aksiyonları.
 */

import React, {useCallback, useEffect, useState} from 'react';
import {Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import {GradientBackground, GlassCard} from '../components';
import {useReflectionStore} from '../store/reflectionStore';
import {palette, gradients} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import type {ReflectStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<ReflectStackParamList, 'ReflectDetail'>;
type Nav = NativeStackNavigationProp<ReflectStackParamList>;

function ReflectDetailScreen(): React.JSX.Element | null {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Props['route']>();
  const {entryId, date} = route.params;
  const entry = useReflectionStore(state =>
    state.allEntries.find(e => e.id === entryId),
  );
  const deleteEntry = useReflectionStore(state => state.deleteEntry);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!entry) {
      navigation.goBack();
    }
  }, [entry, navigation]);

  const handleDelete = useCallback(() => {
    Alert.alert('Delete Entry', 'This cannot be undone.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteEntry(entryId);
          navigation.goBack();
        },
      },
    ]);
  }, [deleteEntry, entryId, navigation]);

  const handleShare = useCallback(async () => {
    if (!entry) {
      return;
    }
    const text = entry.aiReflection
      ? `${entry.content}\n\n✨ ${entry.aiReflection}`
      : entry.content;
    await Share.share({message: text});
  }, [entry]);

  const handleCopy = useCallback(() => {
    if (!entry) {
      return;
    }
    const text = entry.aiReflection ?? entry.content;
    Clipboard.setString(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [entry]);

  if (!entry) {
    return null;
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={palette.white}
              />
            </TouchableOpacity>
            <Text style={styles.headerDate}>{date}</Text>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleDelete}>
              <Ionicons
                name="trash-outline"
                size={22}
                color="#FF453A"
              />
            </TouchableOpacity>
          </View>

          {/* Topic badge */}
          <View style={styles.topicBadge}>
            <Text style={styles.topicBadgeText}>
              {entry.topic}
            </Text>
          </View>

          {/* Mood badge */}
          {entry.mood && (
            <View style={styles.moodBadge}>
              <Text style={styles.moodBadgeText}>{entry.mood}</Text>
            </View>
          )}

          {/* User content */}
          <GlassCard style={styles.contentCard}>
            <Text style={styles.contentText}>{entry.content}</Text>
          </GlassCard>

          {/* AI Reflection */}
          {entry.aiReflection && (
            <LinearGradient
              colors={[...gradients.pink]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.aiCard}>
              <View style={styles.aiHeader}>
                <Ionicons name="sparkles" size={18} color={palette.white} />
                <Text style={styles.aiTitle}>Your Islamic Reflection</Text>
              </View>
              <Text style={styles.aiText}>{entry.aiReflection}</Text>
            </LinearGradient>
          )}

          {/* Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
              <Ionicons
                name={copied ? 'checkmark' : 'copy-outline'}
                size={20}
                color={palette.pinkStart}
              />
              <Text style={styles.actionLabel}>
                {copied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}>
              <Ionicons
                name="share-outline"
                size={20}
                color={palette.pinkStart}
              />
              <Text style={styles.actionLabel}>Share</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDate: {
    ...typography.heading,
    color: palette.white,
  },
  topicBadge: {
    alignSelf: 'flex-start',
    backgroundColor: palette.glass,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  topicBadgeText: {
    ...typography.caption,
    color: palette.pinkStart,
    textTransform: 'capitalize',
  },
  moodBadge: {
    alignSelf: 'flex-start',
    backgroundColor: palette.glass,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  moodBadgeText: {
    ...typography.caption,
    color: palette.textSecondary,
    textTransform: 'capitalize',
  },
  contentCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  contentText: {
    ...typography.body,
    color: palette.white,
  },
  aiCard: {
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  aiTitle: {
    ...typography.caption,
    color: palette.white,
    fontWeight: '600',
  },
  aiText: {
    ...typography.body,
    color: palette.white,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: palette.glass,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionLabel: {
    ...typography.caption,
    color: palette.pinkStart,
  },
});

export default ReflectDetailScreen;
