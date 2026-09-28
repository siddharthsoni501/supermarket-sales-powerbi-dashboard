import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Transaction } from '../types';
import { loadData, calculateKPIs } from '../utils/dataProcessor';

export interface FilterState {
  city?: string;
  branch?: string;
  productLine?: string;
  customerType?: string;
  gender?: string;
  payment?: string;
  dateRange?: { start: Date; end: Date };
}

interface DataContextType {
  data: Transaction[];
  filteredData: Transaction[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  loading: boolean;
  error: string | null;
  kpis: ReturnType<typeof calculateKPIs>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<FilterState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(t => {
      if (filters.city && t.city !== filters.city) return false;
      if (filters.branch && t.branch !== filters.branch) return false;
      if (filters.productLine && t.productLine !== filters.productLine) return false;
      if (filters.customerType && t.customerType !== filters.customerType) return false;
      if (filters.gender && t.gender !== filters.gender) return false;
      if (filters.payment && t.payment !== filters.payment) return false;
      if (filters.dateRange) {
        if (t.date < filters.dateRange.start || t.date > filters.dateRange.end) return false;
      }
      return true;
    });
  }, [data, filters]);

  const kpis = useMemo(() => calculateKPIs(filteredData), [filteredData]);

  return (
    <DataContext.Provider value={{ data, filteredData, filters, setFilters, loading, error, kpis }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
