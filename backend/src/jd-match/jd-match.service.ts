import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingsService } from '../ai/embeddings.service';
import { AiService } from '../ai/ai.service';
import { MatchJdDto } from './dto/match-jd.dto';

@Injectable()
export class JdMatchService {
  constructor(
    private prisma: PrismaService,
    private embeddings: EmbeddingsService,
    private ai: AiService,
  ) {}

  async matchResumeToJd(userId: string, dto: MatchJdDto) {
    const resume = await this.prisma.resume.findUnique({
      where: { id: dto.resumeId },
    });
    if (!resume) throw new NotFoundException('Resume not found');
    if (resume.userId !== userId) throw new ForbiddenException();

    const jd = await this.prisma.jobDescription.create({
      data: {
        userId,
        title: dto.jobTitle,
        company: dto.company,
        description: dto.description,
      },
    });

    const resumeSkills = (resume.parsedData as any)?.skills || [];
    const { matched, missing } = await this.embeddings.findMatchingSkills(
      resumeSkills,
      dto.description,
    );

    const similarity = await this.embeddings.computeSimilarity(
      resume.rawText || '',
      dto.description,
    );
    const matchScore = Math.round(similarity * 100);

    const suggestions = await this.generateSuggestions(matched, missing, matchScore);

    const match = await this.prisma.jDMatch.create({
      data: {
        resumeId: resume.id,
        jdId: jd.id,
        matchScore,
        matchedSkills: matched as any,
        missingSkills: missing as any,
        suggestions: suggestions as any,
      },
    });

    return { ...match, jobDescription: jd };
  }

  async getMatchHistory(userId: string) {
    const resumeIds = (
      await this.prisma.resume.findMany({
        where: { userId },
        select: { id: true },
      })
    ).map((r) => r.id);

    return this.prisma.jDMatch.findMany({
      where: { resumeId: { in: resumeIds } },
      include: {
        jobDescription: { select: { title: true, company: true } },
        resume: { select: { fileName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMatch(id: string, userId: string) {
    const match = await this.prisma.jDMatch.findUnique({
      where: { id },
      include: {
        jobDescription: true,
        resume: { select: { userId: true, fileName: true, parsedData: true } },
      },
    });
    if (!match) throw new NotFoundException('Match not found');
    if (match.resume.userId !== userId) throw new ForbiddenException();
    return match;
  }

  private async generateSuggestions(
    matched: string[],
    missing: string[],
    score: number,
  ): Promise<string[]> {
    try {
      const systemPrompt = `You are a career coach. Provide specific suggestions to improve this resume-to-JD match.
Return ONLY a JSON array of actionable suggestion strings (max 8).`;
      const userMsg = `Match score: ${score}%\nMatched skills: ${matched.join(', ')}\nMissing skills: ${missing.join(', ')}`;
      const response = await this.ai.chat(systemPrompt, userMsg, { temperature: 0.5 });
      return this.ai.parseJsonArray(response);
    } catch {
      const s: string[] = [];
      if (missing.length > 0)
        s.push(`Add these missing skills: ${missing.slice(0, 5).join(', ')}`);
      if (score < 50)
        s.push('Consider tailoring your resume specifically for this role');
      if (matched.length < 3)
        s.push('Highlight more transferable skills relevant to this position');
      return s;
    }
  }
}
