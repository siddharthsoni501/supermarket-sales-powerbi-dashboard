import React, { useMemo } from 'react';
import { useData } from '../data/DataContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart
} from 'recharts';

export const StorePayment: React.FC = () => {
  const { filteredData } = useData();

  const branchData = useMemo(() => {
    const branches = filteredData.reduce((acc: any, t) => {
      if (!acc[t.branch]) acc[t.branch] = { name: t.branch, sales: 0, units: 0 };
      acc[t.branch].sales += t.total;
      acc[t.branch].units += t.quantity;
      return acc;
    }, {});
    return Object.values(branches).sort((a: any, b: any) => a.name.localeCompare(b.name));
  }, [filteredData]);

  const hourlyData = useMemo(() => {
    const hours = filteredData.reduce((acc: any, t) => {
      const hour = t.hour;
      if (!acc[hour]) acc[hour] = { hour: `${hour}:00`, sales: 0, transactions: 0 };
      acc[hour].sales += t.total;
      acc[hour].transactions += 1;
      return acc;
    }, {});
    return Object.values(hours).sort((a: any, b: any) => parseInt(a.hour) - parseInt(b.hour));
  }, [filteredData]);

  const cityTableData = useMemo(() => {
    const cities = filteredData.reduce((acc: any, t) => {
      if (!acc[t.city]) acc[t.city] = { city: t.city, sales: 0, grossIncome: 0, units: 0, transactions: 0, rating: 0 };
      acc[t.city].sales += t.total;
      acc[t.city].grossIncome += t.grossIncome;
      acc[t.city].units += t.quantity;
      acc[t.city].transactions += 1;
      acc[t.city].rating += t.rating;
      return acc;
    }, {});
    return Object.values(cities).map((c: any) => ({
      ...c,
      rating: c.rating / c.transactions
    })).sort((a: any, b: any) => b.sales - a.sales);
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* City Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">City Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">City</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sales (₹)</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gross Income</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transactions</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Units</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Avg Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {cityTableData.map((row: any) => (
                <tr key={row.city} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{row.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-300">{row.sales.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-300">{row.grossIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-300">{row.transactions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-300">{row.units}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-300">{row.rating.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch Performance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Branch Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData} margin={{ top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#9ca3af" />
                <YAxis tick={{fontSize: 12}} stroke="#9ca3af" tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                />
                <Bar dataKey="sales" name="Sales (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Trend */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Sales by Hour</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={hourlyData} margin={{ top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="hour" tick={{fontSize: 12}} stroke="#9ca3af" />
                <YAxis yAxisId="left" tick={{fontSize: 12}} stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                />
                <Bar yAxisId="left" dataKey="sales" name="Sales (₹)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="transactions" name="Transactions" stroke="#f59e0b" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
