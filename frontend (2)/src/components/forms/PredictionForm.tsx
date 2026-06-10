import React, { useState, FormEvent } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { InputField } from './InputField';
import type { PredictionRequest } from '../../types/prediction';
interface PredictionFormProps {
  onSubmit: (data: PredictionRequest) => void;
  isLoading: boolean;
}
export function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [formData, setFormData] = useState<PredictionRequest>({
    customerId: 'CUST-2024-001',
    creditScore: 680,
    income: 85000,
    loanAmount: 320000,
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
  });
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  const handleReset = () => {
    setFormData({
      customerId: 'CUST-2024-001',
      creditScore: 680,
      income: 85000,
      loanAmount: 320000,
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
    });
  };
  const updateField = (
  field: keyof PredictionRequest,
  value: string | number) =>
  {
    setFormData((prev) => ({
      ...prev,
      [field]:
      typeof value === 'string' ?
      field === 'customerId' ?
      value :
      parseFloat(value) || 0 :
      value
    }));
  };
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-white">
          Loan Application Assessment
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter complete customer and loan information for risk evaluation
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer Identification */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Customer Identification
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <InputField
                label="Customer ID"
                type="text"
                value={formData.customerId}
                onChange={(e) => updateField('customerId', e.target.value)}
                helperText="Unique customer identifier"
                required />
              
            </div>
          </div>

          {/* Customer Profile */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Customer Profile
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Credit Score"
                type="number"
                min="300"
                max="850"
                value={formData.creditScore}
                onChange={(e) => updateField('creditScore', e.target.value)}
                helperText="300-850"
                required />
              
              <InputField
                label="Age"
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={(e) => updateField('age', e.target.value)}
                helperText="Years"
                required />
              
              <InputField
                label="Annual Income"
                type="number"
                min="0"
                step="1000"
                value={formData.income}
                onChange={(e) => updateField('income', e.target.value)}
                helperText="USD"
                required />
              
              <InputField
                label="Employment Years"
                type="number"
                min="0"
                max="50"
                value={formData.employmentYears}
                onChange={(e) => updateField('employmentYears', e.target.value)}
                helperText="Current employer"
                required />
              
              <InputField
                label="Account Age"
                type="number"
                min="0"
                value={formData.accountAge}
                onChange={(e) => updateField('accountAge', e.target.value)}
                helperText="Months"
                required />
              
              <InputField
                label="Previous Defaults"
                type="number"
                min="0"
                max="10"
                value={formData.previousDefaults}
                onChange={(e) =>
                updateField('previousDefaults', e.target.value)
                }
                helperText="Count"
                required />
              
            </div>
          </div>

          {/* Loan Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Loan Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Loan Amount"
                type="number"
                min="0"
                step="1000"
                value={formData.loanAmount}
                onChange={(e) => updateField('loanAmount', e.target.value)}
                helperText="USD"
                required />
              
              <InputField
                label="Loan Term"
                type="number"
                min="12"
                max="480"
                value={formData.loanTerm}
                onChange={(e) => updateField('loanTerm', e.target.value)}
                helperText="Months"
                required />
              
              <InputField
                label="Interest Rate"
                type="number"
                min="0"
                max="30"
                step="0.01"
                value={formData.interestRate}
                onChange={(e) => updateField('interestRate', e.target.value)}
                helperText="% APR"
                required />
              
              <InputField
                label="Monthly Installment"
                type="number"
                min="0"
                step="1"
                value={formData.monthlyInstallment}
                onChange={(e) =>
                updateField('monthlyInstallment', e.target.value)
                }
                helperText="USD/month"
                required />
              
              <InputField
                label="Collateral Value"
                type="number"
                min="0"
                step="1000"
                value={formData.collateralValue}
                onChange={(e) => updateField('collateralValue', e.target.value)}
                helperText="USD"
                required />
              
              <InputField
                label="LTV Ratio"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.loanToValueRatio}
                onChange={(e) =>
                updateField('loanToValueRatio', e.target.value)
                }
                helperText="0.00-1.00"
                required />
              
            </div>
          </div>

          {/* Financial Metrics */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Financial Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Debt-to-Income Ratio"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.debtToIncomeRatio}
                onChange={(e) =>
                updateField('debtToIncomeRatio', e.target.value)
                }
                helperText="0.00-1.00"
                required />
              
              <InputField
                label="Utilization Ratio"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.utilizationRatio}
                onChange={(e) =>
                updateField('utilizationRatio', e.target.value)
                }
                helperText="0.00-1.00"
                required />
              
              <InputField
                label="Payment History Score"
                type="number"
                min="0"
                max="100"
                value={formData.paymentHistoryScore}
                onChange={(e) =>
                updateField('paymentHistoryScore', e.target.value)
                }
                helperText="0-100"
                required />
              
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-700">
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Predict Risk
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              disabled={isLoading}>
              
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>);

}