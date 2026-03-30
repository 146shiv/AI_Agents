import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JdMatchService } from './jd-match.service';
import { MatchJdDto } from './dto/match-jd.dto';

@Controller('jd-match')
@UseGuards(JwtAuthGuard)
export class JdMatchController {
  constructor(private jdMatchService: JdMatchService) {}

  @Post()
  match(@Body() dto: MatchJdDto, @CurrentUser('sub') userId: string) {
    return this.jdMatchService.matchResumeToJd(userId, dto);
  }

  @Get('history')
  history(@CurrentUser('sub') userId: string) {
    return this.jdMatchService.getMatchHistory(userId);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.jdMatchService.getMatch(id, userId);
  }
}
