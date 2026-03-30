import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }

  async chat(
    systemPrompt: string,
    userMessage: string,
    options?: { temperature?: number; maxTokens?: number },
  ): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
      });
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error('OpenAI chat error', (error as Error).message);
      throw error;
    }
  }

  async chatWithHistory(
    systemPrompt: string,
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: { temperature?: number; maxTokens?: number },
  ): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1500,
      });
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error('OpenAI chat error', (error as Error).message);
      throw error;
    }
  }

  async getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      this.logger.error('Embedding error', (error as Error).message);
      throw error;
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
      const response = await this.chat(systemPrompt, userMsg, {
        temperature: 0.5,
      });
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
}
