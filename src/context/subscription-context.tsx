
"use client";

import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { addMonths, isFuture } from 'date-fns';
import type { SubscriptionInfo } from '@/lib/types';

interface SubscriptionContextType {
  isSubscribed: boolean;
  subscriptionInfo: (SubscriptionInfo & { endDate: string | null }) | null;
  subscribe: (details: { planName: string; durationInMonths: number }) => void;
  cancelSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useLocalStorage<SubscriptionInfo | null>('rupee-route-subscription', null);

  const subscribe = ({ planName, durationInMonths }: { planName: string, durationInMonths: number }) => {
    const startDate = new Date();
    setSubscription({ planName, startDate: startDate.toISOString() });
  };
  
  const cancelSubscription = () => {
    setSubscription(null);
  };

  const { isSubscribed, subscriptionInfo } = useMemo(() => {
    if (!subscription) {
      return { isSubscribed: false, subscriptionInfo: null };
    }

    const planDetails = {
        "Pro Monthly": 1,
        "Pro Semi-Annual": 6,
        "Pro Annual": 12,
    }[subscription.planName];

    if (!planDetails) {
      // It's the 'Free' plan or something unexpected
      return { isSubscribed: false, subscriptionInfo: null };
    }

    const startDate = new Date(subscription.startDate);
    const endDate = addMonths(startDate, planDetails);

    if (isFuture(endDate)) {
        return {
            isSubscribed: true,
            subscriptionInfo: { ...subscription, endDate: endDate.toISOString() }
        };
    }

    return { isSubscribed: false, subscriptionInfo: null };
  }, [subscription]);


  return (
    <SubscriptionContext.Provider value={{ isSubscribed, subscriptionInfo, subscribe, cancelSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
