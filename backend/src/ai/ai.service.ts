import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  GoogleGenerativeAI,
  GoogleGenerativeAIError,
} from '@google/generative-ai';

/** Stable Flash model for generateContent (1.5 IDs return 404 on current API). Override with GEMINI_MODEL if needed. */
const DEFAULT_GEMINI_TEXT_MODEL = 'gemini-2.5-flash';
const GEMINI_EMBEDDING_MODEL = 'text-embedding-004';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly textModelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY ?? '';
    if (!apiKey) {
      this.logger.warn(
        'GEMINI_API_KEY is not set; AI requests will fail until configured.',
      );
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.textModelName =
      process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_TEXT_MODEL;
  }

  /**
   * Single-call text generation (full prompt, no separate system role).
   */
  async generateText(
    prompt: string,
    options?: { temperature?: number; maxOutputTokens?: number },
  ): Promise<string> {
    this.assertGeminiConfigured();
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.textModelName,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxOutputTokens ?? 8192,
        },
      });
      const result = await model.generateContent(prompt);
      return result.response.text() || '';
    } catch (error) {
      this.logGeminiError('generateText', error);
      throw this.toHttpFriendlyError(error);
    }
  }

  async chat(
    systemPrompt: string,
    userMessage: string,
    options?: { temperature?: number; maxTokens?: number },
  ): Promise<string> {
    this.assertGeminiConfigured();
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.textModelName,
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? 2000,
        },
      });
      const result = await model.generateContent(userMessage);
      return result.response.text() || '';
    } catch (error) {
      this.logGeminiError('chat', error);
      throw this.toHttpFriendlyError(error);
    }
  }

  async chatWithHistory(
    systemPrompt: string,
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: { temperature?: number; maxTokens?: number },
  ): Promise<string> {
    this.assertGeminiConfigured();
    if (messages.length === 0) {
      return '';
    }
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.textModelName,
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? 1500,
        },
      });
      const contents = messages.map((m) => ({
        role: m.role === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: m.content }],
      }));
      const result = await model.generateContent({ contents });
      return result.response.text() || '';
    } catch (error) {
      this.logGeminiError('chatWithHistory', error);
      throw this.toHttpFriendlyError(error);
    }
  }

  async getEmbedding(text: string): Promise<number[]> {
    this.assertGeminiConfigured();
    try {
      const model = this.genAI.getGenerativeModel({
        model: GEMINI_EMBEDDING_MODEL,
      });
      const result = await model.embedContent(text.slice(0, 8000));
      return result.embedding.values;
    } catch (error) {
      this.logGeminiError('getEmbedding', error);
      throw this.toHttpFriendlyError(error);
    }
  }

  async generateResumeSuggestions(
    parsedData: any,
    rawText: string,
  ): Promise<string[]> {
    const systemPrompt = `You are an expert resume reviewer and ATS optimization specialist.
Analyze this resume and provide specific, actionable improvement suggestions.
Return ONLY a JSON array of suggestion strings. Each suggestion should be specific and actionable.
Focus on: keyword optimization, bullet point improvements, missing sections, quantification of achievements.`;

    const userMsg = `Resume Content:\n${rawText.slice(0, 3000)}\n\nExtracted Skills: ${JSON.stringify(parsedData.skills)}\nExperience entries: ${parsedData.experience?.length || 0}\nEducation entries: ${parsedData.education?.length || 0}\nProjects: ${parsedData.projects?.length || 0}`;

    try {
      const response = await this.generateText(
        `${systemPrompt}\n\n${userMsg}`,
        { temperature: 0.5, maxOutputTokens: 2000 },
      );
      return this.parseJsonArray(response);
    } catch {
      return this.getFallbackSuggestions(parsedData);
    }
  }

  parseJsonArray(response: string): string[] {
    try {
      const match = response.match(/\[[\s\S]*\]/);
      if (match) return JSON.parse(match[0]);
    } catch {
      /* fall through */
    }
    return response
      .split('\n')
      .filter(
        (line) =>
          line.trim().startsWith('-') || line.trim().match(/^\d+\./),
      )
      .map((line) => line.replace(/^[\s\-\d.]+/, '').trim())
      .filter(Boolean);
  }

  private getFallbackSuggestions(parsedData: any): string[] {
    const suggestions: string[] = [];
    if (!parsedData.skills || parsedData.skills.length < 5)
      suggestions.push('Add more technical skills to improve ATS matching');
    if (!parsedData.summary)
      suggestions.push('Add a professional summary at the top of your resume');
    if (!parsedData.experience?.length)
      suggestions.push('Add work experience or internship details');
    if (!parsedData.projects?.length)
      suggestions.push('Include relevant projects to demonstrate practical skills');
    suggestions.push('Use action verbs at the start of each bullet point');
    suggestions.push('Quantify achievements with specific numbers and percentages');
    return suggestions;
  }

  private assertGeminiConfigured(): void {
    if (!process.env.GEMINI_API_KEY?.trim()) {
      throw new InternalServerErrorException(
        'AI is not configured: set GEMINI_API_KEY in the environment.',
      );
    }
  }

  private logGeminiError(context: string, error: unknown): void {
    const message =
      error instanceof Error ? error.message : String(error);
    this.logger.error(`Gemini ${context} error: ${message}`);
  }

  private toHttpFriendlyError(error: unknown): Error {
    if (error instanceof InternalServerErrorException) {
      return error;
    }
    if (error instanceof GoogleGenerativeAIError) {
      return new InternalServerErrorException(error.message);
    }
    return error instanceof Error ? error : new Error(String(error));
  }
}
