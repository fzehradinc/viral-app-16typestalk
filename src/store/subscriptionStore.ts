import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';
import type {PurchasesPackage, CustomerInfo} from 'react-native-purchases';
import * as purchaseService from '../services/purchaseService';
import type {SubscriptionPlan} from '../types';

const USAGE_KEY = '@noorbloom/usageToday';
const USAGE_DATE_KEY = '@noorbloom/lastUsageDate';
const PLAN_KEY = '@noorbloom/subscriptionPlan';
const FREE_DAILY_LIMIT = 5;

interface SubscriptionState {
  currentPlan: SubscriptionPlan;
  isPro: boolean;
  usageToday: number;
  lastUsageDate: string;
  remainingUses: number;
  packages: PurchasesPackage[];
  isLoadingPackages: boolean;
  isPurchasing: boolean;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  lastError: string | null;
  incrementUsage: () => Promise<void>;
  canUseFeature: () => boolean;
  setPlan: (plan: SubscriptionPlan) => Promise<void>;
  resetDailyUsageIfNeeded: () => Promise<void>;
  hydrate: () => Promise<void>;
  initialize: (userId?: string) => Promise<void>;
  fetchCustomerInfo: () => Promise<void>;
  fetchPackages: () => Promise<void>;
  purchasePlan: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<void>;
}

function todayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function computeIsPro(plan: SubscriptionPlan): boolean {
  return plan === 'monthly' || plan === 'yearly';
}

function computeRemaining(plan: SubscriptionPlan, usage: number): number {
  if (computeIsPro(plan)) {
    return Infinity;
  }
  return Math.max(0, FREE_DAILY_LIMIT - usage);
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  currentPlan: 'free',
  isPro: false,
  usageToday: 0,
  lastUsageDate: todayString(),
  remainingUses: FREE_DAILY_LIMIT,
  packages: [],
  isLoadingPackages: false,
  isPurchasing: false,
  isLoading: false,
  customerInfo: null,
  lastError: null,

  incrementUsage: async () => {
    const state = get();
    if (state.isPro) {
      return;
    }
    if (state.usageToday >= FREE_DAILY_LIMIT) {
      return;
    }
    const newUsage = state.usageToday + 1;
    set({
      usageToday: newUsage,
      remainingUses: computeRemaining(state.currentPlan, newUsage),
    });
    await AsyncStorage.setItem(USAGE_KEY, String(newUsage));
  },

  canUseFeature: () => {
    const state = get();
    if (state.isPro) {
      return true;
    }
    state.resetDailyUsageIfNeeded();
    return state.usageToday < FREE_DAILY_LIMIT;
  },

  setPlan: async (plan: SubscriptionPlan) => {
    const state = get();
    set({
      currentPlan: plan,
      isPro: computeIsPro(plan),
      remainingUses: computeRemaining(plan, state.usageToday),
    });
    await AsyncStorage.setItem(PLAN_KEY, plan);
  },

  resetDailyUsageIfNeeded: async () => {
    const today = todayString();
    const state = get();
    if (state.lastUsageDate !== today) {
      set({
        usageToday: 0,
        lastUsageDate: today,
        remainingUses: computeRemaining(state.currentPlan, 0),
      });
      await AsyncStorage.setItem(USAGE_KEY, '0');
      await AsyncStorage.setItem(USAGE_DATE_KEY, today);
    }
  },

  hydrate: async () => {
    const [storedPlan, storedUsage, storedDate] = await Promise.all([
      AsyncStorage.getItem(PLAN_KEY),
      AsyncStorage.getItem(USAGE_KEY),
      AsyncStorage.getItem(USAGE_DATE_KEY),
    ]);

    const plan: SubscriptionPlan =
      storedPlan === 'monthly' || storedPlan === 'yearly'
        ? storedPlan
        : 'free';

    const today = todayString();
    const isToday = storedDate === today;
    const usage = isToday && storedUsage ? parseInt(storedUsage, 10) : 0;

    set({
      currentPlan: plan,
      isPro: computeIsPro(plan),
      usageToday: usage,
      lastUsageDate: today,
      remainingUses: computeRemaining(plan, usage),
    });

    if (!isToday) {
      await AsyncStorage.setItem(USAGE_KEY, '0');
      await AsyncStorage.setItem(USAGE_DATE_KEY, today);
    }
  },

  initialize: async (userId?: string) => {
    try {
      purchaseService.configure(userId);
      await get().fetchCustomerInfo();
      await get().fetchPackages();
    } catch {
      // RevenueCat unavailable — keep local state
    }
  },

  fetchCustomerInfo: async () => {
    try {
      const info = await purchaseService.getCustomerInfo();
      const plan = purchaseService.checkEntitlement(info);
      set({
        customerInfo: info,
        currentPlan: plan,
        isPro: computeIsPro(plan),
        remainingUses: computeRemaining(plan, get().usageToday),
      });
      await AsyncStorage.setItem(PLAN_KEY, plan);
      await get().resetDailyUsageIfNeeded();
    } catch {
      // Keep local cached plan
    }
  },

  fetchPackages: async () => {
    try {
      set({isLoadingPackages: true});
      const pkgs = await purchaseService.getOfferings();
      set({packages: pkgs, isLoadingPackages: false});
    } catch {
      set({isLoadingPackages: false});
    }
  },

  purchasePlan: async (pkg: PurchasesPackage) => {
    set({isPurchasing: true, lastError: null});
    try {
      const info = await purchaseService.purchasePackage(pkg);
      const plan = purchaseService.checkEntitlement(info);
      set({
        customerInfo: info,
        currentPlan: plan,
        isPro: computeIsPro(plan),
        remainingUses: computeRemaining(plan, get().usageToday),
        isPurchasing: false,
      });
      await AsyncStorage.setItem(PLAN_KEY, plan);
      return true;
    } catch (e: unknown) {
      if (e instanceof Object && 'userCancelled' in e && (e as {userCancelled: boolean}).userCancelled) {
        set({isPurchasing: false});
        return false;
      }
      set({
        lastError: 'subscription.purchaseError',
        isPurchasing: false,
      });
      return false;
    }
  },

  restorePurchases: async () => {
    set({isLoading: true, lastError: null});
    try {
      const info = await purchaseService.restorePurchases();
      const plan = purchaseService.checkEntitlement(info);
      set({
        customerInfo: info,
        currentPlan: plan,
        isPro: computeIsPro(plan),
        remainingUses: computeRemaining(plan, get().usageToday),
        isLoading: false,
      });
      await AsyncStorage.setItem(PLAN_KEY, plan);
    } catch {
      set({isLoading: false});
    }
  },
}));

/**
 * subscriptionStore tasarım kararları:
 * 1. FREE_DAILY_LIMIT = 5: Swift SubscriptionManager ile aynı sabit.
 * 2. isPro türetilmiş değer — monthly veya yearly ise true.
 * 3. hydrate() uygulama başlangıcında lokal cache'i yükler.
 * 4. initialize() RevenueCat'i yapılandırır ve sunucu durumunu senkronlar.
 * 5. canUseFeature() senkron boolean döner → UI'da anlık kontrol.
 * 6. purchasePlan() user cancel durumunda lastError set etmez.
 */
