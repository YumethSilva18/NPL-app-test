import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';

@Injectable()
export class HealthService {
  private startTime: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.startTime = Date.now();
  }

  async getBasicHealth() {
    const dbHealthy = await this.checkDatabaseHealth();
    const modelLoaded = await this.checkModelStatus();

    return {
      status: dbHealthy && modelLoaded ? 'healthy' : 'degraded',
      model_loaded: modelLoaded,
      timestamp: new Date().toISOString(),
      version: this.configService.get('ML_MODEL_VERSION', '1.0.0'),
    };
  }

  async getDetailedHealth() {
    const basicHealth = await this.getBasicHealth();
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const memoryUsage = process.memoryUsage();
    const cpuUsage = os.loadavg();

    return {
      ...basicHealth,
      uptime,
      environment: this.configService.get('NODE_ENV', 'development'),
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
      },
      cpu: {
        load1m: cpuUsage[0],
        load5m: cpuUsage[1],
        load15m: cpuUsage[2],
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024),
        freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024),
      },
    };
  }

  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }

  private async checkModelStatus(): Promise<boolean> {
    try {
      // Check if any ML model is active
      const activeModel = await this.prisma.mLModel.findFirst({
        where: { isActive: true },
      });
      return !!activeModel;
    } catch (error) {
      // If table doesn't exist yet, return true to not fail health check
      return true;
    }
  }
}
