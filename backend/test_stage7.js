const BASE_URL = 'http://localhost:5000/api';

const runStage7Tests = async () => {
  console.log('=== STAGE 7: SKILL ASSESSMENT, AI MOCK INTERVIEW & PLACEMENT READINESS VERIFICATION ===\n');
  let passCount = 0;
  let failCount = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passCount++;
    } else {
      console.error(`[FAIL] ${testName} - ${details}`);
      failCount++;
    }
  };

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    assert(healthRes.status === 200, 'GET /api/health returns 200 OK');

    // 2. Unauthorized access checks
    const unauthQuestions = await fetch(`${BASE_URL}/assessment/questions`);
    assert(unauthQuestions.status === 401, 'GET /api/assessment/questions without token returns 401 Unauthorized');

    const unauthSubmit = await fetch(`${BASE_URL}/assessment/submit`, { method: 'POST' });
    assert(unauthSubmit.status === 401, 'POST /api/assessment/submit without token returns 401 Unauthorized');

    const unauthInterviewStart = await fetch(`${BASE_URL}/interview/start`, { method: 'POST' });
    assert(unauthInterviewStart.status === 401, 'POST /api/interview/start without token returns 401 Unauthorized');

    const unauthReadiness = await fetch(`${BASE_URL}/readiness`);
    assert(unauthReadiness.status === 401, 'GET /api/readiness without token returns 401 Unauthorized');

    // 3. Register Primary Student A
    const timestamp = Date.now();
    const studentA = {
      name: 'Rohan Sharma',
      email: `rohan_${timestamp}@placementai.edu`,
      password: 'SecurePassword2026!',
    };

    const regResA = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentA),
    });
    const regDataA = await regResA.json();
    const tokenA = regDataA.token;
    assert(regResA.status === 201 && Boolean(tokenA), 'POST /api/auth/register creates Student A');

    // Set Student A's target job role
    const profileUpdateRes = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        targetJobRole: 'Full Stack Developer',
        skills: ['JavaScript', 'React', 'Node.js'],
      }),
    });
    assert(profileUpdateRes.status === 200, 'PUT /api/profile configures target role as Full Stack Developer');

    // ==========================================
    // PART 1 & 2: SKILL ASSESSMENT TESTS
    // ==========================================
    console.log('\n--- Part 1 & 2: Skill Assessment Tests ---');

    // Fetch questions for target role
    const questionsRes = await fetch(`${BASE_URL}/assessment/questions`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const questionsData = await questionsRes.json();
    assert(questionsRes.status === 200, 'GET /api/assessment/questions returns 200 OK');
    assert(Array.isArray(questionsData.questions), 'Assessment questions is an array');
    assert(questionsData.questions.length === 10, 'Assessment returns exactly 10 questions for role');

    // Security check: ensure correctAnswer is NOT exposed in questions
    const hasExposedAnswer = questionsData.questions.some(q => q.correctAnswer !== undefined);
    assert(!hasExposedAnswer, 'Security: Correct answers are NOT exposed in questions endpoint');

    // Check structure of questions
    const q1 = questionsData.questions[0];
    assert(Boolean(q1.questionId && q1.question && Array.isArray(q1.options) && q1.options.length === 4),
      'Each question has questionId, question text, and 4 options');
    assert(Boolean(q1.category && q1.difficulty), 'Each question includes category and difficulty tags');

    // Test specific role query
    const feQuestionsRes = await fetch(`${BASE_URL}/assessment/questions?role=Frontend%20Developer`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const feQuestionsData = await feQuestionsRes.json();
    assert(feQuestionsRes.status === 200 && feQuestionsData.role === 'Frontend Developer',
      'GET /api/assessment/questions?role=Frontend Developer filters questions by role');

    // Submit Assessment with valid answers
    // Let's create an answers payload for all 10 questions (selecting index 0 for all)
    const answersPayload = questionsData.questions.map(q => ({
      questionId: q.questionId,
      selectedOption: 0,
    }));

    const submitRes = await fetch(`${BASE_URL}/assessment/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        role: 'Full Stack Developer',
        answers: answersPayload,
      }),
    });
    const submitData = await submitRes.json();
    assert(submitRes.status === 200, 'POST /api/assessment/submit returns 200 OK');
    assert(typeof submitData.assessment.score === 'number' && submitData.assessment.score >= 0 && submitData.assessment.score <= 100,
      'Assessment score is a valid number between 0 and 100');
    assert(typeof submitData.assessment.passed === 'boolean', 'Assessment contains passed boolean (score >= 60)');
    assert(submitData.assessment.totalQuestions === 10, 'Assessment totalQuestions is 10');
    assert(Boolean(submitData.assessment.categoryBreakdown), 'Assessment includes category breakdown');
    assert(Array.isArray(submitData.assessment.strongAreas) && Array.isArray(submitData.assessment.weakAreas),
      'Assessment identifies strongAreas and weakAreas arrays');
    assert(submitData.assessment.answers.length === 10 && submitData.assessment.answers[0].explanation,
      'Assessment results include detailed explanations for each question');

    // Get latest assessment
    const latestAssRes = await fetch(`${BASE_URL}/assessment/latest`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const latestAssData = await latestAssRes.json();
    assert(latestAssRes.status === 200 && latestAssData.assessment !== null, 'GET /api/assessment/latest returns saved assessment');
    assert(latestAssData.assessment._id === submitData.assessment._id, 'Latest assessment matches submitted assessment ID');

    // ==========================================
    // PART 3 & 4: AI MOCK INTERVIEW TESTS
    // ==========================================
    console.log('\n--- Part 3 & 4: AI Mock Interview Tests ---');

    // Start a new interview session
    const startInterviewRes = await fetch(`${BASE_URL}/interview/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ role: 'Full Stack Developer' }),
    });
    const startInterviewData = await startInterviewRes.json();
    assert(startInterviewRes.status === 201, 'POST /api/interview/start returns 201 Created');
    const interviewId = startInterviewData.interview && (startInterviewData.interview._id || startInterviewData.interview.id);
    assert(Boolean(interviewId), 'Interview session created with valid ID');
    assert(Array.isArray(startInterviewData.interview.questions) && startInterviewData.interview.questions.length === 5,
      'Interview contains exactly 5 interview questions');
    assert(startInterviewData.interview.status === 'in_progress', 'Interview status starts as in_progress');

    // Submit Answer for Question 1
    const answer1Res = await fetch(`${BASE_URL}/interview/${interviewId}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        questionIndex: 0,
        answer: 'In React, the virtual DOM is an in-memory lightweight representation of the actual DOM. When component state changes, React creates a new virtual DOM tree, diffs it with the previous tree using the reconciliation algorithm, and batches minimal updates to the real DOM to optimize performance and prevent costly reflows.',
      }),
    });
    const answer1Data = await answer1Res.json();
    assert(answer1Res.status === 200, 'POST /api/interview/:id/answer evaluates Question 1 successfully');
    const eval1 = answer1Data.interview.questions[0].evaluation;
    assert(Boolean(eval1 && typeof eval1.score === 'number' && eval1.score >= 50),
      'Evaluation provides score >= 50 for thorough technical answer');
    assert(Boolean(eval1.dimensions && eval1.dimensions.correctness && eval1.dimensions.technicalDepth),
      'Evaluation includes 5-dimensional breakdown (correctness, depth, clarity, relevance, communication)');
    assert(Boolean(eval1.feedback), 'Evaluation provides constructive feedback');

    // Submit Answers for remaining questions 2 to 5 to complete session
    const mockAnswers = [
      'REST relies on standard HTTP methods like GET, POST, PUT, DELETE and stateless endpoints. GraphQL uses a single endpoint with queries and mutations, allowing the client to request exactly the fields required, solving over-fetching and under-fetching.',
      'To optimize slow database queries, I index frequently filtered or joined columns, analyze query execution plans with EXPLAIN ANALYZE, implement Redis caching for repeated reads, and use connection pooling.',
      'When resolving conflicts in a cross-functional engineering team, I first ground discussions in data and business goals, listen actively to alternative viewpoints, find compromise points, and align on team delivery milestones.',
      'I would break the microservices architecture using Docker containers, managed via Kubernetes or AWS ECS, with an API gateway for authentication and rate limiting, asynchronous message brokers like RabbitMQ or Kafka, and centralized logging.',
    ];

    for (let i = 1; i < 5; i++) {
      const ansRes = await fetch(`${BASE_URL}/interview/${interviewId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenA}`,
        },
        body: JSON.stringify({
          questionIndex: i,
          answer: mockAnswers[i - 1],
        }),
      });
      const ansData = await ansRes.json();
      if (i === 4) {
        assert(ansData.interview.status === 'completed', 'Interview session transitions to completed after 5th answer');
        assert(typeof ansData.interview.overallScore === 'number' && ansData.interview.overallScore > 0,
          'Completed interview computes overall composite score');
        assert(Array.isArray(ansData.interview.strengths) && Array.isArray(ansData.interview.improvements),
          'Completed interview generates overall strengths and improvement points');
      }
    }

    // Get latest interview
    const latestIntRes = await fetch(`${BASE_URL}/interview/latest`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const latestIntData = await latestIntRes.json();
    assert(latestIntRes.status === 200 && latestIntData.interview !== null, 'GET /api/interview/latest returns latest interview');
    assert(latestIntData.interview._id === interviewId || latestIntData.interview.id === interviewId, 'Latest interview matches completed session ID');

    // ==========================================
    // PART 5 & 6: PLACEMENT READINESS SCORE & RECOMMENDATIONS
    // ==========================================
    console.log('\n--- Part 5 & 6: Placement Readiness & Recommendations Tests ---');

    const readinessRes = await fetch(`${BASE_URL}/readiness`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const readinessData = await readinessRes.json();
    assert(readinessRes.status === 200, 'GET /api/readiness returns 200 OK');
    assert(typeof readinessData.readiness.overallScore === 'number' && readinessData.readiness.overallScore >= 0 && readinessData.readiness.overallScore <= 100,
      'Placement Readiness score is between 0 and 100');
    assert(Boolean(readinessData.readiness.level), 'Readiness provides a qualitative tier level');
    assert(Boolean(readinessData.readiness.breakdown), 'Readiness provides 5-component breakdown');
    assert(readinessData.readiness.breakdown.assessmentScore.status === 'completed',
      'Readiness breakdown accurately marks assessment as completed');
    assert(readinessData.readiness.breakdown.interviewScore.status === 'completed',
      'Readiness breakdown accurately marks interview as completed');

    // Recommendations endpoint
    const recsRes = await fetch(`${BASE_URL}/readiness/recommendations`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const recsData = await recsRes.json();
    assert(recsRes.status === 200, 'GET /api/readiness/recommendations returns 200 OK');
    assert(Array.isArray(recsData.recommendations) && recsData.recommendations.length > 0,
      'Returns list of personalized actionable recommendations');
    const r1 = recsData.recommendations[0];
    assert(Boolean(r1.title && r1.description && r1.priority && r1.actionLink),
      'Each recommendation includes title, description, priority, and navigation link');

    // ==========================================
    // MULTI-STUDENT ISOLATION CHECKS
    // ==========================================
    console.log('\n--- Multi-Student Isolation Tests ---');

    // Register Student B
    const studentB = {
      name: 'Ananya Roy',
      email: `ananya_${timestamp}@placementai.edu`,
      password: 'SecurePassword2026!',
    };

    const regResB = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentB),
    });
    const regDataB = await regResB.json();
    const tokenB = regDataB.token;

    // Student B should have no latest assessment or interview yet
    const latestAssB = await fetch(`${BASE_URL}/assessment/latest`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const latestAssBData = await latestAssB.json();
    assert(latestAssBData.assessment === null, 'Student B has null latest assessment (isolated from Student A)');

    const latestIntB = await fetch(`${BASE_URL}/interview/latest`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const latestIntBData = await latestIntB.json();
    assert(latestIntBData.interview === null, 'Student B has null latest interview (isolated from Student A)');

    // Student B cannot submit answers to Student A's interview
    const crossAnswer = await fetch(`${BASE_URL}/interview/${interviewId}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({ questionIndex: 0, answer: 'Unauthorized attempt' }),
    });
    assert(crossAnswer.status === 404 || crossAnswer.status === 403,
      'Student B cannot access or answer Student A interview (returns 404/403)');

    console.log('\n==========================================');
    console.log(`STAGE 7 RESULTS: ${passCount} Passed, ${failCount} Failed`);
    console.log('==========================================\n');

    if (failCount > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('[ERROR during Stage 7 testing]:', err);
    process.exit(1);
  }
};

runStage7Tests();
