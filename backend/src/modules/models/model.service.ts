import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { LoggerService } from '../../config/logger.service';

@Injectable()
export class ModelService {
  private readonly logger = new LoggerService('ModelService');
  private readonly mlServiceUrl: string;
  private readonly timeout: number;
  private readonly fallbackEnabled: boolean;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.mlServiceUrl = this.configService.get('ML_SERVICE_URL', 'http://localhost:5000');
    this.timeout = this.configService.get('ML_SERVICE_TIMEOUT', 30000);
    this.fallbackEnabled = this.configService.get('ML_FALLBACK_ENABLED', 'true') === 'true';
  }

  async predict(data: any): Promise<any> {
    try {
      this.logger.debug(`Calling ML service at ${this.mlServiceUrl}/predict`);

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.mlServiceUrl}/predict`,
          data,
          {
            timeout: this.timeout,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error('ML service call failed', error.message);

      if (this.fallbackEnabled) {
        this.logger.warn('Using fallback prediction model');
        return this.fallbackPredict(data);
      }

      throw new ServiceUnavailableException(
        'ML prediction service is currently unavailable. Please try again later.',
      );
    }
  }

  /**
   * Fallback prediction using rule-based logic
   * This is a simplified model for demo purposes when ML service is unavailable
   */
  private fallbackPredict(data: any): any {
    this.logger.warn('Using rule-based fallback prediction');

    // Simple rule-based scoring
    let riskScore = 0;

    // Credit score impact (40%)
    if (data.credit_score < 580) riskScore += 0.4;
    else if (data.credit_score < 670) riskScore += 0.25;
    else if (data.credit_score < 740) riskScore += 0.15;
    else riskScore += 0.05;

    // Debt-to-income ratio impact (25%)
    if (data.debt_to_income_ratio > 0.5) riskScore += 0.25;
    else if (data.debt_to_income_ratio > 0.43) riskScore += 0.15;
    else if (data.debt_to_income_ratio > 0.36) riskScore += 0.10;
    else riskScore += 0.03;

    // Payment history impact (20%)
    const paymentHistoryRisk = (100 - data.payment_history_score) / 100;
    riskScore += paymentHistoryRisk * 0.2;

    // Previous defaults impact (10%)
    if (data.previous_defaults > 2) riskScore += 0.10;
    else if (data.previous_defaults > 0) riskScore += 0.05;

    // Employment stability impact (5%)
    if (data.employment_years < 2) riskScore += 0.05;
    else if (data.employment_years < 5) riskScore += 0.02;

    // Normalize to 0-1 range
    const nplProbability = Math.min(Math.max(riskScore, 0), 1);

    return {
      npl_probability: nplProbability,
      confidence: 0.75, // Lower confidence for fallback
      model_type: 'fallback-rule-based',
      warning: 'ML service unavailable - using rule-based fallback',
    };
  }

  async getModelMetadata(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.mlServiceUrl}/model/info`, {
          timeout: 5000,
        }),
      );

      return response.data;
    } catch (error) {
      return {
        status: 'unavailable',
        version: this.configService.get('ML_MODEL_VERSION', '1.0.0'),
        type: 'fallback',
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.mlServiceUrl}/health`, {
          timeout: 3000,
        }),
      );

      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}
