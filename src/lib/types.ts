export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: Date;
  paymentMethod: 'UPI' | 'Cash' | 'Card';
  notes?: string;
};

export type Account = {
  id: string;
  name: string;
  type: 'Bank' | 'Wallet';
  balance: number;
};
