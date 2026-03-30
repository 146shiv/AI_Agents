# Epic: Interview System

## Overview
AI-powered mock interview system with question generation, answer evaluation, and real-time feedback via WebSocket.

---

## Tasks

### INT-1: Start Interview Session Endpoint
- **Owner**: Backend Engineer
- **Input**: `{ resumeId?, jdId?, type?, questionCount? }` via POST `/api/v1/interview/start`
- **Output**: `{ session, questions }` (201 Created)
- **Acceptance Criteria**:
  - [ ] Validates resumeId belongs to user (if provided)
  - [ ] Validates jdId exists (if provided)
  - [ ] Question count: 3–20, default 10
  - [ ] Type: "technical", "behavioral", "hr", or "mixed" (default)
  - [ ] Creates InterviewSession record with status "in_progress"
  - [ ] Generates and stores questions
  - [ ] Returns session + questions array
- **Status**: backlog

### INT-2: Question Generation from Resume (LLM)
- **Owner**: AI Engineer
- **Input**: ParsedResume data + count
- **Output**: Array of `{ content, type, difficulty }` objects
- **Acceptance Criteria**:
  - [ ] Mix of technical, behavioral, and HR questions
  - [ ] Technical questions reference actual skills/experience
  - [ ] Each question has difficulty: easy, medium, or hard
  - [ ] Falls back to generic question set if API fails
- **Status**: backlog

### INT-3: Question Generation from JD (LLM)
- **Owner**: AI Engineer
- **Input**: JD text + resume data + count
- **Output**: Array of `{ content, type, difficulty }` objects
- **Acceptance Criteria**:
  - [ ] Focuses on JD requirements and skill gaps
  - [ ] Technical depth on overlapping skills
  - [ ] Falls back to generic questions if API fails
- **Status**: backlog

### INT-4: Submit Answer + Evaluation Endpoint
- **Owner**: Backend Engineer + AI Engineer
- **Input**: `{ questionId, answer }` via POST `/api/v1/interview/sessions/:id/answer`
- **Output**: `{ answer, evaluation }` with scores
- **Acceptance Criteria**:
  - [ ] Validates session is "in_progress"
  - [ ] Validates question belongs to session
  - [ ] Validates answer min 10 chars
  - [ ] Sends to LLM for evaluation
  - [ ] Returns: score, confidence, accuracy, clarity, feedback
  - [ ] Creates Answer record
- **Status**: backlog

### INT-5: Answer Evaluation via LLM
- **Owner**: AI Engineer
- **Input**: Question text + answer text + question type
- **Output**: `{ score, confidence, accuracy, clarity, feedback }`
- **Acceptance Criteria**:
  - [ ] All scores 0–100
  - [ ] Feedback is constructive and specific
  - [ ] Temperature: 0.3 for consistency
  - [ ] Falls back to default scores if API fails
- **Status**: backlog

### INT-6: End Interview Session Endpoint
- **Owner**: Backend Engineer
- **Input**: Session ID via PATCH `/api/v1/interview/sessions/:id/end`
- **Output**: Session with aggregate scores + feedback summary
- **Acceptance Criteria**:
  - [ ] Calculates average score, confidence, accuracy, clarity
  - [ ] Sets session status to "completed"
  - [ ] Sets endedAt timestamp
  - [ ] Stores feedback summary (total questions, answered, avg score)
- **Status**: backlog

### INT-7: WebSocket Interview Gateway
- **Owner**: Backend Engineer
- **Input/Output**: Socket.io events on `/interview` namespace
- **Events**:
  - `join_session` → `joined`
  - `submit_answer` → `answer_evaluated`
  - `end_session` → `session_ended`
- **Acceptance Criteria**:
  - [ ] CORS configured for frontend origin
  - [ ] Client joins room by session ID
  - [ ] Real-time answer evaluation
  - [ ] Error events sent on failure
- **Status**: backlog

### INT-8: Interview Room Page (Frontend)
- **Owner**: Frontend Engineer
- **Input**: User starts interview, answers questions
- **Output**: Real-time feedback + session summary
- **Acceptance Criteria**:
  - [ ] Start screen: select resume, optional JD, question count
  - [ ] Question display: one question at a time, type badge, difficulty badge
  - [ ] Answer input: textarea with character count
  - [ ] Submit button with loading state
  - [ ] Feedback panel: score, confidence, accuracy, clarity bars + feedback text
  - [ ] Progress indicator (question X of Y)
  - [ ] End interview button
  - [ ] Summary screen: aggregate scores, per-question breakdown
  - [ ] WebSocket connection for real-time evaluation
- **Status**: backlog

### INT-9: List Interview Sessions Endpoint
- **Owner**: Backend Engineer
- **Input**: JWT via GET `/api/v1/interview/sessions`
- **Output**: Array of sessions with question counts
- **Acceptance Criteria**:
  - [ ] Returns all sessions for authenticated user
  - [ ] Includes question IDs and types
  - [ ] Ordered by date descending
- **Status**: backlog

### INT-10: Get Session Detail Endpoint
- **Owner**: Backend Engineer
- **Input**: Session ID via GET `/api/v1/interview/sessions/:id`
- **Output**: Session with all questions and answers
- **Acceptance Criteria**:
  - [ ] Returns 404 if session doesn't exist
  - [ ] Returns 403 if user doesn't own session
  - [ ] Includes questions with their answers
- **Status**: backlog
