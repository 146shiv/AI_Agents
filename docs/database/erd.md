# Entity Relationship Diagram

## Relationships

```
┌──────────┐
│   User   │
│──────────│
│ id (PK)  │
│ email    │
│ password │
│ fullName │
└──────────┘
     │
     │ 1:N
     ├──────────────────────────────────┐
     │                                  │
     ▼                                  ▼
┌──────────────┐                ┌──────────────────┐
│   Resume     │                │  JobDescription  │
│──────────────│                │──────────────────│
│ id (PK)      │                │ id (PK)          │
│ user_id (FK) │                │ user_id (FK)     │
│ file_name    │                │ title            │
│ raw_text     │                │ company          │
│ parsed_data  │                │ description      │
└──────────────┘                └──────────────────┘
     │                               │
     │ 1:1                           │
     ▼                               │
┌──────────────────┐                 │
│ ResumeAnalysis   │                 │
│──────────────────│                 │
│ id (PK)          │                 │
│ resume_id (FK)   │ UNIQUE          │
│ overall_score    │                 │
│ keyword_score    │                 │
│ formatting_score │                 │
│ experience_score │                 │
│ suggestions      │                 │
│ weaknesses       │                 │
│ strengths        │                 │
└──────────────────┘                 │
     │                               │
     │ Resume 1:N                    │ JD 1:N
     │                               │
     └───────────┐   ┌──────────────┘
                  │   │
                  ▼   ▼
            ┌──────────────┐
            │   JDMatch    │
            │──────────────│
            │ id (PK)      │
            │ resume_id(FK)│
            │ jd_id (FK)   │
            │ match_score  │
            │ matched_skills│
            │ missing_skills│
            │ suggestions  │
            └──────────────┘


     User 1:N
     │
     ▼
┌─────────────────────┐
│  InterviewSession   │
│─────────────────────│
│ id (PK)             │
│ user_id (FK)        │
│ resume_id (opt)     │
│ jd_id (opt)         │
│ type                │
│ status              │
│ overall_score       │
│ confidence          │
│ accuracy            │
│ clarity             │
└─────────────────────┘
     │
     │ 1:N
     ▼
┌──────────────┐
│  Question    │
│──────────────│
│ id (PK)      │
│ session_id   │
│ content      │
│ type         │
│ difficulty   │
│ order_index  │
└──────────────┘
     │
     │ 1:1
     ▼
┌──────────────┐
│   Answer     │
│──────────────│
│ id (PK)      │
│ question_id  │ UNIQUE
│ content      │
│ score        │
│ feedback     │
│ confidence   │
│ accuracy     │
│ clarity      │
└──────────────┘
```

## Relationship Summary

| Parent | Child | Type | On Delete |
|--------|-------|------|-----------|
| User | Resume | 1:N | CASCADE |
| User | JobDescription | 1:N | CASCADE |
| User | InterviewSession | 1:N | CASCADE |
| Resume | ResumeAnalysis | 1:1 | CASCADE |
| Resume | JDMatch | 1:N | CASCADE |
| JobDescription | JDMatch | 1:N | CASCADE |
| InterviewSession | Question | 1:N | CASCADE |
| Question | Answer | 1:1 | CASCADE |

## Key Indexes

- `users.email` — UNIQUE index (login lookup)
- `resumes.user_id` — Foreign key index (list user's resumes)
- `resume_analyses.resume_id` — UNIQUE index (one analysis per resume)
- `jd_matches.resume_id` — Index (find matches for a resume)
- `jd_matches.jd_id` — Index (find matches for a JD)
- `interview_sessions.user_id` — Index (list user's sessions)
- `questions.session_id` — Index (get questions for a session)
- `answers.question_id` — UNIQUE index (one answer per question)
