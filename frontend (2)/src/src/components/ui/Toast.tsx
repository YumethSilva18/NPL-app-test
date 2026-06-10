import React, { useEffect, useState } from 'react';
export type ToastType = 'success' | 'error' | 'info';
interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}
export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  const styles = {
    success: 'bg-green-900/90 border-green-700 text-green-100',
    error: 'bg-red-900/90 border-red-700 text-red-100',
    info: 'bg-cyan-900/90 border-cyan-700 text-cyan-100'
  };
  const icons = {
    success:
    <svg
      className="w-5 h-5 text-green-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      
      </svg>,

    error:
    <svg
      className="w-5 h-5 text-red-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      
      </svg>,

    info:
    <svg
      className="w-5 h-5 text-cyan-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      
      </svg>

  };
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm ${styles[type]} shadow-lg`}>
      
      {icons[type]}
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-current opacity-70 hover:opacity-100 transition-opacity">
        
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12" />
          
        </svg>
      </button>
    </div>);

}
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: ToastType;
  }>;
  onRemove: (id: string) => void;
}
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) =>
      <Toast
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={() => onRemove(toast.id)} />

      )}
    </div>);

}
// Toast hook
export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      message: string;
      type: ToastType;
    }>>(
    []);
  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [
    ...prev,
    {
      id,
      message,
      type
    }]
    );
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  return {
    toasts,
    addToast,
    removeToast
  };
}