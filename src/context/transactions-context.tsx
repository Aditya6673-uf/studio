
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import type { Transaction, Holding, MutualFund, AutoCredit } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { initialTransactions } from '@/lib/data';

type TransactionInput = Omit<Transaction, 'id'>;
type AutoCreditInput = Omit<AutoCredit, 'id'>;


interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: TransactionInput) => void;
  deleteTransaction: (id: string) => void;
  holdings: Holding[];
  addHolding: (amount: number, fund: MutualFund) => void;
  autoCredits: AutoCredit[];
  addAutoCredit: (autoCredit: AutoCreditInput) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

const initialAutoCredits: AutoCredit[] = [
    { id: '1', name: 'Mutual Fund SIP', amount: 5000, frequency: 'Monthly', nextDate: new Date('2024-08-05').toISOString() },
    { id: '2', name: 'Rent Payment', amount: 15000, frequency: 'Monthly', nextDate: new Date('2024-08-01').toISOString() },
];

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('rupee-route-transactions', []);
  const [holdings, setHoldings] = useLocalStorage<Holding[]>('rupee-route-holdings', []);
  const [autoCredits, setAutoCredits] = useLocalStorage<AutoCredit[]>('rupee-route-autocredits', initialAutoCredits);

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

  const addAutoCredit = (autoCreditData: AutoCreditInput) => {
    const newAutoCredit: AutoCredit = {
        ...autoCreditData,
        id: new Date().getTime().toString(),
        nextDate: autoCreditData.nextDate instanceof Date ? autoCreditData.nextDate.toISOString() : autoCreditData.nextDate,
    };
    setAutoCredits(prev => [...prev, newAutoCredit]);
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, deleteTransaction, holdings, addHolding, autoCredits, addAutoCredit }}>
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
