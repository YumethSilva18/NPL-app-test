import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PredictionController } from './prediction.controller';
import { PredictionService } from './prediction.service';
import { PredictionRepository } from './prediction.repository';
import { ModelService } from '../models/model.service';

@Module({
  imports: [HttpModule],
  controllers: [PredictionController],
  providers: [PredictionService, PredictionRepository, ModelService],
  exports: [PredictionService],
})
export class PredictionModule {}
