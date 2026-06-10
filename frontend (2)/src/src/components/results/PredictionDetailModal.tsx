import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { RiskBadge } from '../ui/Badge';
import type { PredictionDetail } from '../../types/prediction';
interface PredictionDetailModalProps {
  prediction: PredictionDetail;
  onClose: () => void;
}
export function PredictionDetailModal({
  prediction,
  onClose
}: PredictionDetailModalProps) {
  const getDecisionColor = (hint: string) => {
    switch (hint) {
      case 'Approve':
        return 'text-green-400';
      case 'Review':
        return 'text-amber-400';
      case 'Escalate':
        return 'text-orange-400';
      case 'Decline':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Prediction Details
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {prediction.timestamp ?
                  new Date(prediction.timestamp).toLocaleString() :
                  'N/A'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors">
                
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Risk Assessment */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                Risk Assessment
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">NPL Probability</p>
                  <p className="text-2xl font-bold text-cyan-400 tabular-nums">
                    {(prediction.nplProbability * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">Risk Level</p>
                  <RiskBadge riskLevel={prediction.riskLevel} />
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-green-400 tabular-nums">
                    {(prediction.confidence * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">Decision Hint</p>
                  <p
                    className={`text-lg font-bold ${getDecisionColor(prediction.decisionHint)}`}>
                    
                    {prediction.decisionHint}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                Customer Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Customer ID</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {prediction.request.customerId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Credit Score</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {prediction.request.creditScore}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Age</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {prediction.request.age} years
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Annual Income</p>
                  <p className="text-sm text-white font-medium mt-1">
                    ${prediction.request.income.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Employment Years</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {prediction.request.employmentYears} years
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Account Age</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {prediction.request.accountAge} months
                  </p>
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                Loan Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Loan Amount</p>
                  <p className="text-sm text-white font-medium mt-1">
                    ${prediction.request.loanAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Loan Term</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {prediction.request.loanTerm} months
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Interest Rate</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {prediction.request.interestRate}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Monthly Installment</p>
                  <p className="text-sm text-white font-medium mt-1">
                    ${prediction.request.monthlyInstallment.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Collateral Value</p>
                  <p className="text-sm text-white font-medium mt-1">
                    ${prediction.request.collateralValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">LTV Ratio</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {(prediction.request.loanToValueRatio * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Metrics */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                Financial Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500">DTI Ratio</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {(prediction.request.debtToIncomeRatio * 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Utilization Ratio</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {(prediction.request.utilizationRatio * 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    Payment History Score
                  </p>
                  <p className="text-sm text-white font-medium mt-1">
                    {prediction.request.paymentHistoryScore}/100
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Previous Defaults</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {prediction.request.previousDefaults}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Analyst Recommendation
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {prediction.recommendation}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-600 leading-relaxed">
                This AI-generated assessment is for informational purposes only.
                All credit decisions must be reviewed and approved by authorized
                personnel in accordance with institutional lending policies and
                regulatory requirements.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

}