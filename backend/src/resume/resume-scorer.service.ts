import { Injectable } from '@nestjs/common';
import { ParsedResume } from './resume-parser.service';

export interface ResumeScores {
  overall: number;
  keywords: number;
  formatting: number;
  experience: number;
  skillDensity: number;
  strengths: string[];
}

@Injectable()
export class ResumeScorerService {
  scoreResume(parsed: ParsedResume, rawText: string): ResumeScores {
    const keywords = this.scoreKeywords(parsed);
    const formatting = this.scoreFormatting(rawText, parsed);
    const experience = this.scoreExperience(parsed);
    const skillDensity = this.scoreSkillDensity(parsed, rawText);

    const overall = Math.round(
      keywords * 0.3 +
        formatting * 0.2 +
        experience * 0.3 +
        skillDensity * 0.2,
    );

    const strengths = this.identifyStrengths(parsed, {
      keywords,
      formatting,
      experience,
      skillDensity,
    });

    return { overall, keywords, formatting, experience, skillDensity, strengths };
  }

  detectWeaknesses(parsed: ParsedResume, scores: ResumeScores): string[] {
    const w: string[] = [];

    if (scores.keywords < 50)
      w.push('Low keyword density — add more industry-relevant technical terms');
    if (scores.formatting < 50)
      w.push('Formatting needs work — use clear section headers and consistent structure');
    if (scores.experience < 50)
      w.push('Experience section is weak — use action verbs and quantify achievements');
    if (parsed.skills.length < 5)
      w.push('Too few skills listed — expand your technical skills section');
    if (!parsed.experience.length)
      w.push('No work experience detected — add internships, freelance, or projects');
    if (!parsed.projects.length)
      w.push('No projects listed — showcase practical skills with project details');
    if (!parsed.summary)
      w.push('Missing professional summary — add a 2-3 line summary at the top');
    if (!parsed.contactInfo.linkedin)
      w.push('Missing LinkedIn profile link');
    if (!parsed.contactInfo.github)
      w.push('Missing GitHub profile — important for tech roles');

    const hasMetrics = parsed.experience.some((exp) =>
      exp.bullets.some((b) =>
        /\d+%|\d+x|\$[\d,]+|\d+\s*(users|customers|requests)/i.test(b),
      ),
    );
    if (!hasMetrics && parsed.experience.length > 0)
      w.push('Bullets lack metrics — quantify impact with numbers and percentages');

    return w;
  }

  private scoreKeywords(parsed: ParsedResume): number {
    const count = parsed.skills.length;
    if (count >= 15) return 95;
    if (count >= 10) return 80;
    if (count >= 7) return 65;
    if (count >= 4) return 50;
    if (count >= 2) return 35;
    return 15;
  }

  private scoreFormatting(rawText: string, parsed: ParsedResume): number {
    let score = 50;
    if (parsed.contactInfo.email) score += 10;
    if (parsed.contactInfo.phone) score += 5;
    if (parsed.contactInfo.linkedin) score += 5;

    const sectionCount = Object.keys(parsed.rawSections).length;
    score += sectionCount >= 4 ? 15 : sectionCount >= 3 ? 10 : 0;

    if (parsed.experience.some((e) => e.bullets.length > 0)) score += 10;

    const lines = rawText.split('\n').length;
    if (lines >= 20 && lines <= 80) score += 5;

    return Math.min(100, score);
  }

  private scoreExperience(parsed: ParsedResume): number {
    let score = 20;
    score += Math.min(30, parsed.experience.length * 15);

    const totalBullets = parsed.experience.reduce(
      (acc, e) => acc + e.bullets.length,
      0,
    );
    score += Math.min(20, totalBullets * 3);

    const actionVerbs =
      /\b(developed|built|designed|implemented|led|managed|created|optimized|improved|increased|reduced|launched|deployed|architected|mentored|automated|streamlined)\b/i;
    if (parsed.experience.some((e) => e.bullets.some((b) => actionVerbs.test(b))))
      score += 15;

    if (parsed.experience.some((e) => e.duration)) score += 5;
    score += Math.min(10, parsed.education.length * 5);

    return Math.min(100, score);
  }

  private scoreSkillDensity(parsed: ParsedResume, rawText: string): number {
    const wordCount = rawText.split(/\s+/).length;
    if (wordCount === 0) return 0;

    let mentions = 0;
    for (const skill of parsed.skills) {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'gi');
      mentions += (rawText.match(regex) || []).length;
    }

    const density = (mentions / wordCount) * 100;
    if (density >= 8) return 95;
    if (density >= 5) return 80;
    if (density >= 3) return 65;
    if (density >= 1.5) return 50;
    return 30;
  }

  private identifyStrengths(
    parsed: ParsedResume,
    scores: Record<string, number>,
  ): string[] {
    const s: string[] = [];
    if (scores.keywords >= 70) s.push('Strong keyword optimization');
    if (scores.formatting >= 70) s.push('Well-formatted resume');
    if (scores.experience >= 70) s.push('Solid experience section');
    if (scores.skillDensity >= 70) s.push('Good skill density throughout');
    if (parsed.skills.length >= 10) s.push('Diverse technical skill set');
    if (parsed.projects.length >= 2) s.push('Good project portfolio');
    if (parsed.contactInfo.github && parsed.contactInfo.linkedin)
      s.push('Complete professional links');
    return s;
  }
}
