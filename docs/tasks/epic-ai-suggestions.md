# Epic: AI Suggestions Engine

## Overview
LLM-powered suggestions for improving resume content, including bullet rewrites, section improvements, and keyword additions.

---

## Tasks

### AI-1: Resume Suggestions via LLM
- **Owner**: AI Engineer
- **Input**: ParsedResume + raw text
- **Output**: Array of specific suggestion strings
- **Acceptance Criteria**:
  - [ ] Sends resume data to OpenAI with expert reviewer prompt
  - [ ] Returns specific, actionable suggestions (not generic)
  - [ ] Focuses on: keywords, bullets, missing sections, quantification
  - [ ] Parses JSON array from LLM response
  - [ ] Falls back to rule-based suggestions if API fails
  - [ ] Temperature: 0.5 for consistency
- **Status**: backlog

### AI-2: Bullet Point Improver
- **Owner**: AI Engineer
- **Input**: Array of bullet point strings
- **Output**: Array of improved bullet strings
- **Acceptance Criteria**:
  - [ ] Each improved bullet starts with a strong action verb
  - [ ] Includes quantifiable metrics where possible
  - [ ] Concise: max 1–2 lines each
  - [ ] Focus on impact and results
  - [ ] Falls back to original bullets if API fails
- **Status**: backlog

### AI-3: Section Rewriter
- **Owner**: AI Engineer
- **Input**: Section name + section content + optional target role
- **Output**: Rewritten section text
- **Acceptance Criteria**:
  - [ ] Preserves factual content
  - [ ] Improves professional wording
  - [ ] Optimizes for ATS
  - [ ] Optional: tailored for a target role
- **Status**: backlog

### AI-4: Keyword Suggester
- **Owner**: AI Engineer
- **Input**: Current skills array + optional target role
- **Output**: Array of additional keywords (max 15)
- **Acceptance Criteria**:
  - [ ] Keywords are relevant to user's domain
  - [ ] Does not repeat existing skills
  - [ ] Returns max 15 suggestions
  - [ ] Falls back to empty array on failure
- **Status**: backlog
