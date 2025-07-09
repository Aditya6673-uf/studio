import type { Transaction, Account } from './types';

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
];

export const initialAccounts: Account[] = [
    { id: '1', name: 'HDFC Bank', type: 'Bank', balance: 125000 },
    { id: '2', name: 'PayTM Wallet', type: 'Wallet', balance: 5000 },
    { id: '3', name: 'ICICI Bank', type: 'Bank', balance: 75000 },
];
