# Epic: Resume Upload & Parsing

## Overview
File upload, text extraction, and NLP-based parsing of resume content into structured data.

---

## Tasks

### RES-1: File Upload Endpoint
- **Owner**: Backend Engineer
- **Input**: `multipart/form-data` with `file` field via POST `/api/v1/resume/upload`
- **Output**: `{ resume: {...}, analysis: {...} }` (201 Created)
- **Acceptance Criteria**:
  - [ ] Accepts PDF and DOCX only (MIME type validation)
  - [ ] Rejects files > 10 MB with 400 Bad Request
  - [ ] Stores file to `./uploads/resumes/` with UUID filename
  - [ ] Creates resume record in database
  - [ ] Triggers full parsing and analysis pipeline
  - [ ] Requires authentication
  - [ ] Returns resume + analysis objects
- **Status**: backlog

### RES-2: PDF Text Extraction
- **Owner**: AI Engineer
- **Input**: File path to a PDF file
- **Output**: Raw text string
- **Acceptance Criteria**:
  - [ ] Handles single-page and multi-page PDFs
  - [ ] Returns clean text (no binary artifacts)
  - [ ] Throws BadRequestException for corrupted files
  - [ ] Uses `pdf-parse` library
- **Status**: backlog

### RES-3: DOCX Text Extraction
- **Owner**: AI Engineer
- **Input**: File path to a DOCX file
- **Output**: Raw text string
- **Acceptance Criteria**:
  - [ ] Extracts all text content from DOCX
  - [ ] Preserves paragraph structure
  - [ ] Uses `mammoth` library
- **Status**: backlog

### RES-4: Resume NLP Parser
- **Owner**: AI Engineer
- **Input**: Raw text string
- **Output**: `ParsedResume` object with skills, experience, education, projects, contactInfo, summary
- **Acceptance Criteria**:
  - [ ] Detects section headers (experience, education, skills, projects, summary)
  - [ ] Extracts skills by matching against 50+ known skill keywords
  - [ ] Extracts experience entries (title, company, duration, bullets)
  - [ ] Extracts education entries (degree, institution, year, GPA)
  - [ ] Extracts projects (name, description, technologies)
  - [ ] Extracts contact info (name, email, phone, LinkedIn, GitHub)
  - [ ] Handles resumes with missing sections gracefully
- **Status**: backlog

### RES-5: List User Resumes Endpoint
- **Owner**: Backend Engineer
- **Input**: JWT (user ID) via GET `/api/v1/resume`
- **Output**: Array of resume objects with analysis score summary
- **Acceptance Criteria**:
  - [ ] Returns only resumes owned by authenticated user
  - [ ] Includes `analysis.overallScore` for each
  - [ ] Ordered by `createdAt` descending
- **Status**: backlog

### RES-6: Get Single Resume Endpoint
- **Owner**: Backend Engineer
- **Input**: Resume ID via GET `/api/v1/resume/:id`
- **Output**: Full resume object with analysis
- **Acceptance Criteria**:
  - [ ] Returns 404 if resume doesn't exist
  - [ ] Returns 403 if user doesn't own the resume
  - [ ] Includes full analysis object
- **Status**: backlog

### RES-7: Resume Upload Page (Frontend)
- **Owner**: Frontend Engineer
- **Input**: User drags/selects a file
- **Output**: Redirect to Resume Analysis page
- **Acceptance Criteria**:
  - [ ] Drag-and-drop zone (react-dropzone)
  - [ ] File type indicator (PDF/DOCX icons)
  - [ ] Upload progress indicator
  - [ ] Error display for invalid files
  - [ ] Redirects to `/resume/:id/analysis` on success
  - [ ] Shows list of previously uploaded resumes below
- **Status**: backlog
