import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

export interface ParsedResume {
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  contactInfo: ContactInfo;
  summary: string;
  rawSections: Record<string, string>;
}

interface ExperienceEntry {
  title: string;
  company: string;
  duration: string;
  bullets: string[];
}

interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

interface ProjectEntry {
  name: string;
  description: string;
  technologies: string[];
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
}

const KNOWN_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust',
  'ruby', 'php', 'swift', 'kotlin', 'react', 'angular', 'vue', 'next.js',
  'node.js', 'express', 'nestjs', 'django', 'flask', 'spring', 'spring boot',
  'html', 'css', 'tailwind', 'sass', 'bootstrap', 'material ui',
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'firebase',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
  'ci/cd', 'git', 'github', 'gitlab', 'linux', 'rest', 'graphql',
  'microservices', 'agile', 'scrum', 'jira',
  'machine learning', 'deep learning', 'nlp', 'computer vision',
  'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn',
  'sql', 'nosql', 'data structures', 'algorithms', 'system design',
  'figma', 'photoshop', 'illustrator',
];

const SECTION_PATTERNS: Record<string, RegExp> = {
  experience: /\b(experience|work\s*history|employment|professional\s*experience)\b/i,
  education: /\b(education|academic|qualification|degree)\b/i,
  skills: /\b(skills|technical\s*skills|technologies|competencies|proficiencies)\b/i,
  projects: /\b(projects|personal\s*projects|portfolio|academic\s*projects)\b/i,
  summary: /\b(summary|objective|profile|about\s*me|career\s*objective)\b/i,
};

@Injectable()
export class ResumeParserService {
  async extractText(filePath: string, mimeType: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);

    if (mimeType === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    }

    if (
      mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    throw new BadRequestException('Unsupported file type. Upload PDF or DOCX.');
  }

  async parseResume(rawText: string): Promise<ParsedResume> {
    const rawSections = this.splitSections(rawText);
    return {
      skills: this.extractSkills(rawText),
      experience: this.parseExperience(rawSections.experience || ''),
      education: this.parseEducation(rawSections.education || ''),
      projects: this.parseProjects(rawSections.projects || ''),
      contactInfo: this.extractContact(rawText),
      summary: rawSections.summary || '',
      rawSections,
    };
  }

  private splitSections(text: string): Record<string, string> {
    const lines = text.split('\n');
    const sections: Record<string, string> = {};
    let current = 'header';
    let buffer: string[] = [];

    for (const line of lines) {
      let matched = false;
      for (const [name, pattern] of Object.entries(SECTION_PATTERNS)) {
        if (pattern.test(line) && line.trim().length < 60) {
          if (buffer.length) sections[current] = buffer.join('\n').trim();
          current = name;
          buffer = [];
          matched = true;
          break;
        }
      }
      if (!matched) buffer.push(line);
    }
    if (buffer.length) sections[current] = buffer.join('\n').trim();
    return sections;
  }

  private extractSkills(text: string): string[] {
    const lower = text.toLowerCase();
    return KNOWN_SKILLS.filter((skill) => lower.includes(skill));
  }

  private parseExperience(text: string): ExperienceEntry[] {
    if (!text.trim()) return [];
    const blocks = text.split(/\n{2,}/);
    const entries: ExperienceEntry[] = [];

    for (const block of blocks) {
      const lines = block.split('\n').filter((l) => l.trim());
      if (!lines.length) continue;
      entries.push({
        title: lines[0]?.trim() || '',
        company: lines[1]?.trim() || '',
        duration: this.findDuration(block),
        bullets: lines
          .slice(2)
          .filter((l) => /^[\s]*[•\-\*\u2022]/.test(l))
          .map((l) => l.replace(/^[\s]*[•\-\*\u2022]\s*/, '').trim()),
      });
    }
    return entries;
  }

  private parseEducation(text: string): EducationEntry[] {
    if (!text.trim()) return [];
    const blocks = text.split(/\n{2,}/);
    const entries: EducationEntry[] = [];

    for (const block of blocks) {
      const lines = block.split('\n').filter((l) => l.trim());
      if (!lines.length) continue;
      const yearMatch = block.match(/\b(19|20)\d{2}\b/);
      const gpaMatch = block.match(/\b(\d\.\d{1,2})\s*\/?\s*\d?\.?\d*\b/);
      entries.push({
        degree: lines[0]?.trim() || '',
        institution: lines[1]?.trim() || '',
        year: yearMatch?.[0] || '',
        gpa: gpaMatch?.[1],
      });
    }
    return entries;
  }

  private parseProjects(text: string): ProjectEntry[] {
    if (!text.trim()) return [];
    const blocks = text.split(/\n{2,}/);
    const entries: ProjectEntry[] = [];

    for (const block of blocks) {
      const lines = block.split('\n').filter((l) => l.trim());
      if (!lines.length) continue;
      const techMatch = block.match(/(?:tech|built\s*with|stack)[:\s]*(.*)/i);
      entries.push({
        name: lines[0]?.trim() || '',
        description: lines.slice(1).join(' ').trim(),
        technologies: techMatch
          ? techMatch[1].split(/[,|]/).map((t) => t.trim())
          : this.extractSkills(block),
      });
    }
    return entries;
  }

  private extractContact(text: string): ContactInfo {
    const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
    const phoneMatch = text.match(/[\+]?[\d\s\-().]{10,}/);
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    const githubMatch = text.match(/github\.com\/[\w-]+/i);
    const firstLines = text.split('\n').slice(0, 5);
    const nameLine = firstLines.find(
      (l) => l.trim().length > 1 && !/[@\d{3}]/.test(l) && l.trim().length < 50,
    );

    return {
      name: nameLine?.trim() || '',
      email: emailMatch?.[0] || '',
      phone: phoneMatch?.[0]?.trim() || '',
      linkedin: linkedinMatch?.[0] || '',
      github: githubMatch?.[0] || '',
    };
  }

  private findDuration(text: string): string {
    const match = text.match(
      /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*[\s,]*\d{4}\s*[-–]\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*[\s,]*\d{4}|Present|Current)\b/i,
    );
    return match?.[0] || '';
  }
}
