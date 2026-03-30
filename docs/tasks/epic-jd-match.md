# Epic: JD Matching System

## Overview
Match user resumes against job descriptions using embedding similarity and skill overlap analysis.

---

## Tasks

### JD-1: Match Resume to JD Endpoint
- **Owner**: Backend Engineer
- **Input**: `{ resumeId, jobTitle, company?, description }` via POST `/api/v1/jd-match`
- **Output**: `{ match: {...}, jobDescription: {...} }`
- **Acceptance Criteria**:
  - [ ] Validates resumeId exists and belongs to user
  - [ ] Validates description min 50 chars
  - [ ] Creates JobDescription record
  - [ ] Computes embedding similarity score
  - [ ] Identifies matched and missing skills
  - [ ] Generates improvement suggestions
  - [ ] Creates JDMatch record
  - [ ] Returns full match object
- **Status**: backlog

### JD-2: Embedding-Based Similarity
- **Owner**: AI Engineer
- **Input**: Resume text + JD text
- **Output**: Cosine similarity score (0–1, converted to 0–100%)
- **Acceptance Criteria**:
  - [ ] Uses OpenAI `text-embedding-3-small` model
  - [ ] Computes cosine similarity between two embedding vectors
  - [ ] Falls back to Jaccard word overlap if API fails
  - [ ] Score is rounded to nearest integer
- **Status**: backlog

### JD-3: Skill Overlap Analysis
- **Owner**: AI Engineer
- **Input**: Resume skills array + JD text
- **Output**: `{ matched: string[], missing: string[] }`
- **Acceptance Criteria**:
  - [ ] Extracts skills from JD text
  - [ ] Cross-references against resume skills
  - [ ] Case-insensitive matching
  - [ ] Returns both matched and missing arrays
- **Status**: backlog

### JD-4: Match Suggestions via LLM
- **Owner**: AI Engineer
- **Input**: Matched skills + missing skills + match score
- **Output**: Array of actionable suggestions (max 8)
- **Acceptance Criteria**:
  - [ ] Suggests how to close skill gaps
  - [ ] Suggests resume tailoring strategies
  - [ ] Falls back to rule-based suggestions if API fails
- **Status**: backlog

### JD-5: Match History Endpoint
- **Owner**: Backend Engineer
- **Input**: JWT via GET `/api/v1/jd-match/history`
- **Output**: Array of past matches with JD title, score
- **Acceptance Criteria**:
  - [ ] Returns only matches for user's resumes
  - [ ] Includes JD title, company, and score
  - [ ] Ordered by date descending
- **Status**: backlog

### JD-6: JD Matching Page (Frontend)
- **Owner**: Frontend Engineer
- **Input**: User selects resume + pastes JD text
- **Output**: Match results display
- **Acceptance Criteria**:
  - [ ] Resume selector dropdown (from user's uploads)
  - [ ] Job title, company, and description text inputs
  - [ ] Submit button with loading state
  - [ ] Match score display (large percentage)
  - [ ] Matched skills with green badges
  - [ ] Missing skills with red badges
  - [ ] Suggestions list
  - [ ] Match history section below
- **Status**: backlog
