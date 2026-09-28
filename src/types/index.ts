export interface Transaction {
  id: string; // Invoice ID
  branch: string;
  city: string;
  customerType: string;
  gender: string;
  productLine: string;
  unitPrice: number;
  quantity: number;
  tax: number; // Tax 5%
  total: number;
  date: Date;
  time: string;
  payment: string;
  cogs: number;
  grossMarginPercentage: number;
  grossIncome: number;
  rating: number;
  hour: number;
  month: string;
  monthNo: number;
}
