# API Contract: Interview Module

**Base path**: `/api/v1/interview`
**Authentication**: Required (JWT Bearer) on all endpoints

---

## POST /start

Start a new mock interview session.

### Request
```json
{
  "resumeId": "uuid",
  "jdId": "uuid",
  "type": "mixed",
  "questionCount": 10
}
```

### Validation Rules
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| resumeId | UUID | no | Must exist and belong to user |
| jdId | UUID | no | Must exist |
| type | string | no | One of: "technical", "behavioral", "hr", "mixed". Default: "mixed" |
| questionCount | number | no | Min 3, max 20. Default: 10 |

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "uuid",
      "userId": "uuid",
      "type": "mixed",
      "status": "in_progress",
      "startedAt": "2026-03-30T12:00:00.000Z"
    },
    "questions": [
      {
        "id": "uuid",
        "content": "Explain your experience with React hooks and how you've used them in production.",
        "type": "technical",
        "difficulty": "medium",
        "orderIndex": 0
      },
      {
        "id": "uuid",
        "content": "Tell me about a time you had to resolve a conflict within your team.",
        "type": "behavioral",
        "difficulty": "medium",
        "orderIndex": 1
      }
    ]
  },
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

---

## GET /sessions

List all interview sessions.

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "mixed",
      "status": "completed",
      "overallScore": 75,
      "startedAt": "2026-03-30T12:00:00.000Z",
      "endedAt": "2026-03-30T12:30:00.000Z",
      "questions": [
        { "id": "uuid", "type": "technical" },
        { "id": "uuid", "type": "behavioral" }
      ]
    }
  ],
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

---

## GET /sessions/:id

Get full session detail with questions and answers.

### Response (200 OK)
Returns session with all questions and their answers (including scores/feedback).

---

## POST /sessions/:id/answer

Submit an answer to a question within a session.

### Request
```json
{
  "questionId": "uuid",
  "answer": "React hooks allow you to use state and lifecycle features in functional components. I've used useState, useEffect, useContext, and custom hooks extensively. For example, in my last project I created a useDebounce hook for search optimization..."
}
```

### Validation Rules
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| questionId | UUID | yes | Must exist in this session |
| answer | string | yes | Min 10 characters |

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "answer": {
      "id": "uuid",
      "questionId": "uuid",
      "content": "React hooks allow you to...",
      "score": 78,
      "feedback": "Good explanation of hooks with practical example. Consider mentioning useMemo/useCallback for performance optimization.",
      "confidence": 80,
      "accuracy": 85,
      "clarity": 70
    },
    "evaluation": {
      "score": 78,
      "confidence": 80,
      "accuracy": 85,
      "clarity": 70,
      "feedback": "Good explanation of hooks..."
    }
  },
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

---

## PATCH /sessions/:id/end

End an interview session and get aggregate results.

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "completed",
    "overallScore": 75,
    "confidence": 78,
    "accuracy": 80,
    "clarity": 68,
    "feedback": {
      "totalQuestions": 10,
      "answeredQuestions": 8,
      "averageScore": 75
    },
    "endedAt": "2026-03-30T12:30:00.000Z"
  },
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

---

## WebSocket: /interview namespace

### Events (Client → Server)

| Event | Payload | Description |
|-------|---------|-------------|
| `join_session` | `{ sessionId }` | Join a session room |
| `submit_answer` | `{ sessionId, questionId, answer, userId }` | Submit answer in real-time |
| `end_session` | `{ sessionId, userId }` | End the session |

### Events (Server → Client)

| Event | Payload | Description |
|-------|---------|-------------|
| `joined` | `{ sessionId }` | Confirmation of room join |
| `answer_evaluated` | `{ answer, evaluation }` | Real-time evaluation result |
| `session_ended` | `{ session }` | Session summary |
| `error` | `{ message }` | Error notification |
