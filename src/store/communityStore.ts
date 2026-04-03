/**
 * Community store — Supabase üzerinden topluluk dua gönderileri.
 */

import {create} from 'zustand';
import {supabase} from '../services/supabaseClient';
import type {AppLanguage, DuaPost} from '../types';

const TABLE = 'dua_posts';

interface CommunityState {
  posts: DuaPost[];
  isLoading: boolean;
  lastError: string | null;
  fetchPosts: (language: AppLanguage) => Promise<void>;
  createPost: (
    userId: string,
    userName: string,
    content: string,
    language: AppLanguage,
  ) => Promise<void>;
  prayForPost: (postId: string) => Promise<void>;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  posts: [],
  isLoading: false,
  lastError: null,

  fetchPosts: async (language: AppLanguage) => {
    try {
      set({isLoading: true, lastError: null});
      const {data, error} = await supabase
        .from(TABLE)
        .select('*')
        .eq('language', language)
        .order('created_at', {ascending: false})
        .limit(50);

      if (error) {
        set({lastError: error.message, isLoading: false});
        return;
      }

      const posts: DuaPost[] = (data ?? []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        userId: row.user_id as string,
        userName: row.user_name as string,
        content: row.content as string,
        prayerCount: row.prayer_count as number,
        createdAt: row.created_at as string,
        language: row.language as AppLanguage,
      }));

      set({posts, isLoading: false});
    } catch {
      set({lastError: 'Failed to fetch posts', isLoading: false});
    }
  },

  createPost: async (
    userId: string,
    userName: string,
    content: string,
    language: AppLanguage,
  ) => {
    try {
      set({isLoading: true, lastError: null});
      const {data, error} = await supabase
        .from(TABLE)
        .insert({
          user_id: userId,
          user_name: userName,
          content,
          language,
          prayer_count: 0,
        })
        .select()
        .single();

      if (error) {
        set({lastError: error.message, isLoading: false});
        return;
      }

      if (data) {
        const newPost: DuaPost = {
          id: data.id as string,
          userId: data.user_id as string,
          userName: data.user_name as string,
          content: data.content as string,
          prayerCount: data.prayer_count as number,
          createdAt: data.created_at as string,
          language: data.language as AppLanguage,
        };
        set({posts: [newPost, ...get().posts], isLoading: false});
      }
    } catch {
      set({lastError: 'Failed to create post', isLoading: false});
    }
  },

  prayForPost: async (postId: string) => {
    // Optimistic update
    const prevPosts = get().posts;
    set({
      posts: prevPosts.map(p =>
        p.id === postId ? {...p, prayerCount: p.prayerCount + 1} : p,
      ),
    });

    try {
      const current = prevPosts.find(p => p.id === postId);
      if (!current) {
        return;
      }
      const {error} = await supabase
        .from(TABLE)
        .update({prayer_count: current.prayerCount + 1})
        .eq('id', postId);

      if (error) {
        // Rollback
        set({posts: prevPosts, lastError: error.message});
      }
    } catch {
      set({posts: prevPosts, lastError: 'Failed to update prayer count'});
    }
  },
}));
