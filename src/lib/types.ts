
export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: Date | string; // Allow string for serialization in local storage
  paymentMethod: 'UPI' | 'Cash' | 'Card' | 'Bank';
  notes?: string;
  accountId?: string;
};

export type Account = {
  id: string;
  name: string;
  type: 'Bank' | 'Wallet';
  balance: number;
  bankName?: string;
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

export type AutoCredit = {
  id: string;
  name: string;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Yearly' | 'One-Time';
  nextDate: Date | string;
};

export type Insurance = {
  id: string;
  provider: string;
  policyName: string;
  type: 'Health' | 'Life' | 'Vehicle' | 'Other';
  premium: number;
  coverage: number;
  nextDueDate: Date | string;
};

export type RealEstate = {
  id: string;
  name: string;
  type: 'Residential' | 'Commercial' | 'Land';
  location: string;
  currentValue: number;
  purchaseDate: Date | string;
  sellPrice?: number;
  sellDate?: Date | string;
};

export type Lending = {
  id: string;
  personName: string;
  amount: number;
  dateLent: Date | string;
  status: 'Pending' | 'Paid';
  notes?: string;
};

export type PreciousMetal = {
  id: string;
  metal: 'Gold' | 'Silver';
  form: 'Jewelry' | 'Coin' | 'Bar' | 'Digital';
  weightInGrams: number;
  purity: string; // Karats for Gold (e.g., "22K"), Percentage for Silver (e.g., "99.9%")
  purchaseDate: Date | string;
  purchasePrice: number;
};
