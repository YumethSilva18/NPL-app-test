import React, { useState, createElement } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/layout/StatCard';
import { PredictionForm } from '../components/forms/PredictionForm';
import { ResultPanel } from '../components/results/ResultPanel';
import { HistoryPage } from './HistoryPage';
import { StatusPage } from './StatusPage';
import { SettingsPage } from './SettingsPage';
import { ToastContainer, useToast } from '../components/ui/Toast';
import { api } from '../services/api';
import type {
  PredictionRequest,
  PredictionResponse,
  ViewType } from
'../types/prediction';
export function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionCount, setPredictionCount] = useState(0);
  const { toasts, addToast, removeToast } = useToast();
  const handlePredict = async (data: PredictionRequest) => {
    setIsLoading(true);
    try {
      const prediction = await api.predict(data);
      setResult({
        ...prediction,
        timestamp: new Date().toISOString(),
        predictionId: `PRED-${Date.now()}`
      });
      setPredictionCount((prev) => prev + 1);
      addToast('Risk assessment completed successfully', 'success');
    } catch (err) {
      addToast(
        'Failed to connect to prediction service. Please verify the backend is running.',
        'error'
      );
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRefresh = () => {
    if (currentView === 'dashboard' && result) {
      addToast('Refreshing prediction data...', 'info');
    } else if (currentView === 'status') {
      addToast('Refreshing system status...', 'info');
    }
  };
  const handleExport = () => {
    if (!result) {
      addToast('No prediction data to export', 'error');
      return;
    }
    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prediction-${result.predictionId || Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Prediction exported successfully', 'success');
  };
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onRefresh={handleRefresh}
          onExport={currentView === 'dashboard' ? handleExport : undefined} />
        

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {currentView === 'dashboard' &&
            <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <StatCard
                  label="Total Predictions"
                  value={predictionCount}
                  variant="default" />
                
                  <StatCard
                  label="Current Risk"
                  value={result?.riskLevel || 'N/A'}
                  variant={
                  result?.riskLevel === 'Low' ?
                  'success' :
                  result?.riskLevel === 'Medium' ?
                  'warning' :
                  result?.riskLevel === 'High' ?
                  'error' :
                  'default'
                  } />
                
                  <StatCard
                  label="Model Status"
                  value="Active"
                  variant="success" />
                
                  <StatCard
                  label="Avg Confidence"
                  value={
                  result ?
                  `${(result.confidence * 100).toFixed(0)}%` :
                  'N/A'
                  }
                  variant="default" />
                
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PredictionForm
                  onSubmit={handlePredict}
                  isLoading={isLoading} />
                
                  <ResultPanel result={result} isLoading={isLoading} />
                </div>
              </>
            }

            {currentView === 'history' && <HistoryPage />}
            {currentView === 'status' && <StatusPage />}
            {currentView === 'settings' && <SettingsPage />}
          </div>
        </main>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>);

}