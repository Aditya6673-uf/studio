
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface SubscriptionContextType {
  isSubscribed: boolean;
  subscribe: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [isSubscribed, setIsSubscribed] = useLocalStorage<boolean>('rupee-route-subscribed', false);

  const subscribe = () => {
    setIsSubscribed(true);
  };

  return (
    <SubscriptionContext.Provider value={{ isSubscribed, subscribe }}>
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
