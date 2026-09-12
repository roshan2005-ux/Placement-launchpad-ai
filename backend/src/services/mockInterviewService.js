import { ROLE_COMPETENCIES } from './aiProvider.js';

/**
 * Curated Question Bank for Local Interview Engine
 * 5 distinct questions per role covering Fundamentals, Technical Deep-Dive,
 * Scenario/Troubleshooting, Scalability/Performance, and Behavioral/Tradeoffs.
 */
const ROLE_INTERVIEW_QUESTIONS = {
  'Full Stack Developer': [
    {
      questionIndex: 0,
      category: 'Technical Fundamentals',
      question: 'Can you walk me through the lifecycle of an HTTP request in a full-stack MERN application, from browser client click to database persistence and back?',
    },
    {
      questionIndex: 1,
      category: 'System Architecture',
      question: 'How do you structure client-side state management in React when dealing with frequent asynchronous server data updates versus local UI state?',
    },
    {
      questionIndex: 2,
      category: 'Scenario & Troubleshooting',
      question: 'Suppose users report that submitting a payment checkout form occasionally charges them twice during high server latency. How would you diagnose and resolve this issue?',
    },
    {
      questionIndex: 3,
      category: 'Performance & Scalability',
      question: 'What strategies would you employ to optimize database query performance and API response times when your application transitions from 1,000 to 100,000 daily active users?',
    },
    {
      questionIndex: 4,
      category: 'Behavioral & Tradeoffs',
      question: 'Describe a situation where you had to compromise between engineering perfection and a tight product delivery deadline. How did you prioritize what to ship?',
    },
  ],
  'Frontend Developer': [
    {
      questionIndex: 0,
      category: 'Technical Fundamentals',
      question: 'Explain the difference between Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Rendering (CSR). When would you choose each in a modern React application?',
    },
    {
      questionIndex: 1,
      category: 'Component Architecture',
      question: 'How do you design a reusable, accessible design-system component (such as an interactive modal or dropdown) complying with WAI-ARIA standards?',
    },
    {
      questionIndex: 2,
      category: 'Scenario & Troubleshooting',
      question: 'Your web app suffers from poor Largest Contentful Paint (LCP) and high Cumulative Layout Shift (CLS) on mobile devices. What steps would you take to audit and fix this?',
    },
    {
      questionIndex: 3,
      category: 'Performance & Optimization',
      question: 'How do you prevent unnecessary component re-renders in a complex React tree with deep nested child components receiving dynamic props?',
    },
    {
      questionIndex: 4,
      category: 'Behavioral & Tradeoffs',
      question: 'Tell me about a time you received critical design feedback on a user interface you spent days building. How did you adapt your implementation?',
    },
  ],
  'Backend Developer': [
    {
      questionIndex: 0,
      category: 'Technical Fundamentals',
      question: 'Explain the ACID properties in relational databases and describe how isolation levels (e.g. Read Committed vs Serializable) impact concurrency and locking.',
    },
    {
      questionIndex: 1,
      category: 'API & Microservices',
      question: 'How do you design secure, stateless token authentication using JWT, and what mechanisms would you implement to support immediate token revocation?',
    },
    {
      questionIndex: 2,
      category: 'Scenario & Troubleshooting',
      question: 'A critical microservice experiences a memory leak and crashes every 4 hours in production under steady traffic. What is your diagnostic methodology to find the culprit?',
    },
    {
      questionIndex: 3,
      category: 'Scalability & Caching',
      question: 'When implementing a multi-tier caching layer with Redis in front of a primary database, how do you handle cache invalidation and prevent cache stampedes?',
    },
    {
      questionIndex: 4,
      category: 'Behavioral & Engineering Ethics',
      question: 'Describe how you handle disagreements with teammate code reviews when deciding between competing architectural patterns or third-party libraries.',
    },
  ],
  'Python Developer': [
    {
      questionIndex: 0,
      category: 'Technical Fundamentals',
      question: 'How does Python’s Global Interpreter Lock (GIL) influence multi-threaded execution, and when would you choose multiprocessing or asyncio instead of threading?',
    },
    {
      questionIndex: 1,
      category: 'Advanced Python',
      question: 'Explain how Python decorators work internally, and write/explain a practical decorator that logs execution time and catches exceptions.',
    },
    {
      questionIndex: 2,
      category: 'Scenario & Debugging',
      question: 'You inherit a legacy Django/FastAPI endpoint executing 50 sequential SQL queries inside a loop (N+1 query problem). How do you refactor it using ORM optimizations?',
    },
    {
      questionIndex: 3,
      category: 'Performance & Architecture',
      question: 'How would you architect a background task worker system in Python to process asynchronous batch operations without blocking incoming web requests?',
    },
    {
      questionIndex: 4,
      category: 'Behavioral',
      question: 'Tell me about a Python project where you had to quickly learn an unfamiliar library or framework under strict deadlines.',
    },
  ],
  'Java Developer': [
    {
      questionIndex: 0,
      category: 'Technical Fundamentals',
      question: 'Explain JVM memory management, specifically distinguishing between the Heap and the Stack, and explain how generational garbage collection operates.',
    },
    {
      questionIndex: 1,
      category: 'Enterprise Architecture',
      question: 'How does Spring Boot’s Inversion of Control (IoC) and Dependency Injection simplify enterprise application development compared to manual bean wiring?',
    },
    {
      questionIndex: 2,
      category: 'Scenario & Concurrency',
      question: 'You notice intermittent race conditions in a multi-threaded Java service updating shared customer balances. How do you ensure thread safety without degrading throughput?',
    },
    {
      questionIndex: 3,
      category: 'Database & Persistence',
      question: 'Explain how Hibernate/JPA caching levels (First-Level vs Second-Level Cache) work, and how you resolve lazy-initialization exceptions.',
    },
    {
      questionIndex: 4,
      category: 'Behavioral',
      question: 'Describe a situation where you refactored complex monolithic Java code into clean, testable modular services.',
    },
  ],
  'Data Analyst': [
    {
      questionIndex: 0,
      category: 'Technical Fundamentals',
      question: 'Walk me through your data cleaning and exploratory data analysis (EDA) pipeline when receiving an uncleaned dataset containing 20% missing values and duplicate rows.',
    },
    {
      questionIndex: 1,
      category: 'SQL & Querying',
      question: 'Explain the difference between SQL window functions (e.g. ROW_NUMBER, RANK, DENSE_RANK) and standard GROUP BY aggregations with a practical scenario.',
    },
    {
      questionIndex: 2,
      category: 'Scenario & Problem Solving',
      question: 'A key executive notices a 15% drop in product signups over the last 7 days. How would you structure your diagnostic analysis to identify the root cause?',
    },
    {
      questionIndex: 3,
      category: 'Statistical Rigor',
      question: 'How do you determine whether a 4% conversion lift in an A/B test is statistically significant or merely random noise? Explain p-values and sample sizing.',
    },
    {
      questionIndex: 4,
      category: 'Stakeholder Communication',
      question: 'How do you communicate complex statistical or technical findings to non-technical executive stakeholders who want quick, actionable takeaways?',
    },
  ],
  'AI/ML Engineer': [
    {
      questionIndex: 0,
      category: 'Technical Fundamentals',
      question: 'Explain the bias-variance tradeoff in machine learning and how you diagnose whether a neural network suffers from underfitting versus overfitting.',
    },
    {
      questionIndex: 1,
      category: 'Deep Learning & Architecture',
      question: 'Explain the core mechanics of the self-attention mechanism in Transformers and why it outperformed traditional recurrent architectures (RNNs/LSTMs) for NLP.',
    },
    {
      questionIndex: 2,
      category: 'Scenario & MLOps',
      question: 'Your deployed recommendation model displays high training and validation accuracy, but user engagement drops by 30% after 3 months in production. What is happening and how do you fix it?',
    },
    {
      questionIndex: 3,
      category: 'Model Optimization',
      question: 'What techniques (such as quantization, pruning, and LoRA/PEFT) do you use when deploying large models onto resource-constrained production environments?',
    },
    {
      questionIndex: 4,
      category: 'Behavioral & Responsible AI',
      question: 'How do you evaluate and safeguard machine learning models against systemic bias or unfairness in training data?',
    },
  ],
  'Cybersecurity Analyst': [
    {
      questionIndex: 0,
      category: 'Technical Fundamentals',
      question: 'Explain the differences between Symmetric and Asymmetric encryption and how TLS/HTTPS utilizes both during the initial secure connection handshake.',
    },
    {
      questionIndex: 1,
      category: 'Threat Analysis',
      question: 'Walk me through the OWASP Top 10, focusing on how SQL Injection and Cross-Site Scripting (XSS) occur and the exact architectural defenses to prevent them.',
    },
    {
      questionIndex: 2,
      category: 'Incident Response Scenario',
      question: 'You detect anomalous outbound traffic at 2 AM with massive data transfers to an unknown external IP from an internal database server. What are your immediate first 3 actions?',
    },
    {
      questionIndex: 3,
      category: 'Network Defense',
      question: 'How do you utilize Wireshark and SIEM log correlation to distinguish legitimate developer API traffic from a distributed denial-of-service (DDoS) attack?',
    },
    {
      questionIndex: 4,
      category: 'Behavioral & Governance',
      question: 'How do you balance strict security compliance protocols with developer productivity when engineering teams resist security friction?',
    },
  ],
};

