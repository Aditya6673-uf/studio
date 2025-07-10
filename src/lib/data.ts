import type { Transaction, Account } from './types';

// This data is used as a fallback for the first load if no user data exists.
// It will be cleared when a new user signs up.
export const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 50000,
    category: 'Freelancing',
    date: new Date('2024-05-01'),
    paymentMethod: 'UPI',
    notes: 'Project Alpha payment'
  },
  {
    id: '2',
    type: 'expense',
    amount: 15000,
    category: 'Rent',
    date: new Date('2024-05-05'),
    paymentMethod: 'Card',
  },
  {
    id: '3',
    type: 'expense',
    amount: 3200,
    category: 'Food',
    date: new Date('2024-05-08'),
    paymentMethod: 'UPI',
    notes: 'Groceries for the week'
  },
  {
    id: '4',
    type: 'expense',
    amount: 5000,
    category: 'EMI',
    date: new Date('2024-05-10'),
    paymentMethod: 'Card',
  },
  {
    id: '5',
    type: 'expense',
    amount: 850,
    category: 'Entertainment',
    date: new Date('2024-05-12'),
    paymentMethod: 'Cash',
    notes: 'Movie tickets'
  },
   // April 2024
  { id: '6', type: 'income', amount: 60000, category: 'Salary', date: new Date('2024-04-30'), paymentMethod: 'UPI' },
  { id: '7', type: 'expense', amount: 15000, category: 'Rent', date: new Date('2024-04-05'), paymentMethod: 'Card' },
  { id: '8', type: 'expense', amount: 4000, category: 'Food', date: new Date('2024-04-10'), paymentMethod: 'UPI' },
  { id: '9', type: 'expense', amount: 1200, category: 'Entertainment', date: new Date('2024-04-15'), paymentMethod: 'UPI', notes: 'Movie night' },
  { id: '10', type: 'expense', amount: 10000, category: 'SIP', date: new Date('2024-04-02'), paymentMethod: 'Card' },

  // March 2024
  { id: '11', type: 'income', amount: 55000, category: 'Salary', date: new Date('2024-03-31'), paymentMethod: 'UPI' },
  { id: '12', type: 'expense', amount: 15000, category: 'Rent', date: new Date('2024-03-05'), paymentMethod: 'Card' },
  { id: '13', type: 'expense', amount: 2500, category: 'Entertainment', date: new Date('2024-03-20'), paymentMethod: 'Card', notes: 'Concert tickets' },
  { id: '14', type: 'expense', amount: 10000, category: 'SIP', date: new Date('2024-03-02'), paymentMethod: 'Card' },

  // Feb 2024
  { id: '15', type: 'income', amount: 55000, category: 'Salary', date: new Date('2024-02-29'), paymentMethod: 'UPI' },
  { id: '16', type: 'expense', amount: 15000, category: 'Rent', date: new Date('2024-02-05'), paymentMethod: 'Card' },
  { id: '17', type: 'expense', amount: 5000, category: 'Entertainment', date: new Date('2024-02-18'), paymentMethod: 'UPI', notes: 'Weekend trip' },
  { id: '18', type: 'expense', amount: 10000, category: 'SIP', date: new Date('2024-02-02'), paymentMethod: 'Card' },
];

export const initialAccounts: Account[] = [
    { id: '1', name: 'HDFC Bank', type: 'Bank', balance: 125000 },
    { id: '2', name: 'PayTM Wallet', type: 'Wallet', balance: 5000 },
    { id: '3', name: 'ICICI Bank', type: 'Bank', balance: 75000 },
];
