import { ROLE_COMPETENCIES } from './aiProvider.js';

/**
 * Validates and sanitizes roadmap payload against the required schema
 */
export const validateRoadmapResult = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Roadmap output is not a valid JSON object.');
  }

  const title = typeof data.title === 'string' && data.title.trim()
    ? data.title.trim()
    : 'Personalized Placement Learning Roadmap';

  const summary = typeof data.summary === 'string' && data.summary.trim()
    ? data.summary.trim()
    : 'Structured curriculum designed to bridge technical gaps for target campus placements.';

  if (!Array.isArray(data.weeks) || data.weeks.length < 4) {
    throw new Error('Roadmap must contain at least 4 weeks of structured curriculum.');
  }

  const weeks = data.weeks.slice(0, 6).map((week, index) => {
    const weekNumber = Number(week.weekNumber) || index + 1;
    const topic = typeof week.topic === 'string' && week.topic.trim()
      ? week.topic.trim()
      : `Core Competency Milestone ${weekNumber}`;
    const objective = typeof week.objective === 'string' && week.objective.trim()
      ? week.objective.trim()
      : 'Master fundamental and applied concepts for this milestone.';
    const practiceTask = typeof week.practiceTask === 'string' && week.practiceTask.trim()
      ? week.practiceTask.trim()
      : 'Complete targeted coding exercises and technical conceptual problems.';
    const projectTask = typeof week.projectTask === 'string' && week.projectTask.trim()
      ? week.projectTask.trim()
      : 'Build a modular component demonstrating mastery of this week’s topics.';
    let estimatedHours = Number(week.estimatedHours);
    if (isNaN(estimatedHours) || estimatedHours <= 0) estimatedHours = 12;

    return {
      weekNumber,
      topic,
      objective,
      practiceTask,
      projectTask,
      estimatedHours: Math.min(30, Math.max(6, Math.round(estimatedHours))),
      completed: Boolean(week.completed),
    };
  });

  return {
    title,
    summary,
    durationWeeks: weeks.length,
    weeks,
  };
};

/**
 * Built-in Curriculum Engine (Deterministic Heuristic Generator)
 * Prioritizes identified missing skills and target role expectations into 5 structured weeks
 */
export const generateLocalRoadmap = (targetJobRole, currentSkills = [], missingSkills = [], skillsToImprove = []) => {
  const roleConfig = ROLE_COMPETENCIES[targetJobRole] || ROLE_COMPETENCIES['Full Stack Developer'];

  // Identify prioritized gap skills
  const primaryGaps = missingSkills.length > 0
    ? missingSkills
    : roleConfig.coreSkills.filter((s) => !currentSkills.some((c) => c.toLowerCase() === s.toLowerCase()));

  const gap1 = primaryGaps[0] || roleConfig.coreSkills[0];
  const gap2 = primaryGaps[1] || roleConfig.coreSkills[1] || 'Core Design Patterns';
  const gap3 = primaryGaps[2] || roleConfig.coreSkills[2] || 'System Architecture';
  const improvementSkill = skillsToImprove[0] || roleConfig.coreSkills[3] || 'Performance Tuning';

  const weeks = [
    {
      weekNumber: 1,
      topic: `Foundational Gap Closure: ${gap1} Fundamentals`,
      objective: `Master core syntactical conventions, data structures, and standard libraries in ${gap1} required for ${targetJobRole} technical screenings.`,
      practiceTask: `Solve 10 medium-level coding challenges focusing on ${gap1} syntax, memory management, and algorithmic patterns.`,
      projectTask: `Build a standalone CLI or modular utility utilizing ${gap1} with unit tests and clear documentation on GitHub.`,
      estimatedHours: 12,
      completed: false,
    },
    {
      weekNumber: 2,
      topic: `Applied Architecture: ${gap2} Integration`,
      objective: `Implement production-ready patterns in ${gap2}, handling asynchronous events, validation, and data persistence.`,
      practiceTask: `Construct 5 end-to-end unit and integration test suites testing failure modes, error handling, and latency.`,
      projectTask: `Develop a verified service layer in ${gap2} connected to a persistent database with secure environment configuration.`,
      estimatedHours: 14,
      completed: false,
    },
    {
      weekNumber: 3,
      topic: `Advanced Frameworks: ${gap3} & ${improvementSkill}`,
      objective: `Bridge secondary competency gaps in ${gap3} while deepening existing skills in ${improvementSkill} for complex system requirements.`,
      practiceTask: `Benchmark API response times, debug memory bottlenecks, and implement state/caching optimizations.`,
      projectTask: `Implement a high-throughput module integrating ${gap3} with caching, logging middleware, and automated schema validation.`,
      estimatedHours: 15,
      completed: false,
    },
    {
      weekNumber: 4,
      topic: `System Reliability, Testing & CI/CD Pipelines`,
      objective: `Enforce industry engineering practices: automated linting, test-driven development, Docker containerization, and Git workflow.`,
      practiceTask: `Write end-to-end integration tests achieving >80% test coverage across critical user and data workflows.`,
      projectTask: `Containerize the multi-service application with Docker and set up automated GitHub Actions workflow for build and test validation.`,
      estimatedHours: 14,
      completed: false,
    },
    {
      weekNumber: 5,
      topic: `Capstone Production Project & Placement Bar-Raising`,
      objective: `Consolidate all learned skills (${gap1}, ${gap2}, ${gap3}) into a portfolio-ready capstone project aligned with ${targetJobRole} interviews.`,
      practiceTask: `Conduct 2 mock technical interviews practicing STAR explanations, architectural trade-offs, and whiteboard problem solving.`,
      projectTask: `Deploy the full-stack capstone project to a live cloud platform (e.g. Render/Vercel/AWS) with a comprehensive GitHub README, system architecture diagram, and demo video.`,
      estimatedHours: 16,
      completed: false,
    },
  ];

  return {
    title: `${targetJobRole} 5-Week Accelerated Placement Roadmap`,
    summary: `Curriculum prioritizing your identified skill gaps in ${gap1}, ${gap2}, and ${gap3}. Designed to take you from current baseline to placement interview readiness.`,
    durationWeeks: weeks.length,
    weeks,
  };
};

