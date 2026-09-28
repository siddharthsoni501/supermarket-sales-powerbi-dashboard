import React, { useState } from 'react';
import { Sun, Moon, BarChart3, Users, Store, Filter } from 'lucide-react';
import { useData } from '../data/DataContext';

interface Props {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DashboardLayout: React.FC<Props> = ({ children, activeTab, setActiveTab }) => {
  const [darkMode, setDarkMode] = useState(false);
  const { setFilters } = useData();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'products', name: 'Products & Customers', icon: Users },
    { id: 'stores', name: 'Stores & Payments', icon: Store },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <BarChart3 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                    Supermarket Analytics
                  </span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-primary-500 text-gray-900 dark:text-white'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setFilters({})}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Reset Filters
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Supermarket Sales Analytics | Business Intelligence Project | Siddharth Soni
          </div>
        </footer>
      </div>
    </div>
  );
};
