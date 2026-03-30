import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const [resumeCount, latestResume, interviewCount, completed, jdMatchCount] =
      await Promise.all([
        this.prisma.resume.count({ where: { userId } }),
        this.prisma.resume.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          include: {
            analysis: { select: { overallScore: true, strengths: true, weaknesses: true } },
          },
        }),
        this.prisma.interviewSession.count({ where: { userId } }),
        this.prisma.interviewSession.findMany({
          where: { userId, status: 'completed' },
          select: { overallScore: true, confidence: true, accuracy: true, clarity: true, startedAt: true },
          orderBy: { startedAt: 'desc' },
          take: 10,
        }),
        this.prisma.jDMatch.count({ where: { resume: { userId } } }),
      ]);

    const avgInterview =
      completed.length > 0
        ? Math.round(completed.reduce((s, i) => s + (i.overallScore || 0), 0) / completed.length)
        : null;

    return {
      summary: {
        totalResumes: resumeCount,
        totalInterviews: interviewCount,
        totalJdMatches: jdMatchCount,
        latestResumeScore: latestResume?.analysis?.overallScore || null,
        avgInterviewScore: avgInterview,
      },
      latestResume: latestResume
        ? {
            id: latestResume.id,
            fileName: latestResume.fileName,
            score: latestResume.analysis?.overallScore,
            strengths: latestResume.analysis?.strengths,
            weaknesses: latestResume.analysis?.weaknesses,
          }
        : null,
      recentInterviews: completed.map((i) => ({
        score: i.overallScore,
        confidence: i.confidence,
        accuracy: i.accuracy,
        clarity: i.clarity,
        date: i.startedAt,
      })),
    };
  }

  async getResumeScoreHistory(userId: string) {
    const resumes = await this.prisma.resume.findMany({
      where: { userId },
      include: {
        analysis: {
          select: {
            overallScore: true, keywordScore: true, formattingScore: true,
            experienceScore: true, skillDensity: true, createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return resumes
      .filter((r) => r.analysis)
      .map((r) => ({
        resumeId: r.id,
        fileName: r.fileName,
        version: r.version,
        date: r.analysis!.createdAt,
        scores: {
          overall: r.analysis!.overallScore,
          keywords: r.analysis!.keywordScore,
          formatting: r.analysis!.formattingScore,
          experience: r.analysis!.experienceScore,
          skillDensity: r.analysis!.skillDensity,
        },
      }));
  }

  async getInterviewPerformance(userId: string) {
    const sessions = await this.prisma.interviewSession.findMany({
      where: { userId, status: 'completed' },
      include: { questions: { include: { answer: true }, orderBy: { orderIndex: 'asc' } } },
      orderBy: { startedAt: 'desc' },
      take: 20,
    });

    return sessions.map((s) => {
      const answers = s.questions.map((q) => q.answer).filter(Boolean);
      const byType: Record<string, number[]> = { technical: [], behavioral: [], hr: [] };

      s.questions.forEach((q) => {
        if (q.answer?.score != null && byType[q.type]) {
          byType[q.type].push(q.answer.score);
        }
      });

      const avg = (arr: number[]) =>
        arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;

      return {
        sessionId: s.id,
        type: s.type,
        date: s.startedAt,
        overallScore: s.overallScore,
        confidence: s.confidence,
        accuracy: s.accuracy,
        clarity: s.clarity,
        questionCount: s.questions.length,
        answeredCount: answers.length,
        scoresByType: {
          technical: avg(byType.technical),
          behavioral: avg(byType.behavioral),
          hr: avg(byType.hr),
        },
      };
    });
  }
}
