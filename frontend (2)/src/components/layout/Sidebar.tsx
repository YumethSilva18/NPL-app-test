import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChartBarIcon,
  ClockIcon,
  Cog6ToothIcon,
  ServerStackIcon
} from '@heroicons/react/24/outline';

export function Sidebar() {
  const location = useLocation();
  const navItems = [
    {
      id: '/',
      label: 'Risk Assessment',
      icon: ChartBarIcon
    },
    {
      id: '/history',
      label: 'History',
      icon: ClockIcon
    },
    {
      id: '/status',
      label: 'System Status',
      icon: ServerStackIcon
    },
    {
      id: '/settings',
      label: 'Settings',
      icon: Cog6ToothIcon
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white">NPL Predictor</h1>
        <p className="text-xs text-slate-500 mt-1">Credit Risk Intelligence</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.id;
          return (
            <Link
              key={item.id}
              to={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xs font-medium">
            BA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Bank Analyst
            </p>
            <p className="text-xs text-slate-500">analyst@bank.com</p>
          </div>
        </div>
      </div>
    </aside>);

}