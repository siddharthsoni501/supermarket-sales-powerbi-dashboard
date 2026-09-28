import React, { useMemo } from 'react';
import { useData } from '../data/DataContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis
} from 'recharts';

export const ProductCustomer: React.FC = () => {
  const { filteredData } = useData();

  const productData = useMemo(() => {
    const products = filteredData.reduce((acc: any, t) => {
      if (!acc[t.productLine]) acc[t.productLine] = { name: t.productLine, sales: 0, grossIncome: 0, units: 0 };
      acc[t.productLine].sales += t.total;
      acc[t.productLine].grossIncome += t.grossIncome;
      acc[t.productLine].units += t.quantity;
      return acc;
    }, {});
    return Object.values(products).sort((a: any, b: any) => b.sales - a.sales);
  }, [filteredData]);

  const customerData = useMemo(() => {
    const cust = filteredData.reduce((acc: any, t) => {
      if (!acc[t.customerType]) acc[t.customerType] = { name: t.customerType, sales: 0, units: 0 };
      acc[t.customerType].sales += t.total;
      acc[t.customerType].units += t.quantity;
      return acc;
    }, {});
    return Object.values(cust);
  }, [filteredData]);


  const scatterData = useMemo(() => {
    return filteredData.map(t => ({
      quantity: t.quantity,
      total: t.total,
      grossIncome: t.grossIncome,
      productLine: t.productLine
    }));
  }, [filteredData]);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Performance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Product Line Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.2} />
                <XAxis type="number" tick={{fontSize: 12}} stroke="#9ca3af" />
                <YAxis dataKey="name" type="category" tick={{fontSize: 12}} stroke="#9ca3af" />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                />
                <Bar dataKey="sales" name="Sales (₹)" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                <Bar dataKey="grossIncome" name="Gross Income (₹)" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Type */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Customer Segment Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerData} margin={{ top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#9ca3af" />
                <YAxis yAxisId="left" tick={{fontSize: 12}} stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} stroke="#9ca3af" />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                />
                <Bar yAxisId="left" dataKey="sales" name="Sales (₹)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="units" name="Units" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quantity vs Value Scatter */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Transaction Analysis (Qty vs Value)</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis type="number" dataKey="quantity" name="Quantity" unit=" units" stroke="#9ca3af" />
                <YAxis type="number" dataKey="total" name="Total Value" unit="₹" stroke="#9ca3af" />
                <ZAxis type="number" dataKey="grossIncome" range={[60, 400]} name="Gross Income" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                />
                <Scatter name="Transactions" data={scatterData} fill="#ec4899" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
