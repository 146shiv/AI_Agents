import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { InterviewGateway } from './interview.gateway';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [InterviewController],
  providers: [InterviewService, InterviewGateway],
  exports: [InterviewService],
})
export class InterviewModule {}
