# Feature Specifications

## Feature 1: Resume Upload & Parsing

### Description
Users upload a PDF or DOCX resume file. The system extracts text and uses NLP + NER techniques to parse structured data.

### User Story
> As a job seeker, I want to upload my resume so the system can analyze its content automatically.

### Functional Requirements
- Accept PDF and DOCX formats only
- Maximum file size: 10 MB
- Extract raw text from the document
- Parse into structured sections:
  - **Contact Info**: name, email, phone, LinkedIn, GitHub
  - **Summary/Objective**: professional summary paragraph
  - **Skills**: list of technical and soft skills
  - **Experience**: title, company, duration, bullet points per entry
  - **Education**: degree, institution, year, GPA
  - **Projects**: name, description, technologies used

### Non-Functional Requirements
- Parsing must complete within 5 seconds for a 3-page resume
- Support resumes in English only (v1)
- Store original file and parsed data separately

### Acceptance Criteria
- [ ] Upload rejects non-PDF/DOCX files with clear error message
- [ ] Upload rejects files larger than 10 MB
- [ ] PDF text extraction works for single and multi-page documents
- [ ] DOCX text extraction preserves content structure
- [ ] Parser identifies at least 3 out of 5 sections correctly
- [ ] Contact info extraction handles common email/phone/link formats
- [ ] Skill extraction matches against a database of 50+ common tech skills

---

## Feature 2: Resume Scoring Engine

### Description
Score the uploaded resume on a 0–100 scale using ATS (Applicant Tracking System) criteria.

### User Story
> As a job seeker, I want to see how my resume scores against ATS standards so I know what to improve.

### Scoring Criteria

| Sub-Score | Weight | What It Measures |
|-----------|--------|-----------------|
| Keyword Score | 30% | Number and relevance of technical skills found |
| Formatting Score | 20% | Proper sections, contact info, bullet points, length |
| Experience Score | 30% | Action verbs, quantified achievements, durations |
| Skill Density | 20% | Frequency of skill mentions relative to total words |

### Acceptance Criteria
- [ ] Overall score is a weighted average of sub-scores
- [ ] Each sub-score is independently calculated (0–100)
- [ ] Strengths are identified and listed
- [ ] Weaknesses are identified with actionable descriptions
- [ ] Score is persisted and linked to the resume record

---

## Feature 3: JD Matching System

### Description
Users paste a job description and the system computes a match score against a selected resume.

### User Story
> As a job seeker, I want to compare my resume against a job posting so I know how well I fit.

### Functional Requirements
- Input: Job title, company (optional), description text (min 50 chars)
- Use OpenAI embeddings to compute semantic similarity between resume text and JD text
- Extract skills from JD and cross-reference against resume skills
- Output: match score (%), matched skills, missing skills, improvement suggestions

### Acceptance Criteria
- [ ] Match score ranges from 0–100%
- [ ] Matched skills are listed accurately
- [ ] Missing skills are identified from the JD
- [ ] At least 3 actionable suggestions are generated
- [ ] Fallback works if OpenAI API is unavailable (Jaccard word overlap)

---

## Feature 4: AI Suggestions Engine

### Description
AI-powered suggestions to improve resume content, including bullet point rewrites, section improvements, and keyword additions.

### User Story
> As a job seeker, I want AI to suggest specific improvements to my resume so it performs better in ATS systems.

### Capabilities
1. **Resume-wide suggestions**: Overall improvement recommendations
2. **Bullet point improver**: Rewrite experience bullets with action verbs and metrics
3. **Section rewriter**: Rewrite entire sections for ATS optimization
4. **Keyword suggester**: Recommend missing keywords for a target role

### Acceptance Criteria
- [ ] Suggestions are specific (not generic "improve your resume")
- [ ] Bullet improver starts each bullet with an action verb
- [ ] Section rewriter preserves original facts while improving wording
- [ ] Keyword suggestions are relevant to user's domain
- [ ] All AI features have fallback responses if LLM API fails

---

## Feature 5: Interview Question Generator

### Description
Generate interview questions personalized to the user's resume and/or a target job description.

### User Story
> As a job seeker, I want practice interview questions based on my actual resume and target job so I can prepare effectively.

### Question Types
| Type | Description | Example |
|------|-------------|---------|
| Technical | Based on listed skills and technologies | "Explain how you used React hooks in your project" |
| Behavioral | STAR method questions about experience | "Tell me about a time you resolved a team conflict" |
| HR | Culture fit and career goal questions | "Why are you interested in this role?" |

### Acceptance Criteria
- [ ] Generates 3–20 questions per session (configurable)
- [ ] Mix of all three types (technical, behavioral, HR)
- [ ] Questions reference actual skills/experience from resume
- [ ] Difficulty levels assigned: easy, medium, hard
- [ ] Works with resume-only, JD-only, or both inputs

---

## Feature 6: AI Mock Interview (Chat-Based)

### Description
Conversational mock interview where the AI acts as an interviewer, asks questions one at a time, and evaluates each answer.

### User Story
> As a job seeker, I want to practice interviews with an AI interviewer that gives me real-time feedback.

### Evaluation Criteria (per answer)
| Metric | Range | Description |
|--------|-------|-------------|
| Score | 0–100 | Overall answer quality |
| Confidence | 0–100 | How confident the answer sounds |
| Accuracy | 0–100 | Technical/factual correctness |
| Clarity | 0–100 | Structure and communication quality |

### Session Flow
1. User starts session (selects resume, optional JD, question count)
2. System generates questions
3. User answers one question at a time
4. AI evaluates each answer in real-time
5. User ends session → overall performance summary

### Acceptance Criteria
- [ ] Real-time evaluation per answer
- [ ] Constructive feedback with each evaluation
- [ ] Session summary with aggregate scores at the end
- [ ] WebSocket support for real-time interaction
- [ ] Session history is persisted

---

## Feature 7: Voice Interview System (Phase 5 — Bonus)

### Description
Speech-to-text based interview where users speak their answers and receive real-time feedback.

### Acceptance Criteria
- [ ] Browser microphone capture
- [ ] Speech-to-text transcription
- [ ] Same evaluation pipeline as chat interview
- [ ] Real-time feedback display

---

## Feature 8: Weakness Detection Engine

### Description
Identify specific weaknesses across the user's resume and interview performance.

### Categories
- **Skill Gaps**: Missing skills for target roles
- **Communication Issues**: Low clarity scores in interviews
- **Resume Weaknesses**: Missing sections, no metrics, poor formatting
- **Domain Weaknesses**: Low technical scores in specific areas

### Acceptance Criteria
- [ ] Weaknesses are specific and actionable
- [ ] Categorized by type (skill gap, communication, resume, domain)
- [ ] Linked to improvement suggestions

---

## Feature 9: Dashboard

### Description
Central hub showing resume score history, interview performance, and progress tracking.

### Widgets
1. Summary cards (total resumes, interviews, avg scores)
2. Resume score trend chart (line chart over time)
3. Interview performance chart (radar chart or bar chart)
4. Recent activity feed
5. Quick actions (upload resume, start interview)

### Acceptance Criteria
- [ ] Loads within 2 seconds
- [ ] Shows meaningful data for new users (empty states)
- [ ] Charts update as new data is added
- [ ] Responsive on desktop and tablet
