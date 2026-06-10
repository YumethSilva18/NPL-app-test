import { ApiProperty } from '@nestjs/swagger';

export class PredictionResponseDto {
  @ApiProperty({ example: 0.23, description: 'NPL probability (0-1)' })
  npl_probability: number;

  @ApiProperty({ example: 'Low', enum: ['Low', 'Medium', 'High'] })
  risk_level: 'Low' | 'Medium' | 'High';

  @ApiProperty({ example: 0.87, description: 'Model confidence (0-1)' })
  confidence: number;

  @ApiProperty({ 
    example: 'Based on the assessment, this loan application shows low risk characteristics. The customer has a strong payment history and stable income.',
  })
  recommendation: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: 'pred-123e4567-e89b-12d3-a456-426614174000' })
  prediction_id: string;

  @ApiProperty({ example: '1.0.0' })
  model_version?: string;

  @ApiProperty({ 
    example: {
      credit_score: 0.85,
      income_stability: 0.78,
      debt_ratio: 0.82,
      payment_history: 0.90,
      collateral_value: 0.88,
    },
    required: false,
  })
  score_breakdown?: {
    credit_score: number;
    income_stability: number;
    debt_ratio: number;
    payment_history: number;
    collateral_value: number;
  };
}