/**
 * Live Google Gemini API Integration for Roadmap Generation
 */
export const generateGeminiRoadmap = async (targetJobRole, currentSkills, missingSkills, skillsToImprove, apiKey) => {
  const roleConfig = ROLE_COMPETENCIES[targetJobRole] || ROLE_COMPETENCIES['Full Stack Developer'];

  const prompt = `You are a Principal Software Engineering Placement Mentor creating an individualized 5-week technical learning roadmap for a campus student.

STUDENT PROFILE:
- Target Job Role: "${targetJobRole}"
- Current Evidenced Skills: ${currentSkills.length > 0 ? currentSkills.join(', ') : 'Basic Academic Fundamentals'}
- Verified Missing Skills (HIGH PRIORITY GAPS): ${missingSkills.length > 0 ? missingSkills.join(', ') : 'None identified'}
- Skills to Deepen/Improve: ${skillsToImprove.length > 0 ? skillsToImprove.join(', ') : 'System Design & Testing'}

REQUIREMENTS:
1. Create exactly 5 progressive weekly milestones (Week 1 to Week 5).
2. Prioritize closing the student's Missing Skills in Weeks 1 and 2.
3. Bridge intermediate skills and system design in Weeks 3 and 4.
4. Conclude with an interview-grade portfolio capstone project in Week 5.
5. Every week MUST include:
   - weekNumber (integer 1-5)
   - topic (string)
   - objective (string)
   - practiceTask (string with specific exercises)
   - projectTask (string with specific buildable project)
   - estimatedHours (integer between 10 and 20)
6. Return STRICT JSON matching this schema:
{
  "title": "Roadmap Title",
  "summary": "2-3 sentence overview of this roadmap strategy",
  "durationWeeks": 5,
  "weeks": [
    {
      "weekNumber": 1,
      "topic": "Topic Name",
      "objective": "Clear milestone objective",
      "practiceTask": "Specific practice exercise",
      "projectTask": "Specific project deliverable",
      "estimatedHours": 12
    }
  ]
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const jsonResponse = await response.json();
  const rawContent = jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawContent) {
    throw new Error('Gemini API returned an empty roadmap payload.');
  }

  const parsed = JSON.parse(rawContent);
  return validateRoadmapResult(parsed);
};

/**
 * Main Roadmap Generator Entrypoint
 */
export const generateRoadmap = async ({ targetJobRole, targetRole, currentSkills = [], missingSkills = [], skillsToImprove = [] }) => {
  const role = targetJobRole || targetRole;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() && apiKey.trim() !== 'your_gemini_api_key_here') {
    try {
      console.log(`[Roadmap Generator] Generating with Google Gemini 2.5 Flash for role "${role}"...`);
      const result = await generateGeminiRoadmap(role, currentSkills, missingSkills, skillsToImprove, apiKey.trim());
      return {
        ...result,
        provider: 'gemini-2.5-flash',
      };
    } catch (err) {
      console.warn(`[Roadmap Generator] Gemini generation notice (${err.message}). Falling back to local curriculum engine.`);
    }
  }

  console.log(`[Roadmap Generator] Generating with Local Curriculum Engine for role "${role}"...`);
  const localResult = generateLocalRoadmap(role, currentSkills, missingSkills, skillsToImprove);
  return {
    ...validateRoadmapResult(localResult),
    provider: 'local-curriculum-engine',
  };
};

export const generatePersonalizedRoadmap = generateRoadmap;

