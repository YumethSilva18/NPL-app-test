import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PredictionService } from './prediction.service';
import { PredictionRequestDto } from './dto/prediction-request.dto';
import { PredictionResponseDto } from './dto/prediction-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('predictions')
@Controller('predict')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post()
  @ApiOperation({ summary: 'Create NPL risk prediction' })
  @ApiResponse({ 
    status: 201, 
    description: 'Prediction created successfully',
    type: PredictionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 503, description: 'ML service unavailable' })
  // @UseGuards(JwtAuthGuard) // Uncomment when auth is ready
  // @ApiBearerAuth()
  async predict(
    @Body() predictionDto: PredictionRequestDto,
    @Req() request?: any,
  ): Promise<PredictionResponseDto> {
    const userId = request?.user?.id;
    return this.predictionService.createPrediction(predictionDto, userId);
  }
}
