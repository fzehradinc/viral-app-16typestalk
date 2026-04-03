/**
 * RevenueCat purchase service — iOS StoreKit + Android Play Billing tek API.
 */

import {Platform} from 'react-native';
import Purchases, {LOG_LEVEL} from 'react-native-purchases';
import type {PurchasesPackage, CustomerInfo} from 'react-native-purchases';
import {ENV} from '../config/env';
import type {SubscriptionPlan} from '../types';

export const ENTITLEMENT_ID = 'pro';
export const MONTHLY_PRODUCT_ID = 'noorbloom_monthly';
export const YEARLY_PRODUCT_ID = 'noorbloom_yearly';

export function configure(userId?: string): void {
  const apiKey =
    Platform.OS === 'ios'
      ? ENV.REVENUECAT_IOS_KEY
      : ENV.REVENUECAT_ANDROID_KEY;

  Purchases.configure({apiKey});

  if (userId) {
    Purchases.logIn(userId);
  }

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
}

export async function getOfferings(): Promise<PurchasesPackage[]> {
  const offerings = await Purchases.getOfferings();
  return offerings.current?.availablePackages ?? [];
}

export async function purchasePackage(
  pkg: PurchasesPackage,
): Promise<CustomerInfo> {
  const {customerInfo} = await Purchases.purchasePackage(pkg);
  return customerInfo;
}

export async function restorePurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}

export async function logIn(userId: string): Promise<void> {
  await Purchases.logIn(userId);
}

export async function logOut(): Promise<void> {
  await Purchases.logOut();
}

export function checkEntitlement(
  customerInfo: CustomerInfo,
): SubscriptionPlan {
  const entitlements = customerInfo.entitlements.active;
  const proEntitlement = entitlements[ENTITLEMENT_ID];

  if (!proEntitlement) {
    return 'free';
  }

  const productId = proEntitlement.productIdentifier;
  if (productId.includes('yearly')) {
    return 'yearly';
  }
  if (productId.includes('monthly')) {
    return 'monthly';
  }

  // Güvenli fallback
  return 'monthly';
}
