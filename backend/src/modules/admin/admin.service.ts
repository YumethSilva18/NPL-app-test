import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getModels() {
    return this.prisma.mLModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async reloadModels() {
    // Placeholder for model reload logic
    return {
      message: 'Model reload initiated',
      timestamp: new Date().toISOString(),
    };
  }

  async getSystemStats() {
    const [
      totalPredictions,
      totalUsers,
      recentPredictions,
      riskDistribution,
    ] = await Promise.all([
      this.prisma.prediction.count(),
      this.prisma.user.count(),
      this.prisma.prediction.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
      this.prisma.prediction.groupBy({
        by: ['riskLevel'],
        _count: true,
      }),
    ]);

    return {
      total_predictions: totalPredictions,
      total_users: totalUsers,
      predictions_24h: recentPredictions,
      risk_distribution: riskDistribution.reduce((acc, item) => {
        acc[item.riskLevel] = item._count;
        return acc;
      }, {}),
      timestamp: new Date().toISOString(),
    };
  }
}
