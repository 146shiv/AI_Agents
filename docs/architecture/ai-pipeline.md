# AI Pipeline Architecture

## Overview

The AI layer is the core differentiator. It is NOT a single service — it's a pipeline of
specialized processors that collaborate through the AiModule. Every AI call has a deterministic
fallback so the system degrades gracefully when the LLM API is unavailable.

---

## Pipeline 1: Resume Processing Pipeline

Triggered on every resume upload. Runs synchronously before returning the API response.

```
PDF/DOCX File
     │
     ▼
┌─────────────────────┐
│  Text Extractor     │  pdf-parse / mammoth
│  (ResumeParser)     │  Pure library call, no AI
└─────────────────────┘
     │ raw text
     ▼
┌─────────────────────┐
│  Section Splitter   │  Regex-based section detection
│  (ResumeParser)     │  Headers: experience, education, skills, projects, summary
└─────────────────────┘
     │ sections map
     ▼
┌─────────────────────────────────────────────┐
│  Entity Extractors (all in ResumeParser)    │
│  ┌────────────┐ ┌────────────┐ ┌─────────┐ │
│  │ Skills     │ │ Contact    │ │ Experi- │ │
│  │ Extractor  │ │ Extractor  │ │ ence    │ │
│  │ (keyword   │ │ (regex:    │ │ Parser  │ │
│  │  matching) │ │  email,    │ │ (block  │ │
│  │            │ │  phone,    │ │  split) │ │
│  │            │ │  links)    │ │         │ │
│  └────────────┘ └────────────┘ └─────────┘ │
│  ┌────────────┐ ┌────────────┐              │
│  │ Education  │ │ Projects   │              │
│  │ Parser     │ │ Parser     │              │
│  └────────────┘ └────────────┘              │
└─────────────────────────────────────────────┘
     │ ParsedResume object
     ▼
┌─────────────────────┐
│  Resume Scorer      │  Deterministic algorithms (no AI)
│  (ResumeScorerSvc)  │  4 sub-scores → weighted overall
└─────────────────────┘
     │ scores + strengths
     ▼
┌─────────────────────┐
│  Weakness Detector  │  Rule-based checks (no AI)
│  (ResumeScorerSvc)  │  Missing sections, no metrics, etc.
└─────────────────────┘
     │ weaknesses
     ▼
┌─────────────────────┐
│  AI Suggestions     │  OpenAI gpt-4o-mini (with fallback)
│  (AiService)        │  Prompt: "expert resume reviewer"
└─────────────────────┘
     │ suggestions[]
     ▼
  ResumeAnalysis record saved to DB
```

### Key Design Decisions
- **Text extraction is pure library work** — no AI needed, fast and deterministic
- **Section splitting uses regex** — handles 90%+ of standard resume formats
- **Skill extraction is keyword-matching** — against a curated 50+ skill database
- **Scoring is fully deterministic** — no AI, no latency, no cost, reproducible
- **Only suggestions use the LLM** — the most expensive step is also the most skippable
- **Fallback suggestions are rule-based** — system works without an API key

---

## Pipeline 2: JD Matching Pipeline

Triggered when user submits a JD for matching against a selected resume.

```
Resume (parsed)  +  Job Description (raw text)
     │                      │
     ▼                      ▼
┌──────────────────────────────────┐
│  Skill Overlap Analyzer          │
│  (EmbeddingsService)             │
│                                  │
│  1. Extract skills from JD text  │  Keyword matching (same DB as resume)
│  2. Cross-reference resume skills│
│  3. Output: matched[] + missing[]│
└──────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────┐
│  Semantic Similarity             │
│  (EmbeddingsService)             │
│                                  │
│  1. Embed resume text            │  OpenAI text-embedding-3-small
│  2. Embed JD text                │
│  3. Cosine similarity → 0-100%  │
│                                  │
│  Fallback: Jaccard word overlap  │  Set intersection / set union
└──────────────────────────────────┘
     │ match_score
     ▼
┌──────────────────────────────────┐
│  Match Suggestions (LLM)        │
│  (AiService)                     │
│                                  │
│  Input: matched, missing, score  │
│  Output: actionable suggestions  │
│  Fallback: rule-based tips       │
└──────────────────────────────────┘
     │
     ▼
  JDMatch record saved to DB
```

