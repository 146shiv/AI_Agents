# Epic: Resume Scoring Engine

## Overview
ATS-based resume scoring system with sub-scores, strength identification, and weakness detection.

---

## Tasks

### SCORE-1: Keyword Scoring Algorithm
- **Owner**: AI Engineer
- **Input**: `ParsedResume.skills` array
- **Output**: Score 0–100
- **Acceptance Criteria**:
  - [ ] 15+ skills → 95, 10+ → 80, 7+ → 65, 4+ → 50, 2+ → 35, <2 → 15
  - [ ] Matches against a curated list of tech skills
  - [ ] Case-insensitive matching
- **Status**: backlog

### SCORE-2: Formatting Scoring Algorithm
- **Owner**: AI Engineer
- **Input**: Raw text + ParsedResume
- **Output**: Score 0–100
- **Acceptance Criteria**:
  - [ ] Checks for: email (+10), phone (+5), LinkedIn (+5)
  - [ ] Checks for 4+ sections (+15) or 3+ sections (+10)
  - [ ] Checks for bullet points in experience (+10)
  - [ ] Checks for reasonable length (20–80 lines) (+5)
  - [ ] Base score: 50
  - [ ] Caps at 100
- **Status**: backlog

### SCORE-3: Experience Scoring Algorithm
- **Owner**: AI Engineer
- **Input**: `ParsedResume.experience` + `ParsedResume.education`
- **Output**: Score 0–100
- **Acceptance Criteria**:
  - [ ] Points for number of experience entries (max 30)
  - [ ] Points for total bullet points (max 20)
  - [ ] Points for action verbs in bullets (+15)
  - [ ] Points for having durations (+5)
  - [ ] Points for education entries (max 10)
  - [ ] Base score: 20, caps at 100
- **Status**: backlog

### SCORE-4: Skill Density Scoring
- **Owner**: AI Engineer
- **Input**: Skills array + raw text
- **Output**: Score 0–100
- **Acceptance Criteria**:
  - [ ] Counts total skill mentions across raw text
  - [ ] Divides by total word count to get density %
  - [ ] 8%+ → 95, 5%+ → 80, 3%+ → 65, 1.5%+ → 50, <1.5% → 30
- **Status**: backlog

### SCORE-5: Overall Score Calculation
- **Owner**: AI Engineer
- **Input**: All four sub-scores
- **Output**: Weighted score 0–100
- **Acceptance Criteria**:
  - [ ] Formula: keywords(30%) + formatting(20%) + experience(30%) + density(20%)
  - [ ] Rounded to nearest integer
- **Status**: backlog

### SCORE-6: Weakness Detection
- **Owner**: AI Engineer
- **Input**: ParsedResume + scores
- **Output**: Array of weakness strings
- **Acceptance Criteria**:
  - [ ] Detects: low keywords, formatting issues, weak experience
  - [ ] Detects: few skills, no experience, no projects, no summary
  - [ ] Detects: missing LinkedIn, missing GitHub
  - [ ] Detects: bullets without metrics
  - [ ] Each weakness is specific and actionable
- **Status**: backlog

### SCORE-7: Strength Identification
- **Owner**: AI Engineer
- **Input**: ParsedResume + scores
- **Output**: Array of strength strings
- **Acceptance Criteria**:
  - [ ] Identifies high-scoring categories
  - [ ] Identifies diverse skill sets
  - [ ] Identifies good project portfolios
  - [ ] Identifies complete professional links
- **Status**: backlog

### SCORE-8: Resume Analysis Page (Frontend)
- **Owner**: Frontend Engineer
- **Input**: Resume ID from URL params
- **Output**: Visual analysis display
- **Acceptance Criteria**:
  - [ ] Circular score indicator (0–100) with color coding
  - [ ] Sub-score breakdown (4 bars/gauges)
  - [ ] Strengths list with check icons
  - [ ] Weaknesses list with warning icons
  - [ ] AI suggestions list
  - [ ] Parsed data display (skills, experience, education, projects)
  - [ ] Loading state while fetching
- **Status**: backlog
