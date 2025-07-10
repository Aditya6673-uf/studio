
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
