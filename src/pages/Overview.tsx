import React, { useMemo } from 'react';
import { useData } from '../data/DataContext';
import { KPICard } from '../components/KPICard';
import { IndianRupee, TrendingUp, ShoppingCart, Users, Star, Receipt } from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, Cell, PieChart as RechartsPieChart, Pie
} from 'recharts';
import { format } from 'date-fns';

export const Overview: React.FC = () => {
  const { filteredData, kpis } = useData();

  // Prepare data for Sales Trend (Line/Area Chart)
  const salesTrendData = useMemo(() => {
    const daily = filteredData.reduce((acc: any, t) => {
      const dateStr = format(t.date, 'yyyy-MM-dd');
      if (!acc[dateStr]) acc[dateStr] = { date: dateStr, sales: 0, grossIncome: 0, transactions: 0 };
      acc[dateStr].sales += t.total;
      acc[dateStr].grossIncome += t.grossIncome;
      acc[dateStr].transactions += 1;
      return acc;
    }, {});
    return Object.values(daily).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [filteredData]);

  // Prepare data for Sales by City
  const cityData = useMemo(() => {
    const cities = filteredData.reduce((acc: any, t) => {
      if (!acc[t.city]) acc[t.city] = { city: t.city, sales: 0 };
      acc[t.city].sales += t.total;
      return acc;
    }, {});
    return Object.values(cities).sort((a: any, b: any) => b.sales - a.sales);
  }, [filteredData]);

  // Prepare data for Product Line
  const productLineData = useMemo(() => {
    const products = filteredData.reduce((acc: any, t) => {
      if (!acc[t.productLine]) acc[t.productLine] = { productLine: t.productLine, sales: 0 };
      acc[t.productLine].sales += t.total;
      return acc;
    }, {});
    return Object.values(products).sort((a: any, b: any) => b.sales - a.sales);
  }, [filteredData]);

  // Prepare data for Payment Method
  const paymentData = useMemo(() => {
    const payments = filteredData.reduce((acc: any, t) => {
      if (!acc[t.payment]) acc[t.payment] = { name: t.payment, value: 0 };
      acc[t.payment].value += t.total;
      return acc;
    }, {});
    return Object.values(payments);
  }, [filteredData]);

  const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Top KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard title="Total Sales" value={kpis.totalSales.toLocaleString('en-IN', { maximumFractionDigits: 2 })} prefix="₹" icon={<IndianRupee />} />
        <KPICard title="Gross Income" value={kpis.grossIncome.toLocaleString('en-IN', { maximumFractionDigits: 2 })} prefix="₹" icon={<TrendingUp />} />
        <KPICard title="Units Sold" value={kpis.unitsSold.toLocaleString()} icon={<ShoppingCart />} />
        <KPICard title="Transactions" value={kpis.transactions.toLocaleString()} icon={<Receipt />} />
        <KPICard title="Avg Rating" value={kpis.avgRating.toFixed(2)} suffix="/10" icon={<Star className="text-yellow-400" />} />
        <KPICard title="Avg Bill" value={kpis.avgBill.toLocaleString('en-IN', { maximumFractionDigits: 2 })} prefix="₹" icon={<Users />} />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Sales Trend Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#9ca3af" />
                <YAxis tick={{fontSize: 12}} stroke="#9ca3af" tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                  formatter={(value: any, name: any) => [`₹${Number(value).toFixed(2)}`, name]}
                />
                <Area type="monotone" dataKey="sales" name="Sales" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by City */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Sales by City</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" opacity={0.2} />
                <XAxis type="number" tick={{fontSize: 12}} stroke="#9ca3af" />
                <YAxis dataKey="city" type="category" tick={{fontSize: 12}} stroke="#9ca3af" width={80} />
                <RechartsTooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                  formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                  {cityData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Line */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Sales by Product Line</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productLineData} margin={{ bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="productLine" tick={{fontSize: 12}} stroke="#9ca3af" angle={-45} textAnchor="end" />
                <YAxis tick={{fontSize: 12}} stroke="#9ca3af" tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                <RechartsTooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                  formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {productLineData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Payment Methods</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={paymentData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                  formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Sales']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4 text-sm text-gray-600 dark:text-gray-300">
              {paymentData.map((entry: any, idx) => (
                <div key={entry.name} className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
