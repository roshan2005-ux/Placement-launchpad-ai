// Role Competency Matrices for the 8 Target Roles
export const ROLE_COMPETENCIES = {
  'Full Stack Developer': {
    coreSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'HTML5', 'CSS3', 'MongoDB', 'SQL', 'Git', 'REST APIs', 'Tailwind CSS'],
    importantConcepts: ['Full Stack Architecture', 'State Management', 'Database Modeling', 'API Integration', 'Authentication'],
    roleContext: 'modern web application architecture spanning client interfaces, server middleware, and persistent databases',
  },
  'Frontend Developer': {
    coreSkills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'Responsive Design', 'Git', 'Web Performance'],
    importantConcepts: ['Component Lifecycle', 'UI/UX Accessibility', 'State Management', 'Cross-Browser Compatibility', 'API Integration'],
    roleContext: 'dynamic, responsive, and accessible user interfaces built with modern component architectures and styling frameworks',
  },
  'Backend Developer': {
    coreSkills: ['Node.js', 'Express', 'Python', 'Java', 'SQL', 'PostgreSQL', 'MongoDB', 'REST APIs', 'Docker', 'Redis', 'Git', 'Authentication'],
    importantConcepts: ['API Architecture', 'Database Optimization', 'Caching', 'Security & JWT', 'Server Scalability'],
    roleContext: 'robust server-side systems, RESTful microservices, database transactions, and scalable API pipelines',
  },
  'Python Developer': {
    coreSkills: ['Python', 'Django', 'FastAPI', 'Flask', 'SQLAlchemy', 'PostgreSQL', 'Git', 'OOP', 'pytest', 'REST APIs', 'Docker'],
    importantConcepts: ['Pythonic Design Patterns', 'Asynchronous Programming', 'Unit Testing', 'ORM Database Mapping', 'API Development'],
    roleContext: 'clean, object-oriented Python services, backend web frameworks, and automated script pipelines',
  },
  'Java Developer': {
    coreSkills: ['Java', 'Spring Boot', 'Hibernate', 'JPA', 'SQL', 'MySQL', 'Maven', 'Gradle', 'JUnit', 'REST APIs', 'Microservices', 'Git'],
    importantConcepts: ['OOP Design Patterns', 'Dependency Injection', 'Multi-threading', 'Enterprise Persistence', 'Unit Testing'],
    roleContext: 'enterprise Java architectures, robust Spring Boot microservices, and high-concurrency server applications',
  },
  'Data Analyst': {
    coreSkills: ['SQL', 'Python', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Excel', 'Data Visualization', 'Statistics', 'EDA', 'Git'],
    importantConcepts: ['Data Cleansing', 'Statistical Hypothesis Testing', 'Dashboard Design', 'Business Metric Calculation', 'ETL Pipelines'],
    roleContext: 'data wrangling, actionable KPI reporting, visual dashboarding, and empirical decision support',
  },
  'AI/ML Engineer': {
    coreSkills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'NLP', 'Computer Vision', 'Git'],
    importantConcepts: ['Model Training & Evaluation', 'Hyperparameter Tuning', 'Feature Engineering', 'Loss Functions & Optimization', 'Data Preprocessing'],
    roleContext: 'predictive machine learning pipelines, deep neural networks, model fine-tuning, and algorithmic evaluation',
  },
  'Cybersecurity Analyst': {
    coreSkills: ['Network Security', 'Linux', 'Vulnerability Assessment', 'Penetration Testing', 'SIEM', 'Cryptography', 'Wireshark', 'OWASP Top 10', 'Python', 'Firewalls'],
    importantConcepts: ['Threat Modeling', 'Incident Response', 'Packet Analysis', 'Identity & Access Management', 'Security Compliance'],
    roleContext: 'proactive vulnerability detection, network defense, threat analysis, and enterprise security auditing',
  },
};

/**
 * Validates and sanitizes AI analysis payload against the required schema
 */
