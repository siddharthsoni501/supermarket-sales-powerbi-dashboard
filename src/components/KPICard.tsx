import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  prefix?: string;
  suffix?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, icon, subtitle, prefix = '', suffix = '' }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        {icon && <div className="text-blue-500 dark:text-blue-400">{icon}</div>}
      </div>
      <div className="mt-4 flex items-baseline text-3xl font-semibold text-gray-900 dark:text-white">
        {prefix}{value}{suffix}
      </div>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
    </div>
  );
};