/**
 * Generates 5 role-specific interview questions
 */
export const generateQuestions = async (targetJobRole) => {
  const fallback = ROLE_INTERVIEW_QUESTIONS[targetJobRole] || ROLE_INTERVIEW_QUESTIONS['Full Stack Developer'];
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() && apiKey.trim() !== 'your_gemini_api_key_here') {
    try {
      const prompt = `You are an expert technical hiring manager conducting a technical interview for a campus placement candidate aiming for the role of "${targetJobRole}".
Generate exactly 5 realistic, rigorous interview questions covering:
1. Technical fundamentals
2. System design / Core concept deep-dive
3. Practical problem-solving / debugging scenario
4. Scalability, performance, or security optimization
5. Behavioral / technical decision tradeoff

Respond ONLY with valid JSON in this exact schema:
{
  "questions": [
    { "questionIndex": 0, "category": "Technical Fundamentals", "question": "..." },
    { "questionIndex": 1, "category": "System Architecture", "question": "..." },
    { "questionIndex": 2, "category": "Scenario & Troubleshooting", "question": "..." },
    { "questionIndex": 3, "category": "Optimization & Performance", "question": "..." },
    { "questionIndex": 4, "category": "Behavioral & Tradeoffs", "question": "..." }
  ]
}`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, responseMimeType: 'application/json' },
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed.questions) && parsed.questions.length === 5) {
            return {
              provider: 'gemini-2.5-flash',
              questions: parsed.questions.map((q, idx) => ({
                questionIndex: idx,
                category: q.category || fallback[idx].category,
                question: q.question || fallback[idx].question,
                studentAnswer: '',
                score: 0,
                feedback: '',
                improvementTip: '',
                dimensions: { correctness: 0, relevance: 0, technicalDepth: 0, clarity: 0, communication: 0 },
              })),
            };
          }
        }
      }
    } catch (err) {
      console.warn('[AI Interview Notice]: Gemini generation failed, using structured local bank.', err.message);
    }
  }

  return {
    provider: 'local-interview-engine',
    questions: fallback.map((q) => ({
      questionIndex: q.questionIndex,
      category: q.category,
      question: q.question,
      studentAnswer: '',
      score: 0,
      feedback: '',
      improvementTip: '',
      dimensions: { correctness: 0, relevance: 0, technicalDepth: 0, clarity: 0, communication: 0 },
    })),
  };
};

