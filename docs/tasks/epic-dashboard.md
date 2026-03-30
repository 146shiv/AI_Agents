# Epic: Dashboard & Analytics

## Overview
Central dashboard with summary metrics, score history charts, interview performance tracking, and quick actions.

---

## Tasks

### DASH-1: Dashboard Data Endpoint
- **Owner**: Backend Engineer
- **Input**: JWT via GET `/api/v1/analytics/dashboard`
- **Output**: `{ summary, latestResume, recentInterviews }`
- **Acceptance Criteria**:
  - [ ] Summary: totalResumes, totalInterviews, totalJdMatches, latestResumeScore, avgInterviewScore
  - [ ] Latest resume: id, fileName, score, strengths, weaknesses
  - [ ] Recent interviews: last 10 completed with scores
  - [ ] All data scoped to authenticated user
  - [ ] Handles new users with zero data gracefully
- **Status**: backlog

### DASH-2: Resume Score History Endpoint
- **Owner**: Backend Engineer
- **Input**: JWT via GET `/api/v1/analytics/resume-history`
- **Output**: Array of resume score data points
- **Acceptance Criteria**:
  - [ ] Each point: resumeId, fileName, version, date, scores (overall + sub-scores)
  - [ ] Ordered by date ascending (for charting)
  - [ ] Only includes resumes that have analysis
- **Status**: backlog

### DASH-3: Interview Performance Endpoint
- **Owner**: Backend Engineer
- **Input**: JWT via GET `/api/v1/analytics/interview-performance`
- **Output**: Array of interview performance data
- **Acceptance Criteria**:
  - [ ] Each entry: sessionId, type, date, overallScore, confidence, accuracy, clarity
  - [ ] Includes scores broken down by question type (technical, behavioral, HR)
  - [ ] Last 20 completed sessions
  - [ ] Ordered by date descending
- **Status**: backlog

### DASH-4: Dashboard Page (Frontend)
- **Owner**: Frontend Engineer
- **Input**: Dashboard data from API
- **Output**: Visual dashboard with cards, charts, quick actions
- **Acceptance Criteria**:
  - [ ] Summary cards: total resumes, total interviews, latest score, avg interview score
  - [ ] Resume score trend (line chart via Recharts)
  - [ ] Interview performance trend (bar chart)
  - [ ] Recent activity list
  - [ ] Quick action buttons: "Upload Resume", "Start Interview"
  - [ ] Empty state for new users
  - [ ] Loading skeleton while fetching
  - [ ] Responsive layout
- **Status**: backlog

### DASH-5: Analytics Page (Frontend)
- **Owner**: Frontend Engineer
- **Input**: History data from API
- **Output**: Detailed analytics views
- **Acceptance Criteria**:
  - [ ] Resume score history chart (line chart with sub-score breakdown)
  - [ ] Interview performance chart (per-session scores over time)
  - [ ] Score distribution by question type (radar/bar chart)
  - [ ] Performance trend indicators (improving, declining, stable)
  - [ ] Date range filtering (optional for v1)
- **Status**: backlog
