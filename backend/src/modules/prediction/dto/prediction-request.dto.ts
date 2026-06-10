import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class PredictionRequestDto {
  @ApiProperty({ example: 'CUST-2024-001', description: 'Unique customer identifier' })
  @IsString()
  customer_id: string;

  @ApiProperty({ example: 680, minimum: 300, maximum: 850 })
  @IsInt()
  @Min(300)
  @Max(850)
  credit_score: number;

  @ApiProperty({ example: 85000, description: 'Annual income in USD' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  income: number;

  @ApiProperty({ example: 320000, description: 'Loan amount in USD' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  loan_amount: number;

  @ApiProperty({ example: 360, description: 'Loan term in months' })
  @IsInt()
  @IsPositive()
  loan_term: number;

  @ApiProperty({ example: 7, description: 'Years with current employer' })
  @IsInt()
  @Min(0)
  employment_years: number;

  @ApiProperty({ example: 0.38, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  debt_to_income_ratio: number;

  @ApiProperty({ example: 0.85, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  loan_to_value_ratio: number;

  @ApiProperty({ example: 5.25, description: 'Interest rate percentage' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  interest_rate: number;

  @ApiProperty({ example: 82, minimum: 0, maximum: 100 })
  @IsInt()
  @Min(0)
  @Max(100)
  payment_history_score: number;

  @ApiProperty({ example: 0, minimum: 0 })
  @IsInt()
  @Min(0)
  previous_defaults: number;

  @ApiProperty({ example: 38, minimum: 18, maximum: 100 })
  @IsInt()
  @Min(18)
  @Max(100)
  age: number;

  @ApiProperty({ example: 376000, description: 'Collateral value in USD' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  collateral_value: number;

  @ApiProperty({ example: 84, description: 'Account age in months' })
  @IsInt()
  @Min(0)
  account_age: number;

  @ApiProperty({ example: 0.42, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  utilization_ratio: number;

  @ApiProperty({ example: 1765, description: 'Monthly payment amount' })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  monthly_installment: number;
}