/**
 * Evaluates student answer using Gemini or Local Evaluation Engine
 */
export const evaluateAnswer = async ({ targetJobRole, question, studentAnswer }) => {
  const cleanAnswer = (studentAnswer || '').trim();
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() && apiKey.trim() !== 'your_gemini_api_key_here') {
    try {
      const prompt = `You are a senior technical interviewer evaluating a student candidate's answer for the role of "${targetJobRole}".

Question:
"${question}"

Candidate Answer:
"${cleanAnswer}"

Evaluate the candidate's answer strictly and constructively on a 0-100 scale across 5 dimensions:
1. correctness (0-100): accuracy of technical concepts
2. relevance (0-100): directly addressing the core question asked
3. technicalDepth (0-100): depth of explanation, algorithms, or mechanics
4. clarity (0-100): logical flow and structural coherence
5. communication (0-100): professional articulation and technical terminology

Respond ONLY with valid JSON in this exact schema:
{
  "correctness": 85,
  "relevance": 90,
  "technicalDepth": 80,
  "clarity": 85,
  "communication": 85,
  "feedback": "Concise 2-sentence critique highlighting technical merits and key missing aspects.",
  "improvementTip": "One actionable tip to elevate this answer to top-tier campus interview caliber."
}`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          const correctness = Math.min(100, Math.max(0, Math.round(Number(parsed.correctness) || 70)));
          const relevance = Math.min(100, Math.max(0, Math.round(Number(parsed.relevance) || 75)));
          const technicalDepth = Math.min(100, Math.max(0, Math.round(Number(parsed.technicalDepth) || 65)));
          const clarity = Math.min(100, Math.max(0, Math.round(Number(parsed.clarity) || 75)));
          const communication = Math.min(100, Math.max(0, Math.round(Number(parsed.communication) || 75)));

          const score = Math.round((correctness + relevance + technicalDepth + clarity + communication) / 5);

          return {
            score,
            dimensions: { correctness, relevance, technicalDepth, clarity, communication },
            feedback: parsed.feedback || 'Good structured response with relevant points.',
            improvementTip: parsed.improvementTip || 'Incorporate concrete real-world examples and metric benchmarks.',
          };
        }
      }
    } catch (err) {
      console.warn('[AI Interview Notice]: Gemini answer evaluation failed, falling back to local heuristic evaluator.', err.message);
    }
  }

  // Local Semantic Heuristic Evaluator
  return evaluateWithLocalEngine(targetJobRole, question, cleanAnswer);
};

