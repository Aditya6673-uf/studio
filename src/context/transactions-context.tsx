
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import type { Transaction, Holding, MutualFund } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { initialTransactions } from '@/lib/data';

type TransactionInput = Omit<Transaction, 'id'>;

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: TransactionInput) => void;
  deleteTransaction: (id: string) => void;
  holdings: Holding[];
  addHolding: (amount: number, fund: MutualFund) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('rupee-route-transactions', []);
  const [holdings, setHoldings] = useLocalStorage<Holding[]>('rupee-route-holdings', []);

  const addTransaction = (transaction: TransactionInput) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().getTime().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const addHolding = (amount: number, fund: MutualFund) => {
    const units = amount / fund.nav;
    setHoldings(prev => {
        const existingHoldingIndex = prev.findIndex(h => h.fundId === fund.id);
        if (existingHoldingIndex > -1) {
            const updatedHoldings = [...prev];
            updatedHoldings[existingHoldingIndex] = {
                ...updatedHoldings[existingHoldingIndex],
                units: updatedHoldings[existingHoldingIndex].units + units,
                totalInvested: updatedHoldings[existingHoldingIndex].totalInvested + amount,
            };
            return updatedHoldings;
        } else {
            const newHolding: Holding = {
                fundId: fund.id,
                units: units,
                totalInvested: amount,
            };
            return [...prev, newHolding];
        }
    });
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, deleteTransaction, holdings, addHolding }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};
