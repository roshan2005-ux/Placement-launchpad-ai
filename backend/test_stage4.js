import { extractTextFromFile, cleanText } from './src/services/textExtractionService.js';
import { validateAnalysisResult, analyzeWithLocalEngine, ROLE_COMPETENCIES } from './src/services/aiProvider.js';

const BASE_URL = 'http://localhost:5000/api';

const runStage4Tests = async () => {
  console.log('=== STAGE 4: AI RESUME ANALYSIS VERIFICATION ===\n');
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

    // 2. Unauthorized analysis check
    const unauthRes = await fetch(`${BASE_URL}/analysis/resume`, { method: 'POST' });
    assert(unauthRes.status === 401, 'POST /api/analysis/resume without token returns 401 Unauthorized');

    const unauthGet = await fetch(`${BASE_URL}/analysis/resume`);
    assert(unauthGet.status === 401, 'GET /api/analysis/resume without token returns 401 Unauthorized');

    // 3. Register a test student for Stage 4
    const timestamp = Date.now();
    const testUser = {
      name: 'Vignesh Raman',
      email: `vignesh_${timestamp}@placementai.edu`,
      password: 'SecurePassword2026!',
    };

    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const registerData = await registerRes.json();
    const token = registerData.token;
    assert(registerRes.status === 201 && Boolean(token), 'POST /api/auth/register creates student account');

    // 4. Test analysis without target role and without resume
    const noRoleRes = await fetch(`${BASE_URL}/analysis/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const noRoleData = await noRoleRes.json();
    assert(
      noRoleRes.status === 400 && noRoleData.message.includes('target job role'),
      'POST /api/analysis/resume rejects request without target job role (400)'
    );

    // Set target job role to 'Full Stack Developer'
    await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetJobRole: 'Full Stack Developer' }),
    });

    // 5. Test analysis without resume
    const noResumeRes = await fetch(`${BASE_URL}/analysis/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const noResumeData = await noResumeRes.json();
    assert(
      noResumeRes.status === 400 && noResumeData.message.includes('upload your resume'),
      'POST /api/analysis/resume rejects request when no resume is uploaded (400)'
    );

    // 6. Upload a realistic student resume in PDF format
    const resumeTextContent = `
VIGNESH RAMAN
vignesh@placementai.edu | +91 9876543210 | Chennai, India
GitHub: github.com/vignesh-raman | LinkedIn: linkedin.com/in/vignesh-raman

EDUCATION
Bachelor of Technology in Computer Science and Engineering
Anna University, 2022 - 2026 | CGPA: 8.7/10

TECHNICAL SKILLS
- Languages: JavaScript, TypeScript, Python, HTML5, CSS3
- Frontend: React.js, Tailwind CSS, Redux Toolkit, Responsive Web Design
- Backend: Node.js, Express.js, RESTful APIs
- Databases: MongoDB, MySQL
- Tools & Version Control: Git, GitHub, Postman, VS Code, Linux

PROJECTS
1. E-Commerce Platform (Full Stack MERN)
- Architected a responsive web application with React, Node.js, Express, and MongoDB.
- Implemented JWT-based authentication and secure checkout flows with REST APIs.
- Built reusable UI components utilizing Tailwind CSS and Redux state management.

2. Placement Portal Assistant
- Developed a dashboard using JavaScript, HTML5, and CSS3 for college placement tracking.
- Created RESTful microservices in Node.js connected to MongoDB database.
- Version controlled codebase using Git and deployed application on cloud hosting.
    `;

    // Create a real PDF document with readable text
    const samplePdfRaw = `%PDF-1.4\n1 0 obj\n<< /Length ${resumeTextContent.length} >>\nstream\n${resumeTextContent}\nendstream\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;
    const pdfBlob = new Blob([samplePdfRaw], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('resume', pdfBlob, 'Vignesh_Raman_Resume.pdf');

    const uploadRes = await fetch(`${BASE_URL}/resume/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const uploadData = await uploadRes.json();
    assert(uploadRes.status === 201 && uploadData.status === 'success', 'Uploaded valid student resume PDF');

    // 7. Verify unit text cleaning and parsing
    const cleanedTextSample = cleanText('  JavaScript \r\n\r\n Node.js   React  ');
    assert(cleanedTextSample === 'JavaScript\n\nNode.js React', 'cleanText normalizes whitespace and linebreaks');

    // 8. Execute Resume Analysis for 'Full Stack Developer'
    const analyzeRes = await fetch(`${BASE_URL}/analysis/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const analyzeData = await analyzeRes.json();
    assert(
      analyzeRes.status === 200 && analyzeData.status === 'success',
      'POST /api/analysis/resume successfully performs AI analysis'
    );

    const analysis = analyzeData.analysis;
    assert(
      typeof analysis.overallMatch === 'number' &&
      analysis.overallMatch >= 0 &&
      analysis.overallMatch <= 100,
      'overallMatch is a validated integer between 0 and 100'
    );
    assert(typeof analysis.summary === 'string' && analysis.summary.length > 20, 'summary is non-empty string');
    assert(Array.isArray(analysis.strongSkills) && analysis.strongSkills.length > 0, 'strongSkills contains matched skills');
    assert(Array.isArray(analysis.missingSkills), 'missingSkills is a validated array');
    assert(Array.isArray(analysis.recommendations) && analysis.recommendations.length > 0, 'recommendations are present');
    assert(Array.isArray(analysis.roleSpecificFeedback) && analysis.roleSpecificFeedback.length > 0, 'roleSpecificFeedback is present');

    // 9. Verify grounded matching: skills in strongSkills must be real technologies mentioned in the resume
    const expectedMatches = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'HTML5', 'CSS3', 'Git', 'REST APIs', 'Tailwind CSS'];
    const matchedAnyExpected = analysis.strongSkills.some(s => expectedMatches.includes(s));
    assert(matchedAnyExpected, 'AI analysis accurately identified verified skills from resume text');

    // 10. Performance / Caching Test: Repeat call returns existing analysis
    const cachedRes = await fetch(`${BASE_URL}/analysis/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const cachedData = await cachedRes.json();
    assert(
      cachedRes.status === 200 && cachedData.cached === true,
      'Subsequent analysis for identical role returns existing analysis without unnecessary reprocessing'
    );

    // 11. Retrieve latest analysis with GET /api/analysis/resume
    const getAnalysisRes = await fetch(`${BASE_URL}/analysis/resume`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getAnalysisData = await getAnalysisRes.json();
    assert(
      getAnalysisRes.status === 200 &&
      getAnalysisData.analysis?.targetJobRole === 'Full Stack Developer' &&
      getAnalysisData.analysis?.overallMatch === analysis.overallMatch,
      'GET /api/analysis/resume retrieves latest student analysis'
    );

    // 12. Switch Target Job Role to 'AI/ML Engineer'
    await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetJobRole: 'AI/ML Engineer' }),
    });

    // 13. Analyze Again with new role & verify role-specific adaptation
    const aimlAnalyzeRes = await fetch(`${BASE_URL}/analysis/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ force: true }),
    });
    const aimlAnalyzeData = await aimlAnalyzeRes.json();
    const aimlAnalysis = aimlAnalyzeData.analysis;

    assert(
      aimlAnalyzeRes.status === 200 && aimlAnalysis.targetJobRole === 'AI/ML Engineer',
      'Analysis re-runs for new role "AI/ML Engineer"'
    );
    assert(
      aimlAnalysis.missingSkills.some(s => ['PyTorch', 'TensorFlow', 'Deep Learning', 'Machine Learning'].includes(s)),
      'AI/ML analysis correctly detects missing Machine Learning competencies'
    );
    assert(
      aimlAnalysis.overallMatch < analysis.overallMatch,
      'Match score adapts dynamically to reflect greater gaps for AI/ML compared to Full Stack'
    );

    // 14. Unit test JSON validation and error resilience
    const validSchema = validateAnalysisResult({
      overallMatch: '82.7',
      summary: 'Candidate fits role well.',
      strongSkills: ['Python', 'SQL'],
      skillsToImprove: ['Docker'],
      missingSkills: ['Kubernetes'],
      recommendations: ['Build microservice project.'],
      roleSpecificFeedback: ['Study system design.'],
    });
    assert(validSchema.overallMatch === 83, 'validateAnalysisResult rounds float scores to integer');

    try {
      validateAnalysisResult(null);
      assert(false, 'validateAnalysisResult should throw on non-object');
    } catch {
      assert(true, 'validateAnalysisResult safely handles invalid input');
    }

    console.log(`\n===================================`);
    console.log(`STAGE 4 SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
    console.log(`===================================\n`);

    if (failCount > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
};

runStage4Tests();
