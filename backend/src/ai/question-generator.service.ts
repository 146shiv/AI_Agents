import { Injectable } from '@nestjs/common';
import { AiService } from './ai.service';

export interface GeneratedQuestion {
  content: string;
  type: 'technical' | 'behavioral' | 'hr';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AnswerEvaluation {
  score: number;
  feedback: string;
  confidence: number;
  accuracy: number;
  clarity: number;
}

@Injectable()
export class QuestionGeneratorService {
  constructor(private ai: AiService) {}

  async generateFromResume(
    resumeData: any,
    count: number = 10,
  ): Promise<GeneratedQuestion[]> {
    const systemPrompt = `You are an expert technical interviewer. Generate exactly ${count} interview questions based on the candidate's resume.
Mix of: technical (based on listed skills), behavioral (STAR method), HR (culture fit).
Return ONLY a JSON array of objects with: content, type ("technical"|"behavioral"|"hr"), difficulty ("easy"|"medium"|"hard")`;

    const userMsg = this.buildResumeContext(resumeData);

    try {
      const response = await this.ai.chat(systemPrompt, userMsg, {
        temperature: 0.7,
      });
      const parsed = this.ai.parseJsonArray(response);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        return parsed as unknown as GeneratedQuestion[];
      }
    } catch {
      /* fallback */
    }
    return this.getFallbackQuestions(resumeData, count);
  }

  async generateFromJD(
    jdText: string,
    resumeData: any,
    count: number = 10,
  ): Promise<GeneratedQuestion[]> {
    const systemPrompt = `You are an expert interviewer. Generate ${count} interview questions based on this job description and candidate's resume.
Focus on: skill gaps, technical depth on overlapping skills, behavioral questions for the role.
Return ONLY a JSON array of objects with: content, type ("technical"|"behavioral"|"hr"), difficulty ("easy"|"medium"|"hard")`;

    const userMsg = `Job Description:\n${jdText.slice(0, 2000)}\n\n${this.buildResumeContext(resumeData)}`;

    try {
      const response = await this.ai.chat(systemPrompt, userMsg, {
        temperature: 0.7,
      });
      const parsed = this.ai.parseJsonArray(response);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        return parsed as unknown as GeneratedQuestion[];
      }
    } catch {
      /* fallback */
    }
    return this.getFallbackQuestions(resumeData, count);
  }

  async evaluateAnswer(
    question: string,
    answer: string,
    type: string,
  ): Promise<AnswerEvaluation> {
    const systemPrompt = `You are an expert interviewer evaluating a candidate's answer.
Score on these criteria (0-100 each): score (overall), confidence, accuracy, clarity.
Provide brief constructive feedback.
Return ONLY a JSON object with: score, confidence, accuracy, clarity, feedback (string)`;

    const userMsg = `Question (${type}): ${question}\n\nCandidate's Answer: ${answer}`;

    try {
      const response = await this.ai.chat(systemPrompt, userMsg, {
        temperature: 0.3,
      });
      const match = response.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return {
          score: Number(parsed.score) || 60,
          feedback: String(parsed.feedback || ''),
          confidence: Number(parsed.confidence) || 60,
          accuracy: Number(parsed.accuracy) || 60,
          clarity: Number(parsed.clarity) || 60,
        };
      }
    } catch {
      /* fallback */
    }
    return {
      score: 60,
      feedback: 'Unable to evaluate at this time. Please try again.',
      confidence: 60,
      accuracy: 60,
      clarity: 60,
    };
  }

  private buildResumeContext(resumeData: any): string {
    return `Skills: ${JSON.stringify(resumeData.skills || [])}
Experience: ${JSON.stringify((resumeData.experience || []).map((e: any) => `${e.title} at ${e.company}`))}
Education: ${JSON.stringify((resumeData.education || []).map((e: any) => e.degree))}
Projects: ${JSON.stringify((resumeData.projects || []).map((p: any) => p.name))}`;
  }

  private getFallbackQuestions(
    resumeData: any,
    count: number,
  ): GeneratedQuestion[] {
    const questions: GeneratedQuestion[] = [
      { content: 'Tell me about yourself and your background.', type: 'hr', difficulty: 'easy' },
      { content: 'What is your greatest professional strength?', type: 'behavioral', difficulty: 'easy' },
      { content: 'Describe a challenging project and how you overcame obstacles.', type: 'behavioral', difficulty: 'medium' },
      { content: 'Where do you see yourself in 5 years?', type: 'hr', difficulty: 'easy' },
      { content: 'Why are you interested in this role?', type: 'hr', difficulty: 'easy' },
      { content: 'Describe a time you had to learn a new technology quickly.', type: 'behavioral', difficulty: 'medium' },
      { content: 'How do you handle disagreements with team members?', type: 'behavioral', difficulty: 'medium' },
      { content: 'What is your approach to debugging complex issues?', type: 'technical', difficulty: 'medium' },
    ];

    const skills = resumeData.skills || [];
    for (const skill of skills.slice(0, 5)) {
      questions.push({
        content: `Explain your experience with ${skill} and how you have used it in production.`,
        type: 'technical',
        difficulty: 'medium',
      });
    }

    return questions.slice(0, count);
  }
}
