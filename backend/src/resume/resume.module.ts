import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { ResumeParserService } from './resume-parser.service';
import { ResumeScorerService } from './resume-scorer.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [ResumeController],
  providers: [ResumeService, ResumeParserService, ResumeScorerService],
  exports: [ResumeService],
})
export class ResumeModule {}
