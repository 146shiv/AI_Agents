import { Injectable } from '@nestjs/common';
import { AiService } from './ai.service';

@Injectable()
export class SuggestionsService {
  constructor(private ai: AiService) {}

  async improveBulletPoints(bullets: string[]): Promise<string[]> {
    const systemPrompt = `You are an expert resume writer. Improve these resume bullet points.
Rules: Start with strong action verbs, include quantifiable metrics, max 2 lines each, focus on impact.
Return ONLY a JSON array of improved bullet strings.`;

    const userMsg = `Original bullets:\n${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}`;

    try {
      const response = await this.ai.chat(systemPrompt, userMsg, {
        temperature: 0.6,
      });
      return this.ai.parseJsonArray(response);
    } catch {
      return bullets;
    }
  }

  async rewriteSection(
    sectionName: string,
    content: string,
    targetRole?: string,
  ): Promise<string> {
    const systemPrompt = `You are an expert resume writer. Rewrite this ${sectionName} section to be more professional and ATS-optimized.
${targetRole ? `Target role: ${targetRole}` : ''}
Keep the same information but improve wording, structure, and impact.`;

    return this.ai.chat(systemPrompt, content, { temperature: 0.6 });
  }

  async suggestKeywords(
    currentSkills: string[],
    targetRole?: string,
  ): Promise<string[]> {
    const systemPrompt = `You are an ATS expert. Suggest additional keywords for this resume.
Return ONLY a JSON array of keyword strings (max 15).`;

    const userMsg = `Current skills: ${currentSkills.join(', ')}${targetRole ? `\nTarget role: ${targetRole}` : ''}`;

    try {
      const response = await this.ai.chat(systemPrompt, userMsg, {
        temperature: 0.5,
      });
      return this.ai.parseJsonArray(response);
    } catch {
      return [];
    }
  }
}