/**
 * Built-in Local Heuristic Evaluator (Deterministic & Grounded)
 */
const evaluateWithLocalEngine = (targetJobRole, question, answer) => {
  const words = answer.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 10) {
    return {
      score: 35,
      dimensions: { correctness: 40, relevance: 45, technicalDepth: 25, clarity: 35, communication: 30 },
      feedback: 'Answer is too brief to adequately demonstrate technical depth or competency.',
      improvementTip: 'Elaborate on core mechanisms, architectural decisions, and trade-offs rather than providing single-sentence answers.',
    };
  }

  const roleConfig = ROLE_COMPETENCIES[targetJobRole] || ROLE_COMPETENCIES['Full Stack Developer'];
  const answerLower = answer.toLowerCase();

  // Count domain skills and technical terminology
  let matchedTerms = 0;
  roleConfig.coreSkills.forEach((skill) => {
    if (answerLower.includes(skill.toLowerCase())) matchedTerms++;
  });
  roleConfig.importantConcepts.forEach((concept) => {
    if (answerLower.includes(concept.toLowerCase())) matchedTerms += 2;
  });

  // Calculate dimension scores based on depth, terminology, and length
  let correctness = Math.min(95, 60 + matchedTerms * 5);
  let relevance = Math.min(95, 65 + (answerLower.includes('because') || answerLower.includes('example') ? 15 : 5));
  let technicalDepth = Math.min(95, Math.min(60 + Math.floor(wordCount / 4), 95));
  let clarity = Math.min(95, 70 + (words.length >= 30 ? 15 : 5));
  let communication = Math.min(95, 68 + (matchedTerms > 1 ? 15 : 5));

  const score = Math.round((correctness + relevance + technicalDepth + clarity + communication) / 5);

  let feedback = 'Clear explanation touching on critical concepts relevant to the role.';
  if (score >= 85) {
    feedback = 'Strong, articulate answer demonstrating mature architectural awareness and practical engineering judgment.';
  } else if (score >= 70) {
    feedback = 'Competent answer covering the primary requirements, though deeper discussion of edge cases would strengthen it.';
  } else {
    feedback = 'Foundational points mentioned, but missing specific implementation details and operational mechanics.';
  }

  const improvementTip = matchedTerms < 2
    ? `Reference specific technologies like ${roleConfig.coreSkills.slice(0, 3).join(', ')} to ground your answer in industry standards.`
    : 'Provide a concrete metric (e.g. latency reduction, throughput, cache hit ratio) to make your reasoning compelling to hiring managers.';

  return {
    score,
    dimensions: { correctness, relevance, technicalDepth, clarity, communication },
    feedback,
    improvementTip,
  };
};