export const validateAnalysisResult = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('AI analysis output is not a valid JSON object.');
  }

  // Ensure overallMatch is an integer between 0 and 100
  let overallMatch = Math.round(Number(data.overallMatch));
  if (isNaN(overallMatch)) overallMatch = 50;
  overallMatch = Math.max(0, Math.min(100, overallMatch));

  const summary = typeof data.summary === 'string' && data.summary.trim()
    ? data.summary.trim()
    : 'Candidate resume evaluated against role standards.';

  const ensureStringArray = (arr, fallback = []) => {
    if (!Array.isArray(arr)) return fallback;
    return arr
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item.length > 0);
  };

  const strongSkills = ensureStringArray(data.strongSkills);
  const skillsToImprove = ensureStringArray(data.skillsToImprove);
  const missingSkills = ensureStringArray(data.missingSkills);
  const recommendations = ensureStringArray(data.recommendations);
  const roleSpecificFeedback = ensureStringArray(data.roleSpecificFeedback);

  return {
    overallMatch,
    summary,
    strongSkills,
    skillsToImprove,
    missingSkills,
    recommendations,
    roleSpecificFeedback,
  };
};

/**
 * Built-in Semantic Heuristic Engine (Offline / Local Provider)
 * Evaluates the actual extracted text strictly against the role competencies
 */
