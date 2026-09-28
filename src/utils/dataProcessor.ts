import * as XLSX from 'xlsx';
import type { Transaction } from '../types';

export const loadData = async (): Promise<Transaction[]> => {
  const response = await fetch('/data.xlsx');
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
  
  const sheetName = 'Cleaned Data';
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Sheet ${sheetName} not found`);
  }

  // The actual headers are on row 3 (0-indexed 2), so we skip first 2 rows
  const rawData = XLSX.utils.sheet_to_json(sheet, { range: 2, raw: false, dateNF: 'yyyy-mm-dd' }) as any[];

  return rawData.map((row: any) => ({
    id: row['Invoice ID'],
    branch: row['Branch'],
    city: row['City'],
    customerType: row['Customer type'],
    gender: row['Gender'],
    productLine: row['Product line'],
    unitPrice: parseFloat(row['Unit price']),
    quantity: parseInt(row['Quantity'], 10),
    tax: parseFloat(row['Tax 5%']),
    total: parseFloat(row['Total']),
    date: new Date(row['Date']),
    time: row['Time'],
    payment: row['Payment'],
    cogs: parseFloat(row['cogs']),
    grossMarginPercentage: parseFloat(row['gross margin percentage']),
    grossIncome: parseFloat(row['gross income']),
    rating: parseFloat(row['Rating']),
    hour: parseInt(row['Hour'], 10),
    month: row['Month'],
    monthNo: parseInt(row['Month No'], 10)
  })).filter(t => t.id); // Filter out any empty rows
};

// Add calculated metrics helpers
export const calculateKPIs = (data: Transaction[]) => {
  const totalSales = data.reduce((sum, t) => sum + t.total, 0);
  const grossIncome = data.reduce((sum, t) => sum + t.grossIncome, 0);
  const unitsSold = data.reduce((sum, t) => sum + t.quantity, 0);
  
  const uniqueInvoices = new Set(data.map(t => t.id));
  const transactions = uniqueInvoices.size;
  
  const avgRating = data.reduce((sum, t) => sum + t.rating, 0) / data.length;
  const avgBill = transactions > 0 ? totalSales / transactions : 0;
  const grossIncomeMargin = totalSales > 0 ? grossIncome / totalSales : 0;

  return {
    totalSales,
    grossIncome,
    unitsSold,
    transactions,
    avgRating,
    avgBill,
    grossIncomeMargin
  };
};
