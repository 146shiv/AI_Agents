# API Contract: Analytics Module

**Base path**: `/api/v1/analytics`
**Authentication**: Required (JWT Bearer) on all endpoints

---

## GET /dashboard

Get dashboard summary data.

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalResumes": 3,
      "totalInterviews": 7,
      "totalJdMatches": 5,
      "latestResumeScore": 78,
      "avgInterviewScore": 72
    },
    "latestResume": {
      "id": "uuid",
      "fileName": "resume_v3.pdf",
      "score": 78,
      "strengths": ["Strong keyword optimization", "Good project portfolio"],
      "weaknesses": ["Missing GitHub link", "Bullets lack metrics"]
    },
    "recentInterviews": [
      {
        "score": 75,
        "confidence": 80,
        "accuracy": 78,
        "clarity": 68,
        "date": "2026-03-30T12:00:00.000Z"
      }
    ]
  },
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

---

## GET /resume-history

Get resume score history for charting.

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "resumeId": "uuid",
      "fileName": "resume_v1.pdf",
      "version": 1,
      "date": "2026-03-28T12:00:00.000Z",
      "scores": {
        "overall": 55,
        "keywords": 60,
        "formatting": 45,
        "experience": 50,
        "skillDensity": 40
      }
    },
    {
      "resumeId": "uuid",
      "fileName": "resume_v2.pdf",
      "version": 2,
      "date": "2026-03-29T12:00:00.000Z",
      "scores": {
        "overall": 72,
        "keywords": 80,
        "formatting": 65,
        "experience": 75,
        "skillDensity": 60
      }
    }
  ],
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

---

## GET /interview-performance

Get interview performance data for charting.

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "sessionId": "uuid",
      "type": "mixed",
      "date": "2026-03-30T12:00:00.000Z",
      "overallScore": 75,
      "confidence": 78,
      "accuracy": 80,
      "clarity": 68,
      "questionCount": 10,
      "answeredCount": 8,
      "scoresByType": {
        "technical": 70,
        "behavioral": 82,
        "hr": 78
      }
    }
  ],
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```
