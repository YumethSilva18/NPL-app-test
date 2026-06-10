import React, { useEffect, useState } from 'react';
import { ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Badge } from '../ui/Badge';
import { api } from '../../services/api';
import type { HealthResponse } from '../../types/prediction';
interface HeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}
export function Header({ onRefresh, onExport }: HeaderProps) {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await api.checkHealth();
        setHealth(data);
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);
  return (
    <header className="bg-slate-900 border-b border-slate-800">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isChecking ?
              <Badge variant="info">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                    Checking
                  </span>
                </Badge> :
              health?.status === 'healthy' && health?.modelLoaded ?
              <Badge variant="success">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    Online
                  </span>
                </Badge> :

              <Badge variant="error">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    Offline
                  </span>
                </Badge>
              }
              {health?.responseTime &&
              <span className="text-xs text-slate-500">
                  {health.responseTime}ms
                </span>
              }
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh &&
            <button
              onClick={onRefresh}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Refresh">
              
                <ArrowPathIcon className="w-5 h-5" />
              </button>
            }
            {onExport &&
            <button
              onClick={onExport}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Export">
              
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>
            }
          </div>
        </div>
      </div>
    </header>);

}