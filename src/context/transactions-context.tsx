
"use client";

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import type { Transaction, AutoCredit, Lending, Account, PreciousMetal, FixedDeposit, Loan } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { addMonths, isPast, addYears, addQuarters } from 'date-fns';

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
  deleteAutoCredit: (id: string) => void;
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
  deleteInsurance: (policyId: string, policyName: string) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

const initialAutoCredits: AutoCredit[] = [
    { id: '1', name: 'Mutual Fund SIP', amount: 5000, frequency: 'Monthly', nextDate: new Date('2024-08-05').toISOString(), category: 'SIP' },
    { id: '2', name: 'Rent Payment', amount: 15000, frequency: 'Monthly', nextDate: new Date('2024-08-01').toISOString(), category: 'Rent' },
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
  // Note: Insurance is managed via useLocalStorage directly in its page component for now.

  useEffect(() => {
    const processAutoCredits = () => {
      const now = new Date();
      let updatedAutoCredits = [...autoCredits];
      let newTransactions: Transaction[] = [];

      autoCredits.forEach(ac => {
        let nextDueDate = new Date(ac.nextDate);
        while (isPast(nextDueDate)) {
          // Create a transaction for the due payment
          const newTx: Transaction = {
            id: `${ac.id}-${nextDueDate.getTime()}`,
            type: 'expense',
            amount: ac.amount,
            category: ac.category,
            date: nextDueDate,
            paymentMethod: 'Bank', // Assume bank, could be improved
            notes: ac.name,
            accountId: ac.accountId,
          };
          newTransactions.push(newTx);

          // Update the next due date
          switch (ac.frequency) {
            case 'Monthly':
              nextDueDate = addMonths(nextDueDate, 1);
              break;
            case 'Quarterly':
                nextDueDate = addQuarters(nextDueDate, 1);
                break;
            case 'Yearly':
              nextDueDate = addYears(nextDueDate, 1);
              break;
            case 'One-Time':
              // It's a one-time payment, so we mark it as processed by pushing date far in future
              nextDueDate = addYears(now, 100); 
              break;
          }
        }
        
        // Update the auto-credit item with the new nextDate
        const acIndex = updatedAutoCredits.findIndex(item => item.id === ac.id);
        if (acIndex !== -1) {
          updatedAutoCredits[acIndex] = {
            ...updatedAutoCredits[acIndex],
            nextDate: nextDueDate.toISOString()
          };
        }
      });
      
      if (newTransactions.length > 0) {
        // Use a Set to ensure we don't add duplicate transactions if this runs multiple times
        setTransactions(prev => {
            const existingTxIds = new Set(prev.map(tx => tx.id));
            const uniqueNewTxs = newTransactions.filter(tx => !existingTxIds.has(tx.id));
            if (uniqueNewTxs.length === 0) return prev;

            // Adjust balances for new transactions
            setAccounts(prevAccounts => {
              let tempAccounts = [...prevAccounts];
              uniqueNewTxs.forEach(tx => {
                if (tx.accountId) {
                  tempAccounts = tempAccounts.map(account => {
                    if (account.id === tx.accountId) {
                      return { ...account, balance: account.balance - tx.amount };
                    }
                    return account;
                  });
                }
              });
              return tempAccounts;
            });
            
            return [...prev, ...uniqueNewTxs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
        setAutoCredits(updatedAutoCredits);
      }
    };

    processAutoCredits();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on initial load

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

  const deleteAutoCredit = (id: string) => {
    setAutoCredits(prev => prev.filter(ac => ac.id !== id));
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
        category: 'EMI',
        accountId: loanData.accountId,
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
      const loanToDelete = loans.find(loan => loan.id === id);
      if (loanToDelete) {
        // Remove the loan
        setLoans(prev => prev.filter(loan => loan.id !== id));
        // Remove the associated auto-credit for the EMI
        const emiName = `${loanToDelete.name} EMI`;
        setAutoCredits(prev => prev.filter(ac => ac.name !== emiName));
      }
  };

  const deleteInsurance = (policyId: string, policyName: string) => {
    // This function will primarily delete the associated auto-credit.
    // The insurance policy itself is managed in the InsurancePage component's local storage.
    const premiumName = `${policyName} Premium`;
    setAutoCredits(prev => prev.filter(ac => ac.name !== premiumName));
  };


  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, deleteTransaction, accounts, setAccounts, autoCredits, addAutoCredit, deleteAutoCredit, lendings, addLending, updateLendingStatus, deleteLending, bullion, addBullion, deleteBullion, fixedDeposits, addFixedDeposit, deleteFixedDeposit, loans, addLoan, deleteLoan, deleteInsurance }}>
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
