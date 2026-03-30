import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResumeParserService } from './resume-parser.service';
import { ResumeScorerService } from './resume-scorer.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ResumeService {
  constructor(
    private prisma: PrismaService,
    private parser: ResumeParserService,
    private scorer: ResumeScorerService,
    private ai: AiService,
  ) {}

  async processResume(userId: string, file: Express.Multer.File) {
    const rawText = await this.parser.extractText(file.path, file.mimetype);
    const parsedData = await this.parser.parseResume(rawText);

    const resume = await this.prisma.resume.create({
      data: {
        userId,
        fileName: file.originalname,
        fileUrl: file.path,
        fileType: file.mimetype,
        rawText,
        parsedData: parsedData as any,
      },
    });

    const scores = this.scorer.scoreResume(parsedData, rawText);
    const suggestions = await this.ai.generateResumeSuggestions(parsedData, rawText);
    const weaknesses = this.scorer.detectWeaknesses(parsedData, scores);

    const analysis = await this.prisma.resumeAnalysis.create({
      data: {
        resumeId: resume.id,
        overallScore: scores.overall,
        keywordScore: scores.keywords,
        formattingScore: scores.formatting,
        experienceScore: scores.experience,
        skillDensity: scores.skillDensity,
        skills: parsedData.skills as any,
        experience: parsedData.experience as any,
        education: parsedData.education as any,
        projects: parsedData.projects as any,
        suggestions: suggestions as any,
        weaknesses: weaknesses as any,
        strengths: scores.strengths as any,
      },
    });

    return { resume, analysis };
  }

  async listResumes(userId: string) {
    return this.prisma.resume.findMany({
      where: { userId },
      include: { analysis: { select: { overallScore: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getResume(id: string, userId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id },
      include: { analysis: true },
    });
    if (!resume) throw new NotFoundException('Resume not found');
    if (resume.userId !== userId) throw new ForbiddenException();
    return resume;
  }

  async getAnalysis(resumeId: string, userId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
      include: { analysis: true },
    });
    if (!resume) throw new NotFoundException('Resume not found');
    if (resume.userId !== userId) throw new ForbiddenException();
    if (!resume.analysis) throw new NotFoundException('Analysis not found');
    return resume.analysis;
  }

  async reanalyze(resumeId: string, userId: string) {
    const resume = await this.prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume) throw new NotFoundException('Resume not found');
    if (resume.userId !== userId) throw new ForbiddenException();

    const parsedData = resume.parsedData as any;
    const rawText = resume.rawText || '';
    const scores = this.scorer.scoreResume(parsedData, rawText);
    const suggestions = await this.ai.generateResumeSuggestions(parsedData, rawText);
    const weaknesses = this.scorer.detectWeaknesses(parsedData, scores);

    return this.prisma.resumeAnalysis.upsert({
      where: { resumeId },
      update: {
        overallScore: scores.overall,
        keywordScore: scores.keywords,
        formattingScore: scores.formatting,
        experienceScore: scores.experience,
        skillDensity: scores.skillDensity,
        suggestions: suggestions as any,
        weaknesses: weaknesses as any,
        strengths: scores.strengths as any,
      },
      create: {
        resumeId,
        overallScore: scores.overall,
        keywordScore: scores.keywords,
        formattingScore: scores.formatting,
        experienceScore: scores.experience,
        skillDensity: scores.skillDensity,
        skills: parsedData.skills as any,
        experience: parsedData.experience as any,
        education: parsedData.education as any,
        projects: parsedData.projects as any,
        suggestions: suggestions as any,
        weaknesses: weaknesses as any,
        strengths: scores.strengths as any,
      },
    });
  }
}
