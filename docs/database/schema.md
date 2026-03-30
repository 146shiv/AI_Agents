# Database Schema Design

## Technology
- **Database**: PostgreSQL 16 (Dockerized)
- **ORM**: Prisma ^5.20
- **Naming**: `snake_case` for all columns and table names (via `@map` / `@@map`)

---

## Models

### User
The core account entity. All other entities belong to a user.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, default uuid | Unique identifier |
| email | VARCHAR | UNIQUE, NOT NULL | Login email |
| password | VARCHAR | NOT NULL | bcrypt hashed password |
| full_name | VARCHAR | NOT NULL | Display name |
| avatar_url | VARCHAR | NULLABLE | Profile picture URL |
| created_at | TIMESTAMP | DEFAULT now() | Account creation time |
| updated_at | TIMESTAMP | Auto-updated | Last modification time |

**Table name**: `users`

---

### Resume
A user-uploaded resume file with extracted text and parsed structured data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → users.id, CASCADE | Owner |
| file_name | VARCHAR | NOT NULL | Original uploaded file name |
| file_url | VARCHAR | NOT NULL | Storage path |
| file_type | VARCHAR | NOT NULL | MIME type (application/pdf or docx) |
| raw_text | TEXT | NULLABLE | Extracted plain text |
| parsed_data | JSONB | NULLABLE | Structured parsed data |
| version | INT | DEFAULT 1 | Resume version number |
| created_at | TIMESTAMP | DEFAULT now() | Upload time |
| updated_at | TIMESTAMP | Auto-updated | Last modification |

**Table name**: `resumes`

---

### ResumeAnalysis
ATS scoring results and AI-generated insights for a resume. One-to-one with Resume.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| resume_id | UUID | FK → resumes.id, UNIQUE, CASCADE | Analyzed resume |
| overall_score | FLOAT | NOT NULL | Weighted ATS score (0–100) |
| keyword_score | FLOAT | NOT NULL | Keyword sub-score |
| formatting_score | FLOAT | NOT NULL | Formatting sub-score |
| experience_score | FLOAT | NOT NULL | Experience sub-score |
| skill_density | FLOAT | NOT NULL | Skill density sub-score |
| skills | JSONB | DEFAULT [] | Extracted skills array |
| experience | JSONB | DEFAULT [] | Extracted experience entries |
| education | JSONB | DEFAULT [] | Extracted education entries |
| projects | JSONB | DEFAULT [] | Extracted project entries |
| suggestions | JSONB | DEFAULT [] | AI improvement suggestions |
| weaknesses | JSONB | DEFAULT [] | Detected weaknesses |
| strengths | JSONB | DEFAULT [] | Identified strengths |
| created_at | TIMESTAMP | DEFAULT now() | Analysis time |
| updated_at | TIMESTAMP | Auto-updated | Last re-analysis |

**Table name**: `resume_analyses`

---

### JobDescription
A job posting provided by the user for matching.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → users.id, CASCADE | Who submitted it |
| title | VARCHAR | NOT NULL | Job title |
| company | VARCHAR | NULLABLE | Company name |
| description | TEXT | NOT NULL | Full JD text |
| skills | JSONB | DEFAULT [] | Extracted skills |
| created_at | TIMESTAMP | DEFAULT now() | Submission time |

**Table name**: `job_descriptions`

---

### JDMatch
Result of matching a resume against a job description.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| resume_id | UUID | FK → resumes.id, CASCADE | Matched resume |
| jd_id | UUID | FK → job_descriptions.id, CASCADE | Matched JD |
| match_score | FLOAT | NOT NULL | Similarity score (0–100) |
| matched_skills | JSONB | DEFAULT [] | Skills present in both |
| missing_skills | JSONB | DEFAULT [] | Skills in JD but not resume |
| suggestions | JSONB | DEFAULT [] | Improvement suggestions |
| created_at | TIMESTAMP | DEFAULT now() | Match time |

**Table name**: `jd_matches`

---

### InterviewSession
A mock interview session containing multiple questions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → users.id, CASCADE | Interviewer |
| resume_id | UUID | NULLABLE | Source resume |
| jd_id | UUID | NULLABLE | Source JD |
| type | VARCHAR | DEFAULT 'mixed' | Interview type |
| status | VARCHAR | DEFAULT 'in_progress' | in_progress / completed |
| overall_score | FLOAT | NULLABLE | Avg score after completion |
| confidence | FLOAT | NULLABLE | Avg confidence |
| accuracy | FLOAT | NULLABLE | Avg accuracy |
| clarity | FLOAT | NULLABLE | Avg clarity |
| feedback | JSONB | NULLABLE | Session summary data |
| started_at | TIMESTAMP | DEFAULT now() | Session start |
| ended_at | TIMESTAMP | NULLABLE | Session end |

**Table name**: `interview_sessions`

---

### Question
An individual interview question within a session.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| session_id | UUID | FK → interview_sessions.id, CASCADE | Parent session |
| content | TEXT | NOT NULL | Question text |
| type | VARCHAR | NOT NULL | technical / behavioral / hr |
| difficulty | VARCHAR | DEFAULT 'medium' | easy / medium / hard |
| order_index | INT | NOT NULL | Display order |
| created_at | TIMESTAMP | DEFAULT now() | Creation time |

**Table name**: `questions`

---

### Answer
A user's answer to an interview question with AI evaluation scores.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| question_id | UUID | FK → questions.id, UNIQUE, CASCADE | Answered question |
| content | TEXT | NOT NULL | Answer text |
| score | FLOAT | NULLABLE | Overall score (0–100) |
| feedback | TEXT | NULLABLE | AI feedback text |
| confidence | FLOAT | NULLABLE | Confidence score |
| accuracy | FLOAT | NULLABLE | Accuracy score |
| clarity | FLOAT | NULLABLE | Clarity score |
| created_at | TIMESTAMP | DEFAULT now() | Submission time |

**Table name**: `answers`
