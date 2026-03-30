import { Injectable, Logger } from '@nestjs/common';
import { AiService } from './ai.service';

@Injectable()
export class EmbeddingsService {
  private readonly logger = new Logger(EmbeddingsService.name);

  constructor(private ai: AiService) {}

  async computeSimilarity(textA: string, textB: string): Promise<number> {
    try {
      const [embA, embB] = await Promise.all([
        this.ai.getEmbedding(textA.slice(0, 8000)),
        this.ai.getEmbedding(textB.slice(0, 8000)),
      ]);
      return this.cosineSimilarity(embA, embB);
    } catch {
      this.logger.warn('Embedding API unavailable, using fallback similarity');
      return this.jaccardSimilarity(textA, textB);
    }
  }

  async findMatchingSkills(
    resumeSkills: string[],
    jdText: string,
  ): Promise<{ matched: string[]; missing: string[] }> {
    const jdLower = jdText.toLowerCase();
    const matched: string[] = [];

    for (const skill of resumeSkills) {
      if (jdLower.includes(skill.toLowerCase())) {
        matched.push(skill);
      }
    }

    const jdSkills = this.extractSkillsFromText(jdText);
    const resumeLower = new Set(resumeSkills.map((s) => s.toLowerCase()));
    const matchedLower = new Set(matched.map((m) => m.toLowerCase()));

    const missing = jdSkills.filter(
      (skill) =>
        !resumeLower.has(skill.toLowerCase()) &&
        !matchedLower.has(skill.toLowerCase()),
    );

    return { matched, missing };
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }

  private jaccardSimilarity(textA: string, textB: string): number {
    const wordsA = new Set(textA.toLowerCase().split(/\W+/).filter(Boolean));
    const wordsB = new Set(textB.toLowerCase().split(/\W+/).filter(Boolean));
    let intersection = 0;
    for (const word of wordsA) {
      if (wordsB.has(word)) intersection++;
    }
    const union = new Set([...wordsA, ...wordsB]).size;
    return union === 0 ? 0 : intersection / union;
  }

  private extractSkillsFromText(text: string): string[] {
    const KNOWN_SKILLS = [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust',
      'ruby', 'php', 'swift', 'kotlin', 'react', 'angular', 'vue', 'next.js',
      'node.js', 'express', 'nestjs', 'django', 'flask', 'spring boot',
      'html', 'css', 'tailwind', 'sass', 'postgresql', 'mysql', 'mongodb',
      'redis', 'elasticsearch', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
      'terraform', 'ci/cd', 'git', 'linux', 'rest api', 'graphql',
      'microservices', 'machine learning', 'deep learning', 'nlp',
      'tensorflow', 'pytorch', 'sql', 'nosql', 'data structures',
      'algorithms', 'system design', 'agile', 'scrum',
    ];
    const lower = text.toLowerCase();
    return KNOWN_SKILLS.filter((skill) => lower.includes(skill));
  }
}
