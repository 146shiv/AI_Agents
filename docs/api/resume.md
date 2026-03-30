# API Contract: Resume Module

**Base path**: `/api/v1/resume`
**Authentication**: Required (JWT Bearer) on all endpoints

---

## POST /upload

Upload and analyze a resume file.

### Request
- **Content-Type**: `multipart/form-data`
- **Field**: `file` (PDF or DOCX, max 10 MB)

### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "resume": {
      "id": "uuid",
      "userId": "uuid",
      "fileName": "john_doe_resume.pdf",
      "fileUrl": "./uploads/resumes/abc123.pdf",
      "fileType": "application/pdf",
      "rawText": "John Doe\nSoftware Engineer...",
      "parsedData": {
        "skills": ["javascript", "react", "node.js"],
        "experience": [
          {
            "title": "Senior Developer",
            "company": "TechCorp",
            "duration": "Jan 2022 – Present",
            "bullets": ["Built microservices architecture..."]
          }
        ],
        "education": [
          {
            "degree": "B.S. Computer Science",
            "institution": "MIT",
            "year": "2020",
            "gpa": "3.8"
          }
        ],
        "projects": [
          {
            "name": "AI Chat App",
            "description": "Real-time chat...",
            "technologies": ["react", "socket.io"]
          }
        ],
        "contactInfo": {
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "+1-555-0123",
          "linkedin": "linkedin.com/in/johndoe",
          "github": "github.com/johndoe"
        },
        "summary": "Experienced software engineer..."
      },
      "version": 1,
      "createdAt": "2026-03-30T12:00:00.000Z"
    },
    "analysis": {
      "id": "uuid",
      "resumeId": "uuid",
      "overallScore": 72,
      "keywordScore": 80,
      "formattingScore": 65,
      "experienceScore": 75,
      "skillDensity": 60,
      "skills": ["javascript", "react", "node.js"],
      "experience": [...],
      "education": [...],
      "projects": [...],
      "suggestions": [
        "Add quantifiable metrics to your experience bullets",
        "Include a professional summary section"
      ],
      "weaknesses": [
        "Missing GitHub profile link",
        "Experience bullets lack metrics"
      ],
      "strengths": [
        "Strong keyword optimization",
        "Diverse technical skill set"
      ]
    }
  },
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

### Errors
| Status | Condition |
|--------|-----------|
| 400 | No file uploaded, invalid file type, file too large |
| 401 | Not authenticated |

---

## GET /

List all resumes for the authenticated user.

### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "fileName": "resume_v2.pdf",
      "fileType": "application/pdf",
      "version": 2,
      "createdAt": "2026-03-30T12:00:00.000Z",
      "analysis": {
        "overallScore": 72
      }
    }
  ],
  "timestamp": "2026-03-30T12:00:00.000Z"
}
```

---

## GET /:id

Get a single resume with full analysis.

### Response (200 OK)
Returns full resume object (same shape as upload response).

### Errors
| Status | Condition |
|--------|-----------|
| 403 | User doesn't own this resume |
| 404 | Resume not found |

---

## GET /:id/analysis

Get only the analysis for a resume.

### Response (200 OK)
Returns the `analysis` object directly.

### Errors
| Status | Condition |
|--------|-----------|
| 403 | User doesn't own this resume |
| 404 | Resume or analysis not found |

---

## POST /:id/reanalyze

Re-run the analysis on an existing resume.

### Response (200 OK)
Returns updated analysis object.

### Errors
| Status | Condition |
|--------|-----------|
| 403 | User doesn't own this resume |
| 404 | Resume not found |