export const analyzeWithLocalEngine = (resumeText, targetJobRole) => {
  const roleConfig = ROLE_COMPETENCIES[targetJobRole] || ROLE_COMPETENCIES['Full Stack Developer'];
  const textLower = resumeText.toLowerCase();

  const foundSkills = [];
  const missingSkills = [];
  const partialSkills = [];

  // Match core skills strictly against the extracted text
  for (const skill of roleConfig.coreSkills) {
    const escaped = skill.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    // Word boundary match
    const regex = new RegExp(`(^|[^a-zA-Z0-9#+])${escaped}([^a-zA-Z0-9#+]|$)`, 'i');

    if (regex.test(textLower)) {
      foundSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  // Check general foundational developer attributes in text
  const foundationalKeywords = ['git', 'github', 'project', 'api', 'database', 'problem solving', 'dsa', 'data structures'];
  for (const kw of foundationalKeywords) {
    if (textLower.includes(kw) && !foundSkills.some(s => s.toLowerCase() === kw)) {
      partialSkills.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }

  // Calculate grounded match score based strictly on evidence in resume
  const totalCore = roleConfig.coreSkills.length;
  const matchRatio = foundSkills.length / totalCore;
  let overallMatch = Math.round(matchRatio * 85); // Up to 85% based on core skills
  if (foundSkills.length > 0 && partialSkills.length > 0) {
    overallMatch += Math.min(15, partialSkills.length * 3); // Bonus up to 15% for foundational breadth
  }
  overallMatch = Math.max(15, Math.min(95, overallMatch)); // Bound within 15 - 95

  // Generate explainable, grounded summary
  let summary = '';
  if (foundSkills.length >= 6) {
    summary = `Strong foundational alignment for ${targetJobRole}. Candidate's resume demonstrates direct experience with key technologies including ${foundSkills.slice(0, 4).join(', ')}. To maximize hiring readiness, bridge the gaps in ${missingSkills.slice(0, 2).join(' and ')}.`;
  } else if (foundSkills.length >= 3) {
    summary = `Moderate candidate alignment for ${targetJobRole}. Verified practical evidence of ${foundSkills.join(', ')} found in resume. However, key competencies such as ${missingSkills.slice(0, 3).join(', ')} are currently unevidenced.`;
  } else if (foundSkills.length > 0) {
    summary = `Developing profile for ${targetJobRole}. Candidate evidences introductory exposure to ${foundSkills.join(', ')}, but major industry requirements (${missingSkills.slice(0, 4).join(', ')}) are missing from the resume.`;
  } else {
    summary = `Limited direct alignment for ${targetJobRole}. While academic coursework is present, the resume does not show verifiable projects or skills in primary technologies like ${roleConfig.coreSkills.slice(0, 4).join(', ')}.`;
  }

  // Generate actionable recommendations
  const recommendations = [
    missingSkills.length > 0
      ? `Prioritize building a production-grade portfolio project incorporating ${missingSkills.slice(0, 2).join(' and ')}.`
      : `Add quantifiable performance metrics and deployment URLs to your top projects.`,
    foundSkills.length > 0
      ? `Deepen your demonstrated expertise in ${foundSkills[0]} by implementing advanced patterns (e.g. state management, caching, or automated testing).`
      : `Complete hands-on foundational tutorials in ${roleConfig.coreSkills[0]} and commit code to GitHub.`,
    `Refactor your project descriptions using the STAR framework (Situation, Task, Action, Result) with measurable impact.`,
  ];

  // Generate role-specific feedback
  const roleSpecificFeedback = [
    `For a ${targetJobRole}, recruiters expect clear evidence of ${roleConfig.roleContext}.`,
    missingSkills.length > 0
      ? `The resume lacks explicit evidence of ${missingSkills.slice(0, 3).join(', ')}, which are frequently tested in placement screening rounds.`
      : `Your core technical stack matches placement expectations well. Ensure system design fundamentals are reviewed.`,
    `Ensure your GitHub repositories for projects mentioned in the resume have comprehensive README documentation and live demo links.`,
  ];

  return {
    overallMatch,
    summary,
    strongSkills: foundSkills.length > 0 ? foundSkills : ['Basic Academic Fundamentals'],
    skillsToImprove: partialSkills.length > 0 ? partialSkills : ['Portfolio Project Deployment', 'Code Architecture'],
    missingSkills: missingSkills.slice(0, 6),
    recommendations,
    roleSpecificFeedback,
  };
};

/**
 * Live Google Gemini API Integration
 */
export const analyzeWithGemini = async (resumeText, targetJobRole, apiKey) => {
  const roleConfig = ROLE_COMPETENCIES[targetJobRole] || ROLE_COMPETENCIES['Full Stack Developer'];

  const prompt = `You are a Senior Placement Director and Technical Hiring Bar Raiser evaluating a college student's resume for campus placements.

TARGET ROLE: "${targetJobRole}"
TARGET ROLE EXPECTATIONS:
- Core Technologies: ${roleConfig.coreSkills.join(', ')}
- Context: ${roleConfig.roleContext}

STUDENT RESUME EXTRACTED TEXT:
"""
${resumeText.slice(0, 15000)}
"""

CRITICAL EVALUATION INSTRUCTIONS:
1. STRICT GROUNDING: You must ONLY identify skills, projects, certifications, or technologies that are EXPLICITLY supported by the resume text above.
2. DO NOT INVENT or assume any skills, projects, or achievements not written in the text.
3. If an expected skill is NOT found in the resume, place it in "missingSkills".
4. "strongSkills": Skills that are clearly evidenced with projects, coursework, or descriptions in the resume.
5. "skillsToImprove": Skills mentioned superficially or where deeper production-level depth is needed for a ${targetJobRole}.
6. "missingSkills": Key ${targetJobRole} requirements that are completely absent from the resume.
7. "overallMatch": An integer between 0 and 100 reflecting the genuine match percentage based solely on evidence found.
8. Return STRICT JSON with no markdown backticks, matching exactly this structure:
{
  "overallMatch": 0,
  "summary": "Concise executive summary of candidate readiness and gaps",
  "strongSkills": ["skill1", "skill2"],
  "skillsToImprove": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "recommendations": ["actionable advice 1", "actionable advice 2"],
  "roleSpecificFeedback": ["feedback 1", "feedback 2"]
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const jsonResponse = await response.json();
  const rawContent = jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawContent) {
    throw new Error('Gemini API returned an empty response.');
  }

  const parsed = JSON.parse(rawContent);
  return validateAnalysisResult(parsed);
};

/**
 * Main AI Provider Entrypoint: routes to Gemini if configured, or falls back gracefully to local engine
 */
export const analyzeResume = async (resumeText, targetJobRole) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() && apiKey.trim() !== 'your_gemini_api_key_here') {
    try {
      console.log(`[AI Provider] Analyzing with Google Gemini 2.5 Flash for role "${targetJobRole}"...`);
      const result = await analyzeWithGemini(resumeText, targetJobRole, apiKey.trim());
      return {
        ...result,
        provider: 'gemini-2.5-flash',
        configured: true,
      };
    } catch (geminiError) {
      console.warn(`[AI Provider] Gemini API invocation failed (${geminiError.message}). Falling back to local semantic engine.`);
    }
  }

  console.log(`[AI Provider] Analyzing with Local Semantic Heuristic Engine for role "${targetJobRole}"...`);
  const localResult = analyzeWithLocalEngine(resumeText, targetJobRole);
  return {
    ...validateAnalysisResult(localResult),
    provider: 'local-engine',
    configured: Boolean(apiKey && apiKey.trim()),
  };
};
