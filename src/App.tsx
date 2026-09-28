import { useState } from 'react';
import { DataProvider, useData } from './data/DataContext';
import { DashboardLayout } from './components/DashboardLayout';
import { Overview } from './pages/Overview';
import { ProductCustomer } from './pages/ProductCustomer';
import { StorePayment } from './pages/StorePayment';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { loading, error } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-500 bg-red-100 p-4 rounded-lg shadow">
          Error loading data: {error}
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && <Overview />}
      {activeTab === 'products' && <ProductCustomer />}
      {activeTab === 'stores' && <StorePayment />}
    </DashboardLayout>
  );
};

function App() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
}

export default App;
