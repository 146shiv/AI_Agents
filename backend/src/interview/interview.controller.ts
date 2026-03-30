import { Controller, Post, Get, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InterviewService } from './interview.service';
import { StartInterviewDto } from './dto/start-interview.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Controller('interview')
@UseGuards(JwtAuthGuard)
export class InterviewController {
  constructor(private interviewService: InterviewService) {}

  @Post('start')
  start(@Body() dto: StartInterviewDto, @CurrentUser('sub') userId: string) {
    return this.interviewService.startSession(userId, dto);
  }

  @Get('sessions')
  listSessions(@CurrentUser('sub') userId: string) {
    return this.interviewService.listSessions(userId);
  }

  @Get('sessions/:id')
  getSession(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.interviewService.getSession(id, userId);
  }

  @Post('sessions/:id/answer')
  submitAnswer(
    @Param('id') sessionId: string,
    @Body() dto: SubmitAnswerDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.interviewService.submitAnswer(sessionId, userId, dto);
  }

  @Patch('sessions/:id/end')
  endSession(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.interviewService.endSession(id, userId);
  }
}
