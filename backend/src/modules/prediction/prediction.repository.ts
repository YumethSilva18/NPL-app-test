import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PredictionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.prediction.create({
      data: {
        customerId: data.customer_id,
        creditScore: data.credit_score,
        income: data.income,
        loanAmount: data.loan_amount,
        loanTerm: data.loan_term,
        employmentYears: data.employment_years,
        debtToIncomeRatio: data.debt_to_income_ratio,
        loanToValueRatio: data.loan_to_value_ratio,
        interestRate: data.interest_rate,
        paymentHistoryScore: data.payment_history_score,
        previousDefaults: data.previous_defaults,
        age: data.age,
        collateralValue: data.collateral_value,
        accountAge: data.account_age,
        utilizationRatio: data.utilization_ratio,
        monthlyInstallment: data.monthly_installment,
        nplProbability: data.npl_probability,
        riskLevel: data.risk_level,
        confidence: data.confidence,
        recommendation: data.recommendation,
        decisionHint: this.determineDecisionHint(data.npl_probability, data.risk_level),
        modelVersion: data.model_version || '1.0.0',
        modelName: 'npl-classifier-v1',
        processingTimeMs: data.processingTimeMs,
        scoreBreakdown: data.score_breakdown || {},
        userId: data.userId,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.prediction.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.PredictionWhereInput;
    orderBy?: Prisma.PredictionOrderByWithRelationInput;
  }) {
    return this.prisma.prediction.findMany(params);
  }

  async count(where?: Prisma.PredictionWhereInput) {
    return this.prisma.prediction.count({ where });
  }

  private determineDecisionHint(
    probability: number,
    riskLevel: string,
  ): 'Approve' | 'Review' | 'Escalate' | 'Decline' {
    if (riskLevel === 'Low' && probability < 0.15) return 'Approve';
    if (riskLevel === 'Low' || (riskLevel === 'Medium' && probability < 0.35))
      return 'Review';
    if (riskLevel === 'Medium' || (riskLevel === 'High' && probability < 0.70))
      return 'Escalate';
    return 'Decline';
  }
}