### Key Design Decisions
- **Two-pronged matching**: keyword overlap (exact) + embedding similarity (semantic)
- **Embeddings are the expensive call** — both texts embedded in parallel for speed
- **Fallback similarity** uses Jaccard index — no external API needed
- **Match score is the embedding score** — keyword overlap is supplementary context

---

## Pipeline 3: Interview Pipeline

Triggered across multiple API calls throughout an interview session.

```
Phase 1: Session Start
─────────────────────
Resume (parsed) + JD (optional)
     │
     ▼
┌──────────────────────────────────┐
│  Question Generator (LLM)       │
│  (QuestionGeneratorService)      │
│                                  │
│  Prompt: "expert interviewer"    │
│  Input: skills, experience, JD   │
│  Output: N questions with:       │
│    - content (question text)     │
│    - type (tech/behavioral/hr)   │
│    - difficulty (easy/med/hard)  │
│                                  │
│  Fallback: curated question bank │
└──────────────────────────────────┘
     │
     ▼
  InterviewSession + Question records saved


Phase 2: Answer Evaluation (per question)
──────────────────────────────────────────
Question text + User's answer
     │
     ▼
┌──────────────────────────────────┐
│  Answer Evaluator (LLM)         │
│  (QuestionGeneratorService)      │
│                                  │
│  Prompt: "expert interviewer     │
│           evaluating answers"    │
│  Temperature: 0.3 (consistent)   │
│  Output:                         │
│    - score (0-100)               │
│    - confidence (0-100)          │
│    - accuracy (0-100)            │
│    - clarity (0-100)             │
│    - feedback (text)             │
│                                  │
│  Fallback: default 60 scores    │
└──────────────────────────────────┘
     │
     ▼
  Answer record saved with evaluation


Phase 3: Session End
─────────────────────
All answers collected
     │
     ▼
┌──────────────────────────────────┐
│  Score Aggregator                │
│  (InterviewService)              │
│                                  │
│  Deterministic averaging:        │
│  - avg(score)                    │
│  - avg(confidence)               │
│  - avg(accuracy)                 │
│  - avg(clarity)                  │
│  No AI needed                    │
└──────────────────────────────────┘
     │
     ▼
  InterviewSession updated to "completed"
```

### Key Design Decisions
- **Questions generated once at session start** — not on-the-fly per turn
- **Each answer evaluated independently** — no memory of previous answers needed
- **Evaluation temperature is 0.3** — consistency matters more than creativity
- **Aggregation is deterministic** — simple averaging, no LLM
- **WebSocket is optional** — REST endpoints work standalone; WebSocket adds real-time UX

---

## AI Cost Management

| Operation | Model | Est. Cost | Frequency |
|-----------|-------|-----------|-----------|
| Resume suggestions | gpt-4o-mini | ~$0.002 | Per upload |
| JD embedding (x2) | text-embedding-3-small | ~$0.0001 | Per match |
| Match suggestions | gpt-4o-mini | ~$0.001 | Per match |
| Question generation | gpt-4o-mini | ~$0.003 | Per session |
| Answer evaluation | gpt-4o-mini | ~$0.001 | Per answer |

**Estimated cost per full user flow**: ~$0.02 (upload + match + 10-question interview)

## Fallback Strategy Summary

| Feature | Primary | Fallback |
|---------|---------|----------|
| Text extraction | pdf-parse / mammoth | N/A (pure library) |
| Skill extraction | Keyword matching | N/A (deterministic) |
| Scoring | Algorithms | N/A (deterministic) |
| Suggestions | gpt-4o-mini | Rule-based suggestions |
| JD similarity | text-embedding-3-small | Jaccard word overlap |
| Match suggestions | gpt-4o-mini | Rule-based tips |
| Question generation | gpt-4o-mini | Curated question bank |
| Answer evaluation | gpt-4o-mini | Default score (60) |
