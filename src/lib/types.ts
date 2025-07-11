

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: Date | string; // Allow string for serialization in local storage
  paymentMethod: 'UPI' | 'Cash' | 'Card';
  notes?: string;
};

export type Account = {
  id: string;
  name: string;
  type: 'Bank' | 'Wallet';
  balance: number;
};

export type Loan = {
  id: string;
  name: string;
  principal: number;
  paid: number;
  interestRate: number;
  startDate: Date | string;
  term: number; // in years
};
