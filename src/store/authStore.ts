/**
 * Auth store — Firebase Authentication ile kullanıcı oturum yönetimi.
 * Google Sign-In, Apple Sign-In, Email/Password destekli.
 */

import {create} from 'zustand';
import {Platform} from 'react-native';
import auth from '@react-native-firebase/auth';
import type {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {ENV} from '../config/env';
import * as purchaseService from '../services/purchaseService';
import type {AppUser} from '../types';

/** Firebase User → AppUser dönüşümü */
function mapFirebaseUser(user: FirebaseAuthTypes.User): AppUser {
  const providerId = user.providerData[0]?.providerId;
  return {
    id: user.uid,
    email: user.email,
    name: user.displayName ?? 'Friend',
    avatarUrl: user.photoURL,
    createdAt: user.metadata.creationTime ?? new Date().toISOString(),
    provider:
      providerId === 'google.com'
        ? 'google'
        : providerId === 'apple.com'
          ? 'apple'
          : 'email',
  };
}

/** Firebase hata kodlarını kullanıcı dostu mesaja çevir */
export function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'auth.emailInUse';
    case 'auth/wrong-password':
      return 'auth.wrongPassword';
    case 'auth/user-not-found':
      return 'auth.userNotFound';
    case 'auth/invalid-email':
      return 'auth.invalidEmail';
    case 'auth/weak-password':
      return 'auth.weakPassword';
    case 'auth/network-request-failed':
      return 'auth.networkError';
    default:
      return 'auth.genericError';
  }
}

interface AuthState {
  currentUser: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastError: string | null;
  _unsubscribe: (() => void) | null;
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string,
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  lastError: null,
  _unsubscribe: null,

  initialize: async () => {
    // Google Sign-In yapılandırması
    GoogleSignin.configure({
      webClientId: ENV.GOOGLE_WEB_CLIENT_ID,
    });

    // Auth state listener
    const unsubscribe = auth().onAuthStateChanged(
      (user: FirebaseAuthTypes.User | null) => {
        if (user) {
          set({
            currentUser: mapFirebaseUser(user),
            isAuthenticated: true,
            isLoading: false,
            lastError: null,
          });
          // RevenueCat kullanıcı senkronizasyonu
          purchaseService.logIn(user.uid).catch(() => {});
        } else {
          set({
            currentUser: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    );

    set({_unsubscribe: unsubscribe});
  },

  signInWithEmail: async (email: string, password: string) => {
    try {
      set({isLoading: true, lastError: null});
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error: unknown) {
      const code =
        error instanceof Object && 'code' in error
          ? (error as {code: string}).code
          : '';
      set({lastError: getAuthErrorMessage(code), isLoading: false});
    }
  },

  signUpWithEmail: async (
    email: string,
    password: string,
    name: string,
  ) => {
    try {
      set({isLoading: true, lastError: null});
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await result.user.updateProfile({displayName: name});
      set({
        currentUser: mapFirebaseUser({
          ...result.user,
          displayName: name,
        } as FirebaseAuthTypes.User),
      });
    } catch (error: unknown) {
      const code =
        error instanceof Object && 'code' in error
          ? (error as {code: string}).code
          : '';
      set({lastError: getAuthErrorMessage(code), isLoading: false});
    }
  },

  signInWithGoogle: async () => {
    try {
      set({isLoading: true, lastError: null});
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;
      if (!idToken) {
        set({lastError: 'auth.genericError', isLoading: false});
        return;
      }
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error: unknown) {
      const code =
        error instanceof Object && 'code' in error
          ? (error as {code: string}).code
          : '';
      set({lastError: getAuthErrorMessage(code), isLoading: false});
    }
  },

  signInWithApple: async () => {
    if (Platform.OS !== 'ios') {
      return;
    }
    try {
      set({isLoading: true, lastError: null});
      const appleAuth = (
        await import('@invertase/react-native-apple-authentication')
      ).default;
      const {AppleRequestScope, AppleRequestOperation} = await import(
        '@invertase/react-native-apple-authentication'
      );

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleRequestOperation.LOGIN,
        requestedScopes: [
          AppleRequestScope.FULL_NAME,
          AppleRequestScope.EMAIL,
        ],
      });

      const {identityToken, nonce} = appleAuthRequestResponse;
      if (!identityToken) {
        set({lastError: 'auth.genericError', isLoading: false});
        return;
      }

      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );
      await auth().signInWithCredential(appleCredential);
    } catch (error: unknown) {
      const code =
        error instanceof Object && 'code' in error
          ? (error as {code: string}).code
          : '';
      set({lastError: getAuthErrorMessage(code), isLoading: false});
    }
  },

  signOut: async () => {
    try {
      set({isLoading: true, lastError: null});
      const user = get().currentUser;
      await auth().signOut();
      if (user?.provider === 'google') {
        try {
          await GoogleSignin.signOut();
        } catch {
          // Google Sign-Out sessizce başarısız olabilir
        }
      }
      set({currentUser: null, isAuthenticated: false, isLoading: false});
      // RevenueCat oturumu kapat
      await purchaseService.logOut().catch(() => {});
    } catch (error: unknown) {
      const code =
        error instanceof Object && 'code' in error
          ? (error as {code: string}).code
          : '';
      set({lastError: getAuthErrorMessage(code), isLoading: false});
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({isLoading: true, lastError: null});
      await auth().sendPasswordResetEmail(email);
      set({isLoading: false});
    } catch (error: unknown) {
      const code =
        error instanceof Object && 'code' in error
          ? (error as {code: string}).code
          : '';
      set({lastError: getAuthErrorMessage(code), isLoading: false});
    }
  },

  deleteAccount: async () => {
    try {
      set({isLoading: true, lastError: null});
      const firebaseUser = auth().currentUser;
      if (firebaseUser) {
        await firebaseUser.delete();
      }
      set({currentUser: null, isAuthenticated: false, isLoading: false});
    } catch (error: unknown) {
      const code =
        error instanceof Object && 'code' in error
          ? (error as {code: string}).code
          : '';
      set({lastError: getAuthErrorMessage(code), isLoading: false});
    }
  },

  updateDisplayName: async (name: string) => {
    try {
      set({lastError: null});
      const firebaseUser = auth().currentUser;
      if (firebaseUser) {
        await firebaseUser.updateProfile({displayName: name});
        const current = get().currentUser;
        if (current) {
          set({currentUser: {...current, name}});
        }
      }
    } catch (error: unknown) {
      const code =
        error instanceof Object && 'code' in error
          ? (error as {code: string}).code
          : '';
      set({lastError: getAuthErrorMessage(code)});
    }
  },
}));
