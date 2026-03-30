# API Contract: JD Match Module

**Base path**: `/api/v1/jd-match`
**Authentication**: Required (JWT Bearer) on all endpoints

---

## POST /

Match a resume against a job description.

### Request
```json
{
  "resumeId": "uuid",
  "jobTitle": "Senior Frontend Engineer",
  "company": "Google",
  "description": "We are looking for a Senior Frontend Engineer with 5+ years of experience in React, TypeScript, and modern web technologies..."
}
```

### Validation Rules
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| resumeId | UUID | yes | Must exist and belong to user |
| jobTitle | string | yes | Min 2 characters |
| company | string | no | |
| description | string | yes | Min 50 characters |

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "resumeId": "uuid",
    "jdId": "uuid",
    "matchScore": 68,
    "matchedSkills": ["react", "javascript", "css", "git"],
    "missingSkills": ["typescript", "system design", "graphql"],
    "suggestions": [
      "Add TypeScript to your skills — it's a core requirement",
      "Highlight any system design experience in your bullets",
      "Consider adding GraphQL experience from side projects"
    ],
    "createdAt": "2026-03-30T12:00:00.000Z",
    "jobDescription": {
      "id": "uuid",
      "title": "Senior Frontend Engineer",
      "company": "Google",
      "description": "We are looking for..."
    }
  },
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

### Errors
| Status | Condition |
|--------|-----------|
| 400 | Validation failure |
| 403 | Resume doesn't belong to user |
| 404 | Resume not found |

---

## GET /history

Get all past JD matches for the user.

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "matchScore": 68,
      "matchedSkills": ["react", "javascript"],
      "missingSkills": ["typescript"],
      "createdAt": "2026-03-30T12:00:00.000Z",
      "jobDescription": {
        "title": "Senior Frontend Engineer",
        "company": "Google"
      },
      "resume": {
        "fileName": "resume_v2.pdf"
      }
    }
  ],
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

---

## GET /:id

Get a single match result in detail.

### Response (200 OK)
Returns full match object with JD and resume data.

### Errors
| Status | Condition |
|--------|-----------|
| 403 | Match doesn't belong to user |
| 404 | Match not found |
