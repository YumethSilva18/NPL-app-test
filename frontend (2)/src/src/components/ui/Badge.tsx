import React, { ReactNode } from 'react';
import type { RiskLevel } from '../../types/prediction';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}
export function Badge({
  children,
  variant = 'info',
  className = ''
}: BadgeProps) {
  const variantStyles = {
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${variantStyles[variant]} ${className}`}>
      
      {children}
    </span>);

}
interface RiskBadgeProps {
  riskLevel: RiskLevel;
  className?: string;
}
export function RiskBadge({ riskLevel, className = '' }: RiskBadgeProps) {
  const variantMap: Record<RiskLevel, 'success' | 'warning' | 'error'> = {
    Low: 'success',
    Medium: 'warning',
    High: 'error'
  };
  return (
    <Badge variant={variantMap[riskLevel]} className={className}>
      {riskLevel} Risk
    </Badge>);

}