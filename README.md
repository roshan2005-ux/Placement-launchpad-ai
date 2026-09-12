# Placement Launchpad AI

> AI-Powered Personalized Placement Preparation Platform  
> **🏆 FUSIONX 2026 – 3rd Prize Winner**

---

## Project Overview

**Placement Launchpad AI** is an AI-powered personalized placement preparation platform that helps students understand their placement readiness and follow a structured, end-to-end preparation journey.

### Problem
Students often struggle to identify the skills required for their target job, understand their skill gaps, improve their resume, prepare for interviews, and track their placement applications because the preparation process is scattered across different platforms.

### Solution
Our platform connects the placement preparation process into one unified journey:

```
Profile → Target Role → Resume → AI Resume Analysis → Skill Gap → Personalized Learning Roadmap → Skill Assessment → AI Mock Interview → Placement Readiness Score → Personalized Recommendations → Job Application Tracking
```

---

## 🏆 Hackathon Achievement

- **FUSIONX 2026 – 3rd Prize Winner**

---

## Key Features

- **Student Registration and Login**: Secure authentication with JWT, password hashing via bcryptjs, and protected client-side routes.
- **Student Profile**: Student profile management capturing education, primary target role, graduation year, and technical skills.
- **Target Job Role Selection**: Curated competencies across 8 key industry domains.
- **Resume Vault / Resume Upload**: Multi-format document parser supporting PDF, DOC, and DOCX files.
- **AI Resume Analysis**: Comprehensive resume evaluation against role competencies using Google Gemini API with fallback to local semantic heuristic engine.
- **Skill Gap Identification**: Clear breakdown of candidate's matched skills, missing competencies, and actionable gap analysis.
- **Personalized Learning Roadmap**: Milestone-based weekly preparation plan tailored to target job role and identified skill gaps.
- **Skill Assessment**: Role-specific interactive technical quizzes with timed questions, automated scoring, and answer explanations.
- **AI Mock Interview**: Interactive role-tailored technical and behavioral mock interview simulator providing detailed criteria-based feedback.
- **Placement Readiness Score**: Weighted composite readiness score calculated from profile completeness, resume alignment, assessment performance, and mock interview score.
- **Personalized Recommendations**: Dynamic insights highlighting priority actions, candidate strengths, and areas for improvement.
- **Job Application Tracker**: Kanban-style status pipeline tracking applications from Applied and Screening through Interviewing, Offered, or Rejected.

---

## Target Roles

- Full Stack Developer
- Frontend Developer
- Backend Developer
- Python Developer
- Java Developer
- Data Analyst
- AI/ML Engineer
- Cybersecurity Analyst

---

## Technology Stack

### Frontend
- **React** (v19) - Component-based user interface
- **Vite** - High-performance build tool and development server
- **Tailwind CSS** (v4) - Modern utility-first styling
- **React Router** (v7) - Client-side single-page routing
- **Lucide React** - UI icons

### Backend
- **Node.js** - Server runtime environment
- **Express** - REST API framework
- **MongoDB** & **Mongoose** - Document database and object data modeling
- **JWT (JSON Web Tokens)** & **bcryptjs** - Authentication and password security
- **Multer**, **pdf-parse**, & **mammoth** - Resume document uploads and text extraction (PDF / DOC / DOCX)
- **CORS** & **dotenv** - Cross-origin middleware and environment configuration

### AI Integration
- **Google Gemini API** - Server-side AI resume analysis and mock interview generation
- **Local Heuristic Fallback Engine** - Built-in semantic competency matrix for zero-downtime offline operation

---

## Architecture

```
Student
   ↓
React + Vite + Tailwind Frontend
   ↓
REST API (JSON)
   ↓
Node.js + Express Backend
   ↓
Authentication / Profile / Resume / Assessment / Interview / Application Services
   ↓
MongoDB Database
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB instance (local or MongoDB Atlas)

### Environment Configuration

Create a `.env` file in the `backend/` directory based on `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/roshan2005-ux/placement-launchpad-ai.git
   cd placement-launchpad-ai
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

1. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs at `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).

2. **Start Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs at `http://localhost:5173`.

---

## Future Scope

- Advanced AI career recommendations
- Deeper skill-gap analysis
- Job recommendations
- Advanced interview preparation
- Improved progress analytics
- Placement readiness insights
