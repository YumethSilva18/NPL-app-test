import React from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import { RiskBadge } from '../ui/Badge';
import type { PredictionHistory } from '../../types/prediction';
interface HistoryTableProps {
  history: PredictionHistory[];
  onViewDetails: (prediction: PredictionHistory) => void;
}
export function HistoryTable({ history, onViewDetails }: HistoryTableProps) {
  const getDecisionColor = (hint: string) => {
    switch (hint) {
      case 'Approve':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Review':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Escalate':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Decline':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };
  if (history.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center">
        <p className="text-slate-500">
          No predictions found matching your filters
        </p>
      </div>);

  }
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Customer ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Loan Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                NPL Probability
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Decision
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Analyst
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {history.map((item) =>
            <tr
              key={item.id}
              className="hover:bg-slate-700/30 transition-colors">
              
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-white">
                    {item.customerId}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-white font-medium">
                    ${item.loanAmount.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-cyan-400 font-medium tabular-nums">
                    {(item.nplProbability * 100).toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RiskBadge riskLevel={item.riskLevel} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getDecisionColor(item.decisionHint)}`}>
                  
                    {item.decisionHint}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-400">
                    {item.analyst || 'System'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                  onClick={() => onViewDetails(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-md transition-colors">
                  
                    <EyeIcon className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}