import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'healthy' })
  status: string;

  @ApiProperty({ example: true })
  model_loaded: boolean;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: '1.0.0' })
  version: string;
}

export class DetailedHealthResponseDto extends HealthResponseDto {
  @ApiProperty({ example: 3600 })
  uptime: number;

  @ApiProperty({ example: 'production' })
  environment: string;

  @ApiProperty({
    example: {
      heapUsed: 45,
      heapTotal: 60,
      rss: 100,
      external: 5,
    },
  })
  memory: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
    external: number;
  };

  @ApiProperty({
    example: {
      load1m: 0.5,
      load5m: 0.6,
      load15m: 0.7,
    },
  })
  cpu: {
    load1m: number;
    load5m: number;
    load15m: number;
  };

  @ApiProperty({
    example: {
      platform: 'linux',
      arch: 'x64',
      cpus: 4,
      totalMemory: 16,
      freeMemory: 8,
    },
  })
  system: {
    platform: string;
    arch: string;
    cpus: number;
    totalMemory: number;
    freeMemory: number;
  };
}
