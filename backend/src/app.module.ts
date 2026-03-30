import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ResumeModule } from './resume/resume.module';
import { AiModule } from './ai/ai.module';
import { JdMatchModule } from './jd-match/jd-match.module';
import { InterviewModule } from './interview/interview.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    AiModule,
    ResumeModule,
    JdMatchModule,
    InterviewModule,
    AnalyticsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
