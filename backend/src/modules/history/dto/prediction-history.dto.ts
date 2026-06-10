import { ApiProperty } from '@nestjs/swagger';

export class PredictionHistoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customer_id: string;

  @ApiProperty()
  timestamp: string;

  @ApiProperty({ enum: ['Low', 'Medium', 'High'] })
  risk_level: string;

  @ApiProperty()
  npl_probability: number;

  @ApiProperty()
  loan_amount: number;

  @ApiProperty({ enum: ['Approve', 'Review', 'Escalate', 'Decline'] })
  decision_hint: string;

  @ApiProperty({ required: false })
  analyst?: string;
}