/**
 * Summarizes full 5-question interview into final results
 */
export const finalizeInterview = (questions = []) => {
  if (!questions.length) {
    return {
      overallScore: 0,
      technicalPerformance: 0,
      answerRelevance: 0,
      communication: 0,
      areasToImprove: ['Complete all interview questions to generate performance metrics.'],
      aiFeedback: 'No questions answered.',
    };
  }

  let totalScore = 0;
  let totalTech = 0;
  let totalRel = 0;
  let totalComm = 0;

  questions.forEach((q) => {
    totalScore += q.score || 0;
    const dims = q.dimensions || { correctness: 70, relevance: 70, technicalDepth: 70, clarity: 70, communication: 70 };
    totalTech += (dims.correctness + dims.technicalDepth) / 2;
    totalRel += dims.relevance;
    totalComm += (dims.clarity + dims.communication) / 2;
  });

  const count = questions.length;
  const overallScore = Math.round(totalScore / count);
  const technicalPerformance = Math.round(totalTech / count);
  const answerRelevance = Math.round(totalRel / count);
  const communication = Math.round(totalComm / count);

  // Identify areas to improve
  const areasToImprove = [];
  if (technicalPerformance < 75) {
    areasToImprove.push('Technical Depth & Low-Level Mechanics');
  }
  if (answerRelevance < 75) {
    areasToImprove.push('Direct Question Alignment & Scoping');
  }
  if (communication < 75) {
    areasToImprove.push('Clarity of Structure & Executive Articulation');
  }
  if (areasToImprove.length === 0) {
    areasToImprove.push('Quantifying System Impact with Metrics');
    areasToImprove.push('Discussing Failure Modes & Edge-Case Resiliency');
  }

  let aiFeedback = '';
  if (overallScore >= 80) {
    aiFeedback = `Outstanding mock interview demonstration! You displayed strong technical command, relevant problem-solving frameworks, and articulate communication appropriate for top-tier campus placement rounds. Focus on quantifying system trade-offs to reach elite status.`;
  } else if (overallScore >= 65) {
    aiFeedback = `Solid performance with demonstrated core competencies. You answered questions with good relevance and conceptual clarity. To convert more technical interviews, deepen your explanations of system internals and edge-case handling.`;
  } else {
    aiFeedback = `Good foundational attempt. Your answers conveyed conceptual familiarity, but lacked the rigorous technical depth and structured articulation interviewers look for. Review foundational roadmap topics and practice explaining architectural decisions aloud.`;
  }

  return {
    overallScore,
    technicalPerformance,
    answerRelevance,
    communication,
    areasToImprove,
    aiFeedback,
  };
};
