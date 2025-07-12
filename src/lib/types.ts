

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

export type AutoCredit = {
  id: string;
  name: string;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Yearly' | 'One-Time';
  nextDate: Date | string;
};

export type MutualFund = {
    id: string;
    name: string;
    category: 'Equity' | 'Debt' | 'Hybrid';
    nav: number;
    returns: {
        oneYear: number;
        threeYear: number;
        fiveYear: number;
    };
    risk: 'Low' | 'Moderate' | 'High' | 'Very High';
    upiId?: string;
};

export type Holding = {
    fundId: string;
    units: number;
    totalInvested: number;
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
};

export type SubscriptionInfo = {
  planName: string;
  startDate: string; // ISO string
};

export type Plan = {
  name: string;
  price: string;
  period: string;
  durationInMonths: number | null;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline";
  isPopular: boolean;
};
