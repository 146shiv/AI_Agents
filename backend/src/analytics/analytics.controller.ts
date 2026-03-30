import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  dashboard(@CurrentUser('sub') userId: string) {
    return this.analyticsService.getDashboard(userId);
  }

  @Get('resume-history')
  resumeHistory(@CurrentUser('sub') userId: string) {
    return this.analyticsService.getResumeScoreHistory(userId);
  }

  @Get('interview-performance')
  interviewPerformance(@CurrentUser('sub') userId: string) {
    return this.analyticsService.getInterviewPerformance(userId);
  }
}
