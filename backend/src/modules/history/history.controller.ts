import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { HistoryQueryDto } from './dto/history-query.dto';
import { PredictionHistoryDto } from './dto/prediction-history.dto';

@ApiTags('history')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get prediction history with filters and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'risk_level', required: false, enum: ['Low', 'Medium', 'High'] })
  @ApiQuery({ name: 'decision_hint', required: false, enum: ['Approve', 'Review', 'Escalate', 'Decline'] })
  @ApiQuery({ name: 'date_from', required: false, type: String })
  @ApiQuery({ name: 'date_to', required: false, type: String })
  @ApiResponse({ 
    status: 200, 
    description: 'Prediction history retrieved successfully',
    type: [PredictionHistoryDto],
  })
  async getHistory(@Query() query: HistoryQueryDto) {
    return this.historyService.getHistory(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prediction details by ID' })
  @ApiResponse({ status: 200, description: 'Prediction details retrieved' })
  @ApiResponse({ status: 404, description: 'Prediction not found' })
  async getPredictionById(@Param('id') id: string) {
    return this.historyService.getPredictionById(id);
  }
}
