/**
 * DuaCommunityScreen — Supabase ile topluluk dua paylaşımı ve dua etme.
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
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
import {GradientBackground, GlassCard, PrimaryButton} from '../components';
import {useAuthStore} from '../store/authStore';
import {useCommunityStore} from '../store/communityStore';
import {useLanguageStore} from '../store/languageStore';
import {useTranslation} from '../hooks/useTranslation';
import {palette} from '../theme/colors';
import {spacing} from '../theme/spacing';
import type {DuaPost} from '../types';
import type {RootStackParamList} from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function DuaCommunityScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const rootNav = useNavigation<Nav>();
  const {t} = useTranslation();
  const {currentUser, isAuthenticated} = useAuthStore();
  const {posts, isLoading, fetchPosts, createPost, prayForPost} =
    useCommunityStore();
  const {currentLanguage} = useLanguageStore();

  const [newPostText, setNewPostText] = useState('');

  useEffect(() => {
    fetchPosts(currentLanguage);
  }, [currentLanguage, fetchPosts]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCreatePost = useCallback(async () => {
    if (!currentUser || !newPostText.trim()) {
      return;
    }
    await createPost(
      currentUser.id,
      currentUser.name,
      newPostText.trim(),
      currentLanguage,
    );
    setNewPostText('');
  }, [currentUser, newPostText, createPost, currentLanguage]);

  const handlePray = useCallback(
    (postId: string) => {
      prayForPost(postId);
    },
    [prayForPost],
  );

  const renderPost = useCallback(
    ({item}: {item: DuaPost}) => (
      <GlassCard style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.postAvatar}>
            <Text style={styles.postAvatarText}>
              {item.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.postMeta}>
            <Text style={styles.postUserName}>{item.userName}</Text>
            <Text style={styles.postDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <Text style={styles.postContent}>{item.content}</Text>
        <TouchableOpacity
          style={styles.prayButton}
          onPress={() => handlePray(item.id)}>
          <Text style={styles.prayEmoji}>🤲</Text>
          <Text style={styles.prayText}>
            {t('community.prayed')} ({item.prayerCount})
          </Text>
        </TouchableOpacity>
      </GlassCard>
    ),
    [handlePray, t],
  );

  const keyExtractor = useCallback((item: DuaPost) => item.id, []);

  return (
    <View style={styles.root}>
      <GradientBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
            <Ionicons name="chevron-back" size={26} color={palette.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('community.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Sign-in banner */}
        {!isAuthenticated && (
          <GlassCard style={styles.signInBanner}>
            <Text style={styles.signInBannerText}>
              {t('community.signInPrompt')}
            </Text>
            <TouchableOpacity onPress={() => rootNav.navigate('Login')}>
              <Text style={styles.signInLink}>{t('auth.signIn')}</Text>
            </TouchableOpacity>
          </GlassCard>
        )}

        {/* New post input */}
        {isAuthenticated && (
          <View style={styles.newPostContainer}>
            <TextInput
              style={styles.newPostInput}
              placeholder={t('community.writeDua')}
              placeholderTextColor={palette.textSecondary}
              multiline
              maxLength={500}
              value={newPostText}
              onChangeText={setNewPostText}
            />
            <PrimaryButton
              title={t('community.share')}
              onPress={handleCreatePost}
              loading={isLoading}
              disabled={!newPostText.trim()}
            />
          </View>
        )}

        {/* Posts list */}
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🤝</Text>
              <Text style={styles.emptyText}>
                {t('community.empty')}
              </Text>
            </View>
          }
        />
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
  signInBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  signInBannerText: {
    fontSize: 13,
    color: palette.textSecondary,
    flex: 1,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.pinkStart,
    marginLeft: spacing.sm,
  },
  newPostContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  newPostInput: {
    backgroundColor: palette.glass,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: palette.white,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  postCard: {
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.purpleStart,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  postAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.white,
  },
  postMeta: {
    flex: 1,
  },
  postUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.white,
  },
  postDate: {
    fontSize: 11,
    color: palette.textSecondary,
    marginTop: 2,
  },
  postContent: {
    fontSize: 15,
    color: palette.white,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  prayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    gap: spacing.xs,
  },
  prayEmoji: {
    fontSize: 16,
  },
  prayText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.white,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default DuaCommunityScreen;
