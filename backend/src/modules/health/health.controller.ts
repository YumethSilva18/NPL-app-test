import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthResponseDto, DetailedHealthResponseDto } from './dto/health-response.dto';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('health')
@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy', type: HealthResponseDto })
  async checkHealth(): Promise<HealthResponseDto> {
    return this.healthService.getBasicHealth();
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health check with system metrics' })
  @ApiResponse({ status: 200, description: 'Detailed health information', type: DetailedHealthResponseDto })
  async checkDetailedHealth(): Promise<DetailedHealthResponseDto> {
    return this.healthService.getDetailedHealth();
  }
}
