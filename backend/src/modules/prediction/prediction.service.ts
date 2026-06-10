import { Injectable, ServiceUnavailableException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PredictionRequestDto } from './dto/prediction-request.dto';
import { PredictionResponseDto } from './dto/prediction-response.dto';
import { PredictionRepository } from './prediction.repository';
import { ModelService } from '../models/model.service';
import { LoggerService } from '../../config/logger.service';

@Injectable()
export class PredictionService {
  private readonly logger = new LoggerService('PredictionService');

  constructor(
    private readonly predictionRepository: PredictionRepository,
    private readonly modelService: ModelService,
    private readonly configService: ConfigService,
  ) {}

  async createPrediction(
    dto: PredictionRequestDto,
    userId?: string,
  ): Promise<PredictionResponseDto> {
    const startTime = Date.now();

    try {
      // Step 1: Preprocessing & Validation
      const preprocessedData = this.preprocessInput(dto);
      this.logger.log(`Input preprocessed for customer ${dto.customer_id}`);

      // Step 2: Call ML Model Service
      const modelPrediction = await this.modelService.predict(preprocessedData);
      this.logger.log(`Model prediction completed: ${modelPrediction.npl_probability}`);

      // Step 3: Post-processing & Business Logic
      const response = this.postprocessPrediction(modelPrediction, dto);

      // Step 4: Persist to Database
      const processingTime = Date.now() - startTime;
      await this.predictionRepository.create({
        ...dto,
        ...response,
        userId,
        processingTimeMs: processingTime,
      });

      this.logger.log(
        `Prediction completed for ${dto.customer_id} in ${processingTime}ms - Risk: ${response.risk_level}`,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `Prediction failed for customer ${dto.customer_id}`,
        error.stack,
      );

      if (error instanceof ServiceUnavailableException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Prediction service error. Please try again later.',
      );
    }
  }

  private preprocessInput(dto: PredictionRequestDto): any {
    // Feature engineering and normalization
    return {
      customer_id: dto.customer_id,
      credit_score: dto.credit_score,
      income: dto.income,
      loan_amount: dto.loan_amount,
      loan_term: dto.loan_term,
      employment_years: dto.employment_years,
      debt_to_income_ratio: dto.debt_to_income_ratio,
      loan_to_value_ratio: dto.loan_to_value_ratio,
      interest_rate: dto.interest_rate,
      payment_history_score: dto.payment_history_score,
      previous_defaults: dto.previous_defaults,
      age: dto.age,
      collateral_value: dto.collateral_value,
      account_age: dto.account_age,
      utilization_ratio: dto.utilization_ratio,
      monthly_installment: dto.monthly_installment,
      // Additional derived features
      income_to_loan_ratio: dto.income / dto.loan_amount,
      payment_to_income_ratio: dto.monthly_installment / (dto.income / 12),
    };
  }

  private postprocessPrediction(
    modelOutput: any,
    originalInput: PredictionRequestDto,
  ): PredictionResponseDto {
    const nplProbability = modelOutput.npl_probability || modelOutput.probability || 0;
    const confidence = modelOutput.confidence || 0.85;

    // Determine risk level based on probability
    const riskLevel = this.determineRiskLevel(nplProbability);

    // Generate recommendation
    const recommendation = this.generateRecommendation(
      nplProbability,
      riskLevel,
      originalInput,
    );

    // Calculate score breakdown
    const scoreBreakdown = this.calculateScoreBreakdown(originalInput);

    return {
      npl_probability: Number(nplProbability.toFixed(4)),
      risk_level: riskLevel,
      confidence: Number(confidence.toFixed(4)),
      recommendation,
      timestamp: new Date().toISOString(),
      prediction_id: `pred-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      model_version: this.configService.get('ML_MODEL_VERSION', '1.0.0'),
      score_breakdown: scoreBreakdown,
    };
  }

  private determineRiskLevel(probability: number): 'Low' | 'Medium' | 'High' {
    if (probability < 0.25) return 'Low';
    if (probability < 0.60) return 'Medium';
    return 'High';
  }

  private generateRecommendation(
    probability: number,
    riskLevel: string,
    input: PredictionRequestDto,
  ): string {
    const recommendations = {
      Low: `Based on the assessment, this loan application shows low risk characteristics. The customer has ${
        input.payment_history_score >= 80 ? 'a strong' : 'an acceptable'
      } payment history and ${
        input.employment_years >= 5 ? 'stable' : 'reasonable'
      } employment. Recommendation: Approve with standard terms.`,
      
      Medium: `This application presents moderate risk factors. While the customer has ${
        input.credit_score >= 650 ? 'adequate' : 'below-average'
      } credit score, the debt-to-income ratio of ${(
        input.debt_to_income_ratio * 100
      ).toFixed(1)}% requires attention. Recommendation: Review with risk team and consider additional collateral or shorter terms.`,
      
      High: `This loan application exhibits high risk characteristics. The NPL probability of ${(
        probability * 100
      ).toFixed(1)}% is concerning. ${
        input.previous_defaults > 0
          ? `Previous defaults (${input.previous_defaults}) are a significant red flag.`
          : ''
      } Recommendation: ${
        probability > 0.75 ? 'Decline' : 'Escalate to senior management for final decision'
      }.`,
    };

    return recommendations[riskLevel];
  }

  private calculateScoreBreakdown(input: PredictionRequestDto) {
    return {
      credit_score: this.normalizeScore(input.credit_score, 300, 850),
      income_stability: this.normalizeScore(input.employment_years, 0, 20),
      debt_ratio: 1 - input.debt_to_income_ratio, // Lower is better
      payment_history: input.payment_history_score / 100,
      collateral_value: Math.min(
        input.collateral_value / input.loan_amount,
        1,
      ),
    };
  }

  private normalizeScore(value: number, min: number, max: number): number {
    return Number(Math.max(0, Math.min(1, (value - min) / (max - min))).toFixed(4));
  }
}
