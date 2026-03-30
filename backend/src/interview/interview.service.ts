import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuestionGeneratorService } from '../ai/question-generator.service';
import { StartInterviewDto } from './dto/start-interview.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Injectable()
export class InterviewService {
  constructor(
    private prisma: PrismaService,
    private questionGen: QuestionGeneratorService,
  ) {}

  async startSession(userId: string, dto: StartInterviewDto) {
    let resumeData: any = {};

    if (dto.resumeId) {
      const resume = await this.prisma.resume.findUnique({
        where: { id: dto.resumeId },
      });
      if (!resume) throw new NotFoundException('Resume not found');
      if (resume.userId !== userId) throw new ForbiddenException();
      resumeData = resume.parsedData || {};
    }

    const count = dto.questionCount || 10;
    let questions;

    if (dto.jdId) {
      const jd = await this.prisma.jobDescription.findUnique({
        where: { id: dto.jdId },
      });
      if (!jd) throw new NotFoundException('Job description not found');
      questions = await this.questionGen.generateFromJD(jd.description, resumeData, count);
    } else {
      questions = await this.questionGen.generateFromResume(resumeData, count);
    }

    const session = await this.prisma.interviewSession.create({
      data: {
        userId,
        resumeId: dto.resumeId,
        jdId: dto.jdId,
        type: dto.type || 'mixed',
        status: 'in_progress',
      },
    });

    const created = await Promise.all(
      questions.map((q, idx) =>
        this.prisma.question.create({
          data: {
            sessionId: session.id,
            content: q.content,
            type: q.type,
            difficulty: q.difficulty,
            orderIndex: idx,
          },
        }),
      ),
    );

    return { session, questions: created };
  }

  async listSessions(userId: string) {
    return this.prisma.interviewSession.findMany({
      where: { userId },
      include: {
        questions: { select: { id: true, type: true }, orderBy: { orderIndex: 'asc' } },
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  async getSession(id: string, userId: string) {
    const session = await this.prisma.interviewSession.findUnique({
      where: { id },
      include: {
        questions: { include: { answer: true }, orderBy: { orderIndex: 'asc' } },
      },
    });
    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException();
    return session;
  }

  async submitAnswer(sessionId: string, userId: string, dto: SubmitAnswerDto) {
    const session = await this.prisma.interviewSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException();
    if (session.status !== 'in_progress')
      throw new BadRequestException('Session is not active');

    const question = await this.prisma.question.findUnique({
      where: { id: dto.questionId },
    });
    if (!question || question.sessionId !== sessionId)
      throw new NotFoundException('Question not found in this session');

    const evaluation = await this.questionGen.evaluateAnswer(
      question.content,
      dto.answer,
      question.type,
    );

    const answer = await this.prisma.answer.create({
      data: {
        questionId: dto.questionId,
        content: dto.answer,
        score: evaluation.score,
        feedback: evaluation.feedback,
        confidence: evaluation.confidence,
        accuracy: evaluation.accuracy,
        clarity: evaluation.clarity,
      },
    });

    return { answer, evaluation };
  }

  async endSession(id: string, userId: string) {
    const session = await this.prisma.interviewSession.findUnique({
      where: { id },
      include: { questions: { include: { answer: true } } },
    });
    if (!session) throw new NotFoundException('Session not found');
    if (session.userId !== userId) throw new ForbiddenException();

    const answers = session.questions.map((q) => q.answer).filter(Boolean);
    const len = answers.length || 1;

    const avg = (fn: (a: any) => number) =>
      Math.round(answers.reduce((s, a) => s + fn(a!), 0) / len);

    return this.prisma.interviewSession.update({
      where: { id },
      data: {
        status: 'completed',
        endedAt: new Date(),
        overallScore: avg((a) => a.score || 0),
        confidence: avg((a) => a.confidence || 0),
        accuracy: avg((a) => a.accuracy || 0),
        clarity: avg((a) => a.clarity || 0),
        feedback: {
          totalQuestions: session.questions.length,
          answeredQuestions: answers.length,
          averageScore: avg((a) => a.score || 0),
        },
      },
    });
  }
}
