import React, { useState, createElement } from 'react';
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { HistoryFilters } from '../components/history/HistoryFilters';
import { HistoryTable } from '../components/history/HistoryTable';
import { PredictionDetailModal } from '../components/results/PredictionDetailModal';
import type {
  PredictionHistory,
  HistoryFilters as Filters,
  PredictionDetail } from
'../types/prediction';
// Mock data - clearly marked as demo
const mockHistory: PredictionHistory[] = [
{
  id: '1',
  customerId: 'CUST-2024-156',
  timestamp: new Date(Date.now() - 3600000).toISOString(),
  riskLevel: 'Low',
  nplProbability: 0.12,
  loanAmount: 250000,
  decisionHint: 'Approve',
  analyst: 'J. Smith'
},
{
  id: '2',
  customerId: 'CUST-2024-155',
  timestamp: new Date(Date.now() - 7200000).toISOString(),
  riskLevel: 'Medium',
  nplProbability: 0.45,
  loanAmount: 420000,
  decisionHint: 'Review',
  analyst: 'M. Johnson'
},
{
  id: '3',
  customerId: 'CUST-2024-154',
  timestamp: new Date(Date.now() - 10800000).toISOString(),
  riskLevel: 'High',
  nplProbability: 0.78,
  loanAmount: 580000,
  decisionHint: 'Escalate',
  analyst: 'A. Williams'
},
{
  id: '4',
  customerId: 'CUST-2024-153',
  timestamp: new Date(Date.now() - 14400000).toISOString(),
  riskLevel: 'Low',
  nplProbability: 0.08,
  loanAmount: 180000,
  decisionHint: 'Approve',
  analyst: 'J. Smith'
},
{
  id: '5',
  customerId: 'CUST-2024-152',
  timestamp: new Date(Date.now() - 18000000).toISOString(),
  riskLevel: 'High',
  nplProbability: 0.85,
  loanAmount: 650000,
  decisionHint: 'Decline',
  analyst: 'M. Johnson'
}];

export function HistoryPage() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    riskLevel: 'all',
    dateFrom: '',
    dateTo: '',
    decisionHint: 'all'
  });
  const [selectedPrediction, setSelectedPrediction] =
  useState<PredictionDetail | null>(null);
  const filteredHistory = mockHistory.filter((item) => {
    // Search filter
    if (
    filters.search &&
    !item.customerId.toLowerCase().includes(filters.search.toLowerCase()))
    {
      return false;
    }
    // Risk level filter
    if (filters.riskLevel !== 'all' && item.riskLevel !== filters.riskLevel) {
      return false;
    }
    // Decision hint filter
    if (
    filters.decisionHint !== 'all' &&
    item.decisionHint !== filters.decisionHint)
    {
      return false;
    }
    // Date range filter
    const itemDate = new Date(item.timestamp);
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      if (itemDate < fromDate) return false;
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      if (itemDate > toDate) return false;
    }
    return true;
  });
  const handleViewDetails = (prediction: PredictionHistory) => {
    // In a real app, fetch full details from API
    const mockDetail: PredictionDetail = {
      ...prediction,
      request: {
        customerId: prediction.customerId,
        creditScore: 680,
        income: 85000,
        loanAmount: prediction.loanAmount,
        loanTerm: 360,
        employmentYears: 7,
        debtToIncomeRatio: 0.38,
        loanToValueRatio: 0.85,
        interestRate: 5.25,
        paymentHistoryScore: 82,
        previousDefaults: 0,
        age: 38,
        collateralValue: 376000,
        accountAge: 84,
        utilizationRatio: 0.42,
        monthlyInstallment: 1765
      },
      decisionHint: prediction.decisionHint
    };
    setSelectedPrediction(mockDetail);
  };
  const handleExport = () => {
    const csv = [
    [
    'Customer ID',
    'Timestamp',
    'Risk Level',
    'NPL Probability',
    'Loan Amount',
    'Decision',
    'Analyst'],

    ...filteredHistory.map((item) => [
    item.customerId,
    new Date(item.timestamp).toLocaleString(),
    item.riskLevel,
    (item.nplProbability * 100).toFixed(2) + '%',
    '$' + item.loanAmount.toLocaleString(),
    item.decisionHint,
    item.analyst || 'System']
    )].

    map((row) => row.join(',')).
    join('\n');
    const blob = new Blob([csv], {
      type: 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `npl-predictions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleClearFilters = () => {
    setFilters({
      search: '',
      riskLevel: 'all',
      dateFrom: '',
      dateTo: '',
      decisionHint: 'all'
    });
  };
  const hasActiveFilters =
  filters.search ||
  filters.riskLevel !== 'all' ||
  filters.decisionHint !== 'all' ||
  filters.dateFrom ||
  filters.dateTo;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">
            Prediction History
          </h2>
          <p className="text-sm text-slate-500">
            Recent risk assessments •{' '}
            <span className="text-amber-400">Demo Data</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters &&
          <Button onClick={handleClearFilters} variant="ghost" size="sm">
              <XMarkIcon className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          }
          <Button onClick={handleExport} variant="secondary" size="sm">
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <HistoryFilters filters={filters} onFiltersChange={setFilters} />

      <div className="flex items-center justify-between text-sm">
        <p className="text-slate-400">
          Showing {filteredHistory.length} of {mockHistory.length} predictions
        </p>
      </div>

      <HistoryTable
        history={filteredHistory}
        onViewDetails={handleViewDetails} />
      

      {selectedPrediction &&
      <PredictionDetailModal
        prediction={selectedPrediction}
        onClose={() => setSelectedPrediction(null)} />

      }
    </div>);

}