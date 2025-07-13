

"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import type { Transaction, AutoCredit, Lending } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { initialTransactions } from '@/lib/data';

type TransactionInput = Omit<Transaction, 'id'>;
type AutoCreditInput = Omit<AutoCredit, 'id'>;
type LendingInput = Omit<Lending, 'id' | 'status'>;


interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: TransactionInput) => void;
  deleteTransaction: (id: string) => void;
  autoCredits: AutoCredit[];
  addAutoCredit: (autoCredit: AutoCreditInput) => void;
  addScheduledTransaction: (payload: { transaction: TransactionInput, autoCredit: AutoCreditInput }) => void;
  lendings: Lending[];
  addLending: (lending: LendingInput) => void;
  updateLendingStatus: (id: string, status: 'Paid') => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

const initialAutoCredits: AutoCredit[] = [
    { id: '1', name: 'Mutual Fund SIP', amount: 5000, frequency: 'Monthly', nextDate: new Date('2024-08-05').toISOString() },
    { id: '2', name: 'Rent Payment', amount: 15000, frequency: 'Monthly', nextDate: new Date('2024-08-01').toISOString() },
];

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('rupee-route-transactions', []);
  const [autoCredits, setAutoCredits] = useLocalStorage<AutoCredit[]>('rupee-route-autocredits', initialAutoCredits);
  const [lendings, setLendings] = useLocalStorage<Lending[]>('rupee-route-lendings', []);

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
  
  const addAutoCredit = (autoCreditData: AutoCreditInput) => {
    const newAutoCredit: AutoCredit = {
        ...autoCreditData,
        id: new Date().getTime().toString(),
        nextDate: autoCreditData.nextDate instanceof Date ? autoCreditData.nextDate.toISOString() : autoCreditData.nextDate,
    };
    setAutoCredits(prev => [...prev, newAutoCredit]);
  };

  const addScheduledTransaction = ({ transaction, autoCredit }: { transaction: TransactionInput, autoCredit: AutoCreditInput }) => {
    addTransaction(transaction);
    addAutoCredit(autoCredit);
  };

  const addLending = (lendingData: LendingInput) => {
    const newLending: Lending = {
      ...lendingData,
      id: new Date().getTime().toString(),
      status: 'Pending',
    };
    setLendings(prev => [newLending, ...prev]);

    // Create a corresponding expense transaction
    addTransaction({
      type: 'expense',
      amount: lendingData.amount,
      category: 'Lending',
      date: lendingData.dateLent,
      paymentMethod: 'UPI', // Default or could be part of form
      notes: `Lent to ${lendingData.personName}${lendingData.notes ? `: ${lendingData.notes}` : ''}`,
    });
  };

  const updateLendingStatus = (id: string, status: 'Paid') => {
    let lendingToUpdate: Lending | undefined;
    setLendings(prev =>
      prev.map(l => {
        if (l.id === id) {
          lendingToUpdate = { ...l, status };
          return lendingToUpdate;
        }
        return l;
      })
    );

    if (lendingToUpdate && status === 'Paid') {
      addTransaction({
        type: 'income',
        amount: lendingToUpdate.amount,
        category: 'Lending Repaid',
        date: new Date(),
        paymentMethod: 'UPI',
        notes: `Repayment from ${lendingToUpdate.personName}`,
      });
    }
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, deleteTransaction, autoCredits, addAutoCredit, addScheduledTransaction, lendings, addLending, updateLendingStatus }}>
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
