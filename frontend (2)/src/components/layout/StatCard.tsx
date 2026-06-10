import React, { ReactNode } from 'react';
import { Card, CardContent } from '../ui/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}
export function StatCard({
  label,
  value,
  icon,
  variant = 'default',
  trend
}: StatCardProps) {
  const variantStyles = {
    default: 'text-cyan-400',
    success: 'text-green-400',
    warning: 'text-amber-400',
    error: 'text-red-400'
  };
  return (
    <Card className="hover:border-slate-600 transition-colors">
      <CardContent className="py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              {label}
            </p>
            <p
              className={`text-2xl font-bold tabular-nums ${variantStyles[variant]}`}>
              
              {value}
            </p>
            {trend &&
            <div className="flex items-center gap-1 mt-2">
                <span
                className={`text-xs ${trend.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                
                  {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}
                  %
                </span>
                <span className="text-xs text-slate-600">vs last period</span>
              </div>
            }
          </div>
          {icon &&
          <div className={`text-2xl ${variantStyles[variant]} opacity-40`}>
              {icon}
            </div>
          }
        </div>
      </CardContent>
    </Card>);

}