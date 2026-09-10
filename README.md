# Placement Launchpad AI

## Problem Statement
**Problem Statement 27 – The Modern Placement Launchpad**

College students often face significant uncertainty when preparing for competitive placement drives. Generic preparation material, lack of role-specific skill gap analysis, absence of actionable learning roadmaps, and lack of realistic technical/HR interview practice hinder their career readiness. 

## Project Objective
**Placement Launchpad AI** is an intelligent, end-to-end placement readiness ecosystem designed to bridge the gap between academic education and industry hiring standards. By leveraging AI-powered resume analysis, dynamic skill-gap diagnostics, personalized learning roadmaps, tailored assessments, and real-time AI mock interviews, the platform empowers students with a quantifiable **Placement Readiness Score** and targeted recommendations.

---

## Technology Stack

### Frontend
- **Framework:** React.js (v19)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (v4)
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (REST API architecture)
- **Security & Middleware:** CORS, Dotenv, JWT Authentication (planned)

### Database & Cloud
- **Database:** MongoDB Atlas (Cloud-hosted M0 cluster)
- **ODM:** Mongoose (to be configured in Stage 2)

### AI Integration
- **Engine:** Google Gemini API (Server-side integration via official SDK)

### Version Control
- **VCS:** Git & GitHub

---

## Core Flow & Planned Features

1. **Student Registration & Authentication**: Secure sign-up/login with JWT authorization.
2. **Profile & Career Targeting**: Student profile setup with target job roles (e.g., SDE, Frontend, Data Analyst, Cloud/DevOps).
3. **Resume Parsing & AI Analysis**: Upload resume (PDF/text) with AI extraction of skills, projects, and work experience.
4. **Skill Gap Diagnostics**: Automated comparison between student profile/resume and target job market requirements.
5. **Personalized Learning Roadmap**: Milestone-based, role-specific learning paths tailored to fill identified gaps.
6. **Adaptive Assessments & Quizzes**: Role-specific technical, aptitude, and coding quizzes with instant feedback.
7. **AI Mock Interview Simulator**: Context-aware interview practice generating targeted technical and behavioral questions.
8. **Placement Readiness Score & Insights**: Comprehensive analytical score with actionable weaknesses, strengths, and personalized recommendations.

---

## Development Stages

- [x] **Stage 1 — Project Foundation**: Repository setup, directory architecture, React + Vite frontend, Express REST backend, Tailwind CSS v4 configuration, environment structure, and health check validation.
- [ ] **Stage 2 — Database & Authentication**: MongoDB Atlas cloud connection, Mongoose schemas, JWT authentication, and user registration/login endpoints.
- [ ] **Stage 3 — Profile & Job Role Selection**: Student profile management and curated industry job role taxonomies.
- [ ] **Stage 4 — Resume Upload & Gemini AI Analysis**: Resume document processing, Gemini API prompt engineering, and skill extraction.
- [ ] **Stage 5 — Skill Gap Engine & Dynamic Roadmap**: Gap calculation algorithm and milestone-based personalized learning plan generator.
- [ ] **Stage 6 — Quiz & Assessment Engine**: Automated role-based quizzes, scoring logic, and answer evaluations.
- [ ] **Stage 7 — AI Mock Interview Module**: Interactive multi-turn or scenario-based mock interview simulator with feedback.
- [ ] **Stage 8 — Placement Readiness Scoring & Dashboard**: Aggregate readiness algorithm, visual analytics, and personalized recommendation engine.
- [ ] **Stage 9 — Final Integration, UI Polish & Presentation Prep**: End-to-end testing, responsive design polish, and demo workflow readiness.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- Git

### Installation & Running Locally

#### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on: `http://localhost:5000`
Health check endpoint: `http://localhost:5000/api/health`

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`
