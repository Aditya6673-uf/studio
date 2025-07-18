
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import type { Transaction, AutoCredit, Lending, Account, PreciousMetal, FixedDeposit, Loan } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { addMonths } from 'date-fns';

type TransactionInput = Omit<Transaction, 'id'>;
type AutoCreditInput = Omit<AutoCredit, 'id'>;
type LendingInput = Omit<Lending, 'id' | 'status'>;
type PreciousMetalInput = Omit<PreciousMetal, 'id'>;
type FixedDepositInput = Omit<FixedDeposit, 'id'>;
type LoanInput = Omit<Loan, 'id'>;


interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: TransactionInput) => void;
  deleteTransaction: (id: string) => void;
  accounts: Account[];
  setAccounts: (value: Account[] | ((val: Account[]) => Account[])) => void;
  autoCredits: AutoCredit[];
  addAutoCredit: (autoCredit: AutoCreditInput) => void;
  addScheduledTransaction: (payload: { transaction: TransactionInput, autoCredit: AutoCreditInput }) => void;
  lendings: Lending[];
  addLending: (lending: LendingInput) => void;
  updateLendingStatus: (id: string, status: 'Paid') => void;
  deleteLending: (id: string) => void;
  bullion: PreciousMetal[];
  addBullion: (bullion: PreciousMetalInput) => void;
  deleteBullion: (id: string) => void;
  fixedDeposits: FixedDeposit[];
  addFixedDeposit: (fd: FixedDepositInput) => void;
  deleteFixedDeposit: (id: string) => void;
  loans: Loan[];
  addLoan: (loan: LoanInput) => void;
  deleteLoan: (id: string) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

const initialAutoCredits: AutoCredit[] = [
    { id: '1', name: 'Mutual Fund SIP', amount: 5000, frequency: 'Monthly', nextDate: new Date('2024-08-05').toISOString() },
    { id: '2', name: 'Rent Payment', amount: 15000, frequency: 'Monthly', nextDate: new Date('2024-08-01').toISOString() },
];

const initialAccounts: Account[] = [
    { id: '1', name: 'HDFC Bank', type: 'Bank', bankName: 'HDFC Bank', balance: 125000 },
    { id: '2', name: 'PayTM Wallet', type: 'Wallet', balance: 5000 },
    { id: '3', name: 'ICICI Bank', type: 'Bank', bankName: 'ICICI Bank', balance: 75000 },
];

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('rupee-route-transactions', []);
  const [accounts, setAccounts] = useLocalStorage<Account[]>('rupee-route-accounts', initialAccounts);
  const [autoCredits, setAutoCredits] = useLocalStorage<AutoCredit[]>('rupee-route-autocredits', initialAutoCredits);
  const [lendings, setLendings] = useLocalStorage<Lending[]>('rupee-route-lendings', []);
  const [bullion, setBullion] = useLocalStorage<PreciousMetal[]>('rupee-route-bullion', []);
  const [fixedDeposits, setFixedDeposits] = useLocalStorage<FixedDeposit[]>('rupee-route-fixed-deposits', []);
  const [loans, setLoans] = useLocalStorage<Loan[]>('rupee-route-loans', []);

  const addTransaction = (transaction: TransactionInput) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().getTime().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // Adjust account balance if an account is linked
    if (transaction.accountId) {
      setAccounts(prevAccounts =>
        prevAccounts.map(account => {
          if (account.id === transaction.accountId) {
            const newBalance = transaction.type === 'income'
              ? account.balance + transaction.amount
              : account.balance - transaction.amount;
            return { ...account, balance: newBalance };
          }
          return account;
        })
      );
    }
  };

  const deleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (!transactionToDelete) return;
    
    // Revert account balance if an account was linked
    if (transactionToDelete.accountId) {
        setAccounts(prevAccounts =>
            prevAccounts.map(account => {
                if (account.id === transactionToDelete.accountId) {
                    const newBalance = transactionToDelete.type === 'income'
                        ? account.balance - transactionToDelete.amount
                        : account.balance + transactionToDelete.amount;
                    return { ...account, balance: newBalance };
                }
                return account;
            })
        );
    }

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
  
  const deleteLending = (id: string) => {
    setLendings(prev => prev.filter(l => l.id !== id));
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
  
  const addBullion = (bullionData: PreciousMetalInput) => {
    const newBullion: PreciousMetal = {
      ...bullionData,
      id: new Date().getTime().toString(),
    };
    setBullion(prev => [...prev, newBullion]);

    addTransaction({
      type: 'expense',
      amount: bullionData.purchasePrice,
      category: 'Investment',
      date: bullionData.purchaseDate,
      paymentMethod: 'Bank',
      notes: `${bullionData.metal} Purchase: ${bullionData.weightInGrams}g ${bullionData.form}`,
    });
  };

  const deleteBullion = (id: string) => {
    setBullion(prev => prev.filter(g => g.id !== id));
  };

  const addFixedDeposit = (fdData: FixedDepositInput) => {
    const newFd: FixedDeposit = {
      ...fdData,
      id: new Date().getTime().toString(),
    };
    setFixedDeposits(prev => [...prev, newFd]);
    addTransaction({
      type: 'expense',
      amount: fdData.principal,
      category: 'Investment',
      date: fdData.startDate,
      paymentMethod: 'Bank',
      notes: `FD with ${fdData.bankName}`,
    });
  };

  const deleteFixedDeposit = (id: string) => {
    setFixedDeposits(prev => prev.filter(fd => fd.id !== id));
  };

  const addLoan = (loanData: LoanInput) => {
    const newLoan: Loan = {
      ...loanData,
      id: new Date().getTime().toString(),
    };
    setLoans(prev => [...prev, newLoan]);

    // Schedule the recurring EMI payment
    addAutoCredit({
        name: `${loanData.name} EMI`,
        amount: loanData.emi,
        frequency: 'Monthly',
        nextDate: addMonths(new Date(loanData.startDate), 1),
    });

    // Also record the loan amount as an income transaction
    addTransaction({
        type: 'income',
        amount: loanData.principal,
        category: 'Loan',
        date: loanData.startDate,
        paymentMethod: 'Bank',
        notes: `Loan taken: ${loanData.name}`,
        accountId: loanData.accountId,
    });
  };

  const deleteLoan = (id: string) => {
      setLoans(prev => prev.filter(loan => loan.id !== id));
      // Optionally, find and remove the associated auto-credit EMI payment
  };

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, deleteTransaction, accounts, setAccounts, autoCredits, addAutoCredit, addScheduledTransaction, lendings, addLending, updateLendingStatus, deleteLending, bullion, addBullion, deleteBullion, fixedDeposits, addFixedDeposit, deleteFixedDeposit, loans, addLoan, deleteLoan }}>
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
