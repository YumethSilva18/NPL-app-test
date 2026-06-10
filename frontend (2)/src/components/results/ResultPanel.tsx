import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { RiskBadge } from '../ui/Badge';
import type { PredictionResponse } from '../../types/prediction';
interface ResultPanelProps {
  result: PredictionResponse | null;
  isLoading: boolean;
}
function getDecisionHint(nplProbability: number, riskLevel: string): string {
  if (riskLevel === 'Low' && nplProbability < 0.15) return 'Approve';
  if (riskLevel === 'Low' || riskLevel === 'Medium' && nplProbability < 0.35)
  return 'Review';
  if (riskLevel === 'Medium' || riskLevel === 'High' && nplProbability < 0.7)
  return 'Escalate';
  return 'Decline';
}
export function ResultPanel({ result, isLoading }: ResultPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Risk Assessment</h2>
          <p className="text-xs text-slate-500 mt-1">
            Processing loan application data
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-3 border-cyan-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-sm">Analyzing risk factors...</p>
          </div>
        </CardContent>
      </Card>);

  }
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-white">Risk Assessment</h2>
          <p className="text-xs text-slate-500 mt-1">
            Awaiting loan application submission
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No assessment available</p>
            <p className="text-slate-600 text-xs mt-1">
              Complete and submit the form to generate a risk prediction
            </p>
          </div>
        </CardContent>
      </Card>);

  }
  const probabilityPercentage = (result.nplProbability * 100).toFixed(2);
  const confidencePercentage = (result.confidence * 100).toFixed(1);
  const decisionHint = getDecisionHint(result.nplProbability, result.riskLevel);
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-green-400';
      case 'Medium':
        return 'text-amber-400';
      case 'High':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };
  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-amber-500';
      case 'High':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };
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
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Risk Assessment
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {result.timestamp ?
              new Date(result.timestamp).toLocaleString() :
              'Just now'}
            </p>
          </div>
          <RiskBadge riskLevel={result.riskLevel} />
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* NPL Probability */}
        <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              NPL Probability
            </span>
            <span
              className={`text-3xl font-bold tabular-nums ${getRiskColor(result.riskLevel)}`}>
              
              {probabilityPercentage}%
            </span>
          </div>
          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{
                width: `${probabilityPercentage}%`
              }}
              className={`absolute top-0 left-0 h-full ${getRiskBgColor(result.riskLevel)} transition-all duration-700 ease-out`} />
            
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Estimated likelihood of loan default
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <p className="text-xs font-medium text-slate-400 mb-1">
              Confidence
            </p>
            <p className="text-2xl font-bold text-cyan-400 tabular-nums">
              {confidencePercentage}%
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <p className="text-xs font-medium text-slate-400 mb-1">
              Risk Level
            </p>
            <p
              className={`text-2xl font-bold ${getRiskColor(result.riskLevel)}`}>
              
              {result.riskLevel}
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <p className="text-xs font-medium text-slate-400 mb-1">Decision</p>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getDecisionColor(decisionHint)}`}>
              
              {decisionHint}
            </span>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
            Analyst Recommendation
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            {result.recommendation}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-600 leading-relaxed">
            This AI-generated assessment is for informational purposes only. All
            credit decisions must be reviewed and approved by authorized
            personnel in accordance with institutional lending policies.
          </p>
        </div>
      </CardContent>
    </Card>);

}