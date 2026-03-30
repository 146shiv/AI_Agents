import { Module } from '@nestjs/common';
import { JdMatchController } from './jd-match.controller';
import { JdMatchService } from './jd-match.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [JdMatchController],
  providers: [JdMatchService],
  exports: [JdMatchService],
})
export class JdMatchModule {}
