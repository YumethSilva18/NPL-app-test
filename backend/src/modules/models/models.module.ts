import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ModelService } from './model.service';

@Module({
  imports: [HttpModule],
  providers: [ModelService],
  exports: [ModelService],
})
export class ModelsModule {}
