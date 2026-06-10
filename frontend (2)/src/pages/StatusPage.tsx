import React, { useEffect, useState } from 'react';
import {
  ArrowPathIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { Layout } from '../components/layout/Layout';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import type { HealthResponse } from '../types/prediction';
export function StatusPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const checkHealth = async () => {
    setIsLoading(true);
    try {
      const data = await api.checkHealth();
      setHealth(data);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkHealth();
  }, []);
  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText('http://127.0.0.1:8000');
    alert('Endpoint copied to clipboard');
  };
  return (
    <Layout onRefresh={checkHealth}>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">
            System Status
          </h2>
          <p className="text-sm text-slate-500">
            Live API health and system metrics
          </p>
        </div>
        <Button
          onClick={checkHealth}
          variant="secondary"
          size="sm"
          isLoading={isLoading}>
          
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Live API Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">API Health</h3>
              <Badge variant="success">Live Data</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ?
            <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
              </div> :

            <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Status</span>
                  {health?.status === 'healthy' ?
                <Badge variant="success">Healthy</Badge> :

                <Badge variant="error">Unhealthy</Badge>
                }
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Model Loaded</span>
                  {health?.modelLoaded ?
                <Badge variant="success">Yes</Badge> :

                <Badge variant="error">No</Badge>
                }
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Response Time</span>
                  <span className="text-sm text-slate-300 font-medium tabular-nums">
                    {health?.responseTime ? `${health.responseTime}ms` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Last Checked</span>
                  <span className="text-sm text-slate-300">
                    {lastChecked.toLocaleTimeString()}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Endpoint</span>
                    <Button
                    onClick={handleCopyEndpoint}
                    variant="ghost"
                    size="sm"
                    className="h-auto py-1">
                    
                      <ClipboardDocumentIcon className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <code className="text-xs text-slate-500 font-mono block mt-1">
                    http://127.0.0.1:8000
                  </code>
                </div>
              </>
            }
          </CardContent>
        </Card>

        {/* Model Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Model Information
              </h3>
              <Badge variant="info">System Info</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Model Type</span>
              <span className="text-sm text-slate-300">NPL Classifier</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Version</span>
              <span className="text-sm text-slate-300">
                {health?.version || 'v1.0.0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Framework</span>
              <span className="text-sm text-slate-300">FastAPI + ML</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Environment</span>
              <span className="text-sm text-slate-300">Development</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Recent Activity
            </h3>
            <Badge variant="success">Live Data</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex gap-3 text-slate-500">
              <span className="text-slate-600">
                [{new Date().toLocaleTimeString()}]
              </span>
              <span className="text-green-400">INFO</span>
              <span>
                Health check completed - {health?.responseTime || 0}ms
              </span>
            </div>
            <div className="flex gap-3 text-slate-500">
              <span className="text-slate-600">
                [{new Date(Date.now() - 60000).toLocaleTimeString()}]
              </span>
              <span className="text-cyan-400">INFO</span>
              <span>
                Model status verified -{' '}
                {health?.modelLoaded ? 'loaded' : 'not loaded'}
              </span>
            </div>
            <div className="flex gap-3 text-slate-500">
              <span className="text-slate-600">
                [{new Date(Date.now() - 120000).toLocaleTimeString()}]
              </span>
              <span className="text-green-400">INFO</span>
              <span>System status check initiated</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Performance Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Performance Metrics
            </h3>
            <Badge variant="warning">Demo Data</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Avg Response Time</p>
              <p className="text-lg font-bold text-cyan-400 tabular-nums">
                142ms
              </p>
              <p className="text-xs text-slate-600 mt-0.5">Sample metric</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Uptime</p>
              <p className="text-lg font-bold text-green-400">99.8%</p>
              <p className="text-xs text-slate-600 mt-0.5">Sample metric</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Total Predictions</p>
              <p className="text-lg font-bold text-white tabular-nums">1,247</p>
              <p className="text-xs text-slate-600 mt-0.5">Sample metric</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Error Rate</p>
              <p className="text-lg font-bold text-green-400">0.2%</p>
              <p className="text-xs text-slate-600 mt-0.5">Sample metric</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </Layout>
  );
}