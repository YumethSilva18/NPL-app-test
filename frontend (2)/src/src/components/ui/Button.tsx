import React, { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-md',
    md: 'px-5 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg'
  };
  const variantStyles = {
    primary:
    'bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white shadow-sm focus:ring-cyan-600',
    secondary:
    'bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-200 border border-slate-600 focus:ring-slate-600',
    ghost:
    'text-slate-400 hover:text-slate-200 hover:bg-slate-800 active:bg-slate-700 focus:ring-slate-600',
    danger:
    'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm focus:ring-red-600'
  };
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}>
      
      {isLoading ?
      <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Processing...
        </> :

      children
      }
    </button>);

}