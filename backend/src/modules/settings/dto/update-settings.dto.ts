import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class UpdateSettingsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(300)
  health_check_interval?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  low_risk_threshold?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  high_risk_threshold?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  show_success_notifications?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  show_error_notifications?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  email_alerts_enabled?: boolean;
}
