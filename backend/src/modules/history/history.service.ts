import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { HistoryQueryDto } from './dto/history-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getHistory(query: HistoryQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      risk_level,
      decision_hint,
      date_from,
      date_to,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PredictionWhereInput = {};

    if (search) {
      where.customerId = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (risk_level && risk_level !== 'all') {
      where.riskLevel = risk_level as any;
    }

    if (decision_hint && decision_hint !== 'all') {
      where.decisionHint = decision_hint as any;
    }

    if (date_from || date_to) {
      where.createdAt = {};
      if (date_from) {
        where.createdAt.gte = new Date(date_from);
      }
      if (date_to) {
        const dateTo = new Date(date_to);
        dateTo.setHours(23, 59, 59, 999);
        where.createdAt.lte = dateTo;
      }
    }

    // Execute query
    const [predictions, total] = await Promise.all([
      this.prisma.prediction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          customerId: true,
          createdAt: true,
          riskLevel: true,
          nplProbability: true,
          loanAmount: true,
          decisionHint: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.prediction.count({ where }),
    ]);

    // Transform to match frontend expectations (snake_case)
    const data = predictions.map((pred) => ({
      id: pred.id,
      customer_id: pred.customerId,
      timestamp: pred.createdAt.toISOString(),
      risk_level: pred.riskLevel,
      npl_probability: Number(pred.nplProbability),
      loan_amount: Number(pred.loanAmount),
      decision_hint: pred.decisionHint,
      analyst: pred.user
        ? `${pred.user.firstName || ''} ${pred.user.lastName || ''}`.trim() || pred.user.email
        : 'System',
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getPredictionById(id: string) {
    const prediction = await this.prisma.prediction.findUnique({
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

    if (!prediction) {
      throw new NotFoundException(`Prediction with ID ${id} not found`);
    }

    // Transform to match frontend expectations
    return {
      id: prediction.id,
      customer_id: prediction.customerId,
      timestamp: prediction.createdAt.toISOString(),
      risk_level: prediction.riskLevel,
      npl_probability: Number(prediction.nplProbability),
      confidence: Number(prediction.confidence),
      recommendation: prediction.recommendation,
      decision_hint: prediction.decisionHint,
      model_version: prediction.modelVersion,
      score_breakdown: prediction.scoreBreakdown,
      request: {
        customer_id: prediction.customerId,
        credit_score: prediction.creditScore,
        income: Number(prediction.income),
        loan_amount: Number(prediction.loanAmount),
        loan_term: prediction.loanTerm,
        employment_years: prediction.employmentYears,
        debt_to_income_ratio: Number(prediction.debtToIncomeRatio),
        loan_to_value_ratio: Number(prediction.loanToValueRatio),
        interest_rate: Number(prediction.interestRate),
        payment_history_score: prediction.paymentHistoryScore,
        previous_defaults: prediction.previousDefaults,
        age: prediction.age,
        collateral_value: Number(prediction.collateralValue),
        account_age: prediction.accountAge,
        utilization_ratio: Number(prediction.utilizationRatio),
        monthly_installment: Number(prediction.monthlyInstallment),
      },
      analyst: prediction.user
        ? {
            id: prediction.user.id,
            name: `${prediction.user.firstName || ''} ${prediction.user.lastName || ''}`.trim(),
            email: prediction.user.email,
          }
        : null,
    };
  }
}
