import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
}
export function InputField({
  label,
  helperText,
  error,
  className = '',
  ...props
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-400">
        {label}
        {props.required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <input
        className={`w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-600/50 focus:border-cyan-600 transition-all ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''} ${className}`}
        {...props} />
      

      {helperText && !error &&
      <p className="text-xs text-slate-600">{helperText}</p>
      }

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>);

}