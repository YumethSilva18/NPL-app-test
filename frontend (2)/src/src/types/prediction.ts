export interface PredictionRequest {
  customerId: string;
  creditScore: number;
  income: number;
  loanAmount: number;
  loanTerm: number;
  employmentYears: number;
  debtToIncomeRatio: number;
  loanToValueRatio: number;
  interestRate: number;
  paymentHistoryScore: number;
  previousDefaults: number;
  age: number;
  collateralValue: number;
  accountAge: number;
  utilizationRatio: number;
  monthlyInstallment: number;
}

export interface PredictionResponse {
  nplProbability: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
  recommendation: string;
  timestamp?: string;
  predictionId?: string;
}

export interface PredictionDetail extends PredictionResponse {
  request: PredictionRequest;
  scoreBreakdown?: {
    creditScore: number;
    incomeStability: number;
    debtRatio: number;
    paymentHistory: number;
    collateralValue: number;
  };
  decisionHint: 'Approve' | 'Review' | 'Escalate' | 'Decline';
}

export interface HealthResponse {
  status: string;
  modelLoaded: boolean;
  timestamp: string;
  version?: string;
  uptime?: number;
  responseTime?: number;
}

export interface PredictionHistory {
  id: string;
  customerId: string;
  timestamp: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  nplProbability: number;
  loanAmount: number;
  decisionHint: 'Approve' | 'Review' | 'Escalate' | 'Decline';
  analyst?: string;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';
export type ViewType = 'dashboard' | 'history' | 'status' | 'settings';
export type DecisionHint = 'Approve' | 'Review' | 'Escalate' | 'Decline';

export interface HistoryFilters {
  search: string;
  riskLevel: RiskLevel | 'all';
  dateFrom: string;
  dateTo: string;
  decisionHint: DecisionHint | 'all';
}