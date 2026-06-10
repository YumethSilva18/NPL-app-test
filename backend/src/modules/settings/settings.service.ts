import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.setting.findMany();

    // Convert array to object format expected by frontend
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    // Return with defaults if empty
    return {
      health_check_interval: settingsObj['health_check_interval'] || 30,
      low_risk_threshold: settingsObj['low_risk_threshold'] || 25,
      high_risk_threshold: settingsObj['high_risk_threshold'] || 60,
      show_success_notifications: settingsObj['show_success_notifications'] !== false,
      show_error_notifications: settingsObj['show_error_notifications'] !== false,
      email_alerts_enabled: settingsObj['email_alerts_enabled'] || false,
    };
  }

  async updateSettings(dto: UpdateSettingsDto) {
    // Update each setting
    const updates = Object.entries(dto).map(([key, value]) =>
      this.prisma.setting.upsert({
        where: { key },
        update: { value, updatedAt: new Date() },
        create: { key, value, category: 'user-preferences' },
      }),
    );

    await Promise.all(updates);

    return this.getSettings();
  }

  async getSetting(key: string): Promise<any> {
    const setting = await this.prisma.setting.findUnique({
      where: { key },
    });

    return setting?.value;
  }

  async setSetting(key: string, value: any, category: string = 'general') {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { key, value, category },
    });
  }
}
