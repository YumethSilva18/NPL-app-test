import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
interface Settings {
  healthCheckInterval: number;
  lowRiskThreshold: number;
  highRiskThreshold: number;
  showSuccessNotifications: boolean;
  showErrorNotifications: boolean;
  emailAlertsEnabled: boolean;
}
const DEFAULT_SETTINGS: Settings = {
  healthCheckInterval: 30,
  lowRiskThreshold: 25,
  highRiskThreshold: 60,
  showSuccessNotifications: true,
  showErrorNotifications: true,
  emailAlertsEnabled: false
};
export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('npl-predictor-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [hasChanges, setHasChanges] = useState(false);
  const handleChange = <K extends keyof Settings,>(
  key: K,
  value: Settings[K]) =>
  {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };
  const handleSave = () => {
    localStorage.setItem('npl-predictor-settings', JSON.stringify(settings));
    setHasChanges(false);
    // In a real app, this would also call an API endpoint
    alert('Settings saved successfully!');
  };
  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
  };
  return (
    <Layout>
      <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Settings</h2>
        <p className="text-sm text-slate-500">
          Configure system preferences and thresholds
        </p>
      </div>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-white">
            API Configuration
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Backend Endpoint
            </label>
            <input
              type="text"
              value="http://127.0.0.1:8000"
              disabled
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-slate-400 font-mono cursor-not-allowed" />
            
            <p className="text-xs text-slate-600 mt-1">
              Backend API endpoint (read-only)
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Health Check Interval
            </label>
            <select
              value={settings.healthCheckInterval}
              onChange={(e) =>
              handleChange('healthCheckInterval', Number(e.target.value))
              }
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-600/50 focus:border-cyan-600">
              
              <option value={15}>15 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Risk Thresholds */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-white">Risk Thresholds</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              Low Risk Threshold
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.lowRiskThreshold}
                onChange={(e) =>
                handleChange('lowRiskThreshold', Number(e.target.value))
                }
                className="flex-1" />
              
              <span className="text-sm text-white font-medium w-12 text-right">
                {settings.lowRiskThreshold}%
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              NPL probability below this value is considered low risk
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">
              High Risk Threshold
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.highRiskThreshold}
                onChange={(e) =>
                handleChange('highRiskThreshold', Number(e.target.value))
                }
                className="flex-1" />
              
              <span className="text-sm text-white font-medium w-12 text-right">
                {settings.highRiskThreshold}%
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              NPL probability above this value is considered high risk
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-white">
            Notification Preferences
          </h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showSuccessNotifications}
              onChange={(e) =>
              handleChange('showSuccessNotifications', e.target.checked)
              }
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-600 focus:ring-cyan-600 focus:ring-offset-slate-900 cursor-pointer" />
            
            <span className="text-sm text-slate-300">
              Show success notifications
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showErrorNotifications}
              onChange={(e) =>
              handleChange('showErrorNotifications', e.target.checked)
              }
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-600 focus:ring-cyan-600 focus:ring-offset-slate-900 cursor-pointer" />
            
            <span className="text-sm text-slate-300">
              Show error notifications
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailAlertsEnabled}
              onChange={(e) =>
              handleChange('emailAlertsEnabled', e.target.checked)
              }
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-600 focus:ring-cyan-600 focus:ring-offset-slate-900 cursor-pointer" />
            
            <span className="text-sm text-slate-300">
              Email alerts for high-risk predictions
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="primary" onClick={handleSave} disabled={!hasChanges}>
          Save Changes
        </Button>
        <Button variant="secondary" onClick={handleReset}>
          Reset to Defaults
        </Button>
      </div>

      {/* Info */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="text-cyan-400 font-medium">Note:</span> Settings are
          stored locally in your browser. Risk thresholds and notification
          preferences take effect immediately. Backend endpoint configuration
          requires server restart.
        </p>
      </div>
      </div>
    </Layout>
  );
}