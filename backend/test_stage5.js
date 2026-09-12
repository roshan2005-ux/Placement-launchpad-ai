import { generatePersonalizedRoadmap } from './src/services/roadmapGeneratorService.js';

const BASE_URL = 'http://localhost:5000/api';

const runStage5Tests = async () => {
  console.log('=== STAGE 5: PERSONALIZED LEARNING ROADMAP VERIFICATION ===\n');
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
    const unauthGet = await fetch(`${BASE_URL}/roadmap`);
    assert(unauthGet.status === 401, 'GET /api/roadmap without token returns 401 Unauthorized');

    const unauthPost = await fetch(`${BASE_URL}/roadmap/generate`, { method: 'POST' });
    assert(unauthPost.status === 401, 'POST /api/roadmap/generate without token returns 401 Unauthorized');

    const unauthToggle = await fetch(`${BASE_URL}/roadmap/week/1/toggle`, { method: 'PUT' });
    assert(unauthToggle.status === 401, 'PUT /api/roadmap/week/1/toggle without token returns 401 Unauthorized');

    // 3. Register a test student for Stage 5
    const timestamp = Date.now();
    const testUser = {
      name: 'Ananya Sharma',
      email: `ananya_${timestamp}@placementai.edu`,
      password: 'SecurePassword2026!',
    };

    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const registerData = await registerRes.json();
    const token = registerData.token;
    assert(registerRes.status === 201 && Boolean(token), 'POST /api/auth/register creates test student');

    // 4. Test roadmap generation without target job role
    const noRoleRes = await fetch(`${BASE_URL}/roadmap/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const noRoleData = await noRoleRes.json();
    assert(
      noRoleRes.status === 400 && noRoleData.message.toLowerCase().includes('target job role'),
      'POST /api/roadmap/generate rejects request without target job role (400)'
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

    // 5. Test roadmap generation without Stage 4 analysis
    const noAnalysisRes = await fetch(`${BASE_URL}/roadmap/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const noAnalysisData = await noAnalysisRes.json();
    assert(
      noAnalysisRes.status === 400 && (noAnalysisData.message.toLowerCase().includes('analysis') || noAnalysisData.message.toLowerCase().includes('resume')),
      'POST /api/roadmap/generate rejects request when Stage 4 resume analysis is missing (400)'
    );

    // 6. Complete Stage 3 & 4 prerequisites: Upload resume & run analysis
    const resumeTextContent = `
ANANYA SHARMA
ananya@placementai.edu | +91 9123456780 | Bangalore, India
GitHub: github.com/ananya-sharma | LinkedIn: linkedin.com/in/ananya-sharma

EDUCATION
B.Tech in Information Technology | NIT Trichy | 2022 - 2026 | CGPA: 8.9/10

TECHNICAL SKILLS
- Languages: JavaScript, Python, HTML5, CSS3
- Frontend: React.js, Tailwind CSS, Redux
- Databases: MongoDB
- Tools: Git, GitHub, VS Code

PROJECTS
1. E-Commerce Platform
- Built responsive UI using React, Tailwind CSS, and Redux.
- Designed database schema in MongoDB and connected RESTful endpoints.
    `;

    const samplePdfRaw = `%PDF-1.4\n1 0 obj\n<< /Length ${resumeTextContent.length} >>\nstream\n${resumeTextContent}\nendstream\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF`;
    const pdfBlob = new Blob([samplePdfRaw], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('resume', pdfBlob, 'Ananya_Sharma_Resume.pdf');

    const uploadRes = await fetch(`${BASE_URL}/resume/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const uploadData = await uploadRes.json();
    assert(uploadRes.status === 201 && uploadData.status === 'success', 'Stage 3: POST /api/resume/upload uploads student resume');

    // Run Stage 4 analysis
    const analysisRes = await fetch(`${BASE_URL}/analysis/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const analysisData = await analysisRes.json();
    assert(
      analysisRes.status === 200 && analysisData.status === 'success',
      'Stage 4: POST /api/analysis/resume completes resume analysis and skill gap identification'
    );

    const missingSkills = analysisData.analysis?.missingSkills || [];
    console.log(`  Identified missing skills for roadmap: ${missingSkills.slice(0, 5).join(', ')}...`);

    // 7. Generate Stage 5 Roadmap
    const genRes = await fetch(`${BASE_URL}/roadmap/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ force: false }),
    });
    const genData = await genRes.json();
    assert(genRes.status === 200 && genData.status === 'success', 'POST /api/roadmap/generate succeeds (200)');

    const roadmap = genData.roadmap;
    assert(Boolean(roadmap), 'Generated roadmap object exists in response');
    assert(roadmap.targetRole === 'Full Stack Developer', 'Roadmap targetRole matches student target role');
    assert(
      roadmap.durationWeeks >= 4 && roadmap.durationWeeks <= 6,
      `Roadmap duration is between 4-6 weeks (got ${roadmap.durationWeeks})`
    );
    assert(roadmap.totalWeeks === roadmap.durationWeeks, 'Roadmap totalWeeks equals durationWeeks');
    assert(roadmap.completedWeeks === 0, 'New roadmap starts with 0 completed weeks');
    assert(roadmap.progressPercent === 0, 'New roadmap starts with 0% progress');
    assert(Array.isArray(roadmap.weeks) && roadmap.weeks.length === roadmap.durationWeeks, 'Roadmap weeks array matches duration');

    // Validate week milestone schema
    const week1 = roadmap.weeks[0];
    assert(week1.weekNumber === 1, 'Week 1 has weekNumber = 1');
    assert(typeof week1.topic === 'string' && week1.topic.length > 0, 'Week 1 has valid topic');
    assert(typeof week1.objective === 'string' && week1.objective.length > 0, 'Week 1 has valid objective');
    assert(typeof week1.practiceTask === 'string' && week1.practiceTask.length > 0, 'Week 1 has valid practiceTask');
    assert(typeof week1.projectTask === 'string' && week1.projectTask.length > 0, 'Week 1 has valid projectTask');
    assert(typeof week1.estimatedHours === 'number' && week1.estimatedHours > 0, `Week 1 has estimatedHours > 0 (${week1.estimatedHours} hrs)`);
    assert(week1.completed === false, 'Week 1 starts uncompleted');

    // 8. Retrieve Latest Roadmap (GET /api/roadmap)
    const getRes = await fetch(`${BASE_URL}/roadmap`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getData = await getRes.json();
    assert(getRes.status === 200 && getData.status === 'success', 'GET /api/roadmap retrieves active roadmap');
    assert(getData.roadmap?.id === roadmap.id, 'GET /api/roadmap returns identical roadmap ID');

    // 9. Milestone Toggle (PUT /api/roadmap/week/:weekNumber/toggle)
    // Toggle Week 1 -> Complete
    const toggle1Res = await fetch(`${BASE_URL}/roadmap/week/1/toggle`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    const toggle1Data = await toggle1Res.json();
    assert(toggle1Res.status === 200, 'PUT /api/roadmap/week/1/toggle succeeds (200)');
    assert(toggle1Data.roadmap.weeks[0].completed === true, 'Week 1 milestone marked as completed');
    assert(toggle1Data.roadmap.completedWeeks === 1, 'Completed weeks count incremented to 1');
    assert(toggle1Data.roadmap.progressPercent === 20, 'Progress percentage updated to 20%');
    assert(toggle1Data.roadmap.status === 'in_progress', 'Roadmap status updated to in_progress');

    // Toggle Week 2 -> Complete
    const toggle2Res = await fetch(`${BASE_URL}/roadmap/week/2/toggle`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    const toggle2Data = await toggle2Res.json();
    assert(toggle2Data.roadmap.weeks[1].completed === true, 'Week 2 milestone marked as completed');
    assert(toggle2Data.roadmap.completedWeeks === 2, 'Completed weeks count incremented to 2');
    assert(toggle2Data.roadmap.progressPercent === 40, 'Progress percentage updated to 40%');

    // Toggle Week 1 -> Uncomplete
    const untoggle1Res = await fetch(`${BASE_URL}/roadmap/week/1/toggle`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    const untoggle1Data = await untoggle1Res.json();
    assert(untoggle1Data.roadmap.weeks[0].completed === false, 'Week 1 milestone toggled back to uncompleted');
    assert(untoggle1Data.roadmap.completedWeeks === 1, 'Completed weeks count decremented to 1');
    assert(untoggle1Data.roadmap.progressPercent === 20, 'Progress percentage reverted to 20%');

    // Invalid week number check
    const invalidWeekRes = await fetch(`${BASE_URL}/roadmap/week/99/toggle`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(invalidWeekRes.status === 400, 'PUT /api/roadmap/week/99/toggle returns 400 Bad Request');

    // 10. Force Regeneration (POST /api/roadmap/generate with force=true)
    const forceRes = await fetch(`${BASE_URL}/roadmap/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ force: true }),
    });
    const forceData = await forceRes.json();
    assert(forceRes.status === 200 && forceData.status === 'success', 'POST /api/roadmap/generate with force=true regenerates roadmap');
    assert(forceData.roadmap.completedWeeks === 0, 'Regenerated roadmap resets completed weeks to 0');

    // 11. Direct unit test of roadmapGeneratorService with different roles
    const aimlRoadmap = await generatePersonalizedRoadmap({
      targetRole: 'AI/ML Engineer',
      currentSkills: ['Python', 'Pandas'],
      missingSkills: ['PyTorch', 'Model Deployment', 'MLOps', 'Transformers'],
      skillsToImprove: ['Scikit-Learn'],
    });
    assert(aimlRoadmap.durationWeeks === 5, 'AI/ML Engineer roadmap produces 5-week curriculum');
    assert(
      aimlRoadmap.weeks.some(w => w.topic.toLowerCase().includes('pytorch') || w.topic.toLowerCase().includes('model') || w.topic.toLowerCase().includes('deep learning')),
      'AI/ML Engineer roadmap incorporates PyTorch and deep learning topics'
    );

    const cyberRoadmap = await generatePersonalizedRoadmap({
      targetRole: 'Cybersecurity Analyst',
      currentSkills: ['Networking', 'Linux'],
      missingSkills: ['Wireshark', 'SIEM', 'Threat Analysis', 'Metasploit'],
      skillsToImprove: ['Vulnerability Assessment'],
    });
    assert(cyberRoadmap.durationWeeks === 5, 'Cybersecurity Analyst roadmap produces 5-week curriculum');
    assert(
      cyberRoadmap.weeks.some(w => w.topic.toLowerCase().includes('wireshark') || w.topic.toLowerCase().includes('siem') || w.topic.toLowerCase().includes('network') || w.topic.toLowerCase().includes('threat')),
      'Cybersecurity Analyst roadmap incorporates network & threat analysis topics'
    );

  } catch (err) {
    console.error('Fatal test error:', err);
    failCount++;
  }

  console.log('\n========================================');
  console.log(`STAGE 5 RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('========================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
};

runStage5Tests();
