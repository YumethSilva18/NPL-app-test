import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('admin')
@Controller('admin')
// @UseGuards(JwtAuthGuard) // Uncomment when ready
// @ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('models')
  @ApiOperation({ summary: 'Get all registered ML models' })
  async getModels() {
    return this.adminService.getModels();
  }

  @Post('models/reload')
  @ApiOperation({ summary: 'Reload ML model configuration' })
  async reloadModels() {
    return this.adminService.reloadModels();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get system statistics' })
  async getStats() {
    return this.adminService.getSystemStats();
  }
}
