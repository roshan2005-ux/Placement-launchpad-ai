const BASE_URL = 'http://localhost:5000/api';

const runStage6Tests = async () => {
  console.log('=== STAGE 6: JOB APPLICATION TRACKER & PLACEMENT PROGRESS VERIFICATION ===\n');
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
    const unauthGet = await fetch(`${BASE_URL}/applications`);
    assert(unauthGet.status === 401, 'GET /api/applications without token returns 401 Unauthorized');

    const unauthPost = await fetch(`${BASE_URL}/applications`, { method: 'POST' });
    assert(unauthPost.status === 401, 'POST /api/applications without token returns 401 Unauthorized');

    const unauthStats = await fetch(`${BASE_URL}/applications/stats`);
    assert(unauthStats.status === 401, 'GET /api/applications/stats without token returns 401 Unauthorized');

    // 3. Register primary student for Stage 6
    const timestamp = Date.now();
    const studentA = {
      name: 'Pooja Hegde',
      email: `pooja_${timestamp}@placementai.edu`,
      password: 'SecurePassword2026!',
    };

    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentA),
    });
    const regData = await regRes.json();
    const tokenA = regData.token;
    assert(regRes.status === 201 && Boolean(tokenA), 'POST /api/auth/register creates Student A');

    // 4. Input validation checks on creation
    // Empty company name
    const emptyCompRes = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ companyName: '   ', jobRole: 'Full Stack Engineer' }),
    });
    const emptyCompData = await emptyCompRes.json();
    assert(
      emptyCompRes.status === 400 && emptyCompData.message.includes('Company name'),
      'POST /api/applications rejects empty company name (400)'
    );

    // Empty job role
    const emptyRoleRes = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ companyName: 'Google', jobRole: '' }),
    });
    const emptyRoleData = await emptyRoleRes.json();
    assert(
      emptyRoleRes.status === 400 && emptyRoleData.message.includes('Job role'),
      'POST /api/applications rejects empty job role (400)'
    );

    // Invalid status
    const invalidStatusRes = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        companyName: 'Google',
        jobRole: 'Software Engineer',
        status: 'Waiting',
      }),
    });
    assert(invalidStatusRes.status === 400, 'POST /api/applications rejects invalid status value (400)');

    // Invalid URL format
    const invalidUrlRes = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        companyName: 'Google',
        jobRole: 'Software Engineer',
        jobUrl: 'ftp://not-a-valid-http-url',
      }),
    });
    assert(invalidUrlRes.status === 400, 'POST /api/applications rejects invalid URL protocol (400)');

    // 5. Create valid applications across various statuses
    // App 1: Google (Applied)
    const app1Res = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        companyName: 'Google',
        jobRole: 'Software Engineer - Campus Graduate',
        location: 'Bangalore, India',
        jobType: 'Full-Time',
        status: 'Applied',
        jobUrl: 'https://careers.google.com/jobs/12345',
        notes: 'Applied through campus placement portal. Recruiter screening pending.',
      }),
    });
    const app1Data = await app1Res.json();
    assert(app1Res.status === 201 && app1Data.status === 'success', 'Create Application 1 (Google - Applied) returns 201');
    const app1Id = app1Data.application?.id;

    // App 2: Microsoft (Assessment)
    const app2Res = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        companyName: 'Microsoft',
        jobRole: 'Frontend SDE',
        location: 'Hyderabad, India',
        jobType: 'Full-Time',
        status: 'Assessment',
        jobUrl: 'https://careers.microsoft.com/us/en/job/67890',
        notes: 'Online coding round scheduled on Codility for Saturday.',
      }),
    });
    const app2Data = await app2Res.json();
    assert(app2Res.status === 201, 'Create Application 2 (Microsoft - Assessment) returns 201');
    const app2Id = app2Data.application?.id;

    // App 3: Amazon (Interview)
    const app3Res = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        companyName: 'Amazon',
        jobRole: 'SDE-1',
        location: 'Chennai, India',
        jobType: 'Full-Time',
        status: 'Interview',
        notes: 'Cleared online test. Technical Interview Round 1 scheduled.',
      }),
    });
    const app3Data = await app3Res.json();
    assert(app3Res.status === 201, 'Create Application 3 (Amazon - Interview) returns 201');
    const app3Id = app3Data.application?.id;

    // App 4: Atlassian (Selected)
    const app4Res = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        companyName: 'Atlassian',
        jobRole: 'Graduate Software Engineer',
        location: 'Remote',
        jobType: 'Full-Time',
        status: 'Selected',
        notes: 'Offer letter received! CTC 22 LPA.',
      }),
    });
    const app4Data = await app4Res.json();
    assert(app4Res.status === 201, 'Create Application 4 (Atlassian - Selected) returns 201');

    // App 5: Meta (Rejected)
    const app5Res = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        companyName: 'Meta',
        jobRole: 'Data Analyst Intern',
        location: 'Remote',
        jobType: 'Internship',
        status: 'Rejected',
        notes: 'Positions filled for this hiring cycle.',
      }),
    });
    const app5Data = await app5Res.json();
    assert(app5Res.status === 201, 'Create Application 5 (Meta - Rejected) returns 201');
    const app5Id = app5Data.application?.id;

    // 6. List all applications
    const listRes = await fetch(`${BASE_URL}/applications`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const listData = await listRes.json();
    assert(listRes.status === 200 && listData.count === 5, 'GET /api/applications returns all 5 applications');
    assert(listData.applications.some((a) => a.companyName === 'Google'), 'List contains Google application');

    // Filter by status: Interview
    const filterStatusRes = await fetch(`${BASE_URL}/applications?status=Interview`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const filterStatusData = await filterStatusRes.json();
    assert(
      filterStatusRes.status === 200 && filterStatusData.count === 1 && filterStatusData.applications[0].companyName === 'Amazon',
      'GET /api/applications?status=Interview correctly filters Amazon application'
    );

    // Search by company: Microsoft
    const searchRes = await fetch(`${BASE_URL}/applications?search=microsoft`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const searchData = await searchRes.json();
    assert(
      searchRes.status === 200 && searchData.count === 1 && searchData.applications[0].companyName === 'Microsoft',
      'GET /api/applications?search=microsoft performs search query'
    );

    // 7. Verify Statistics
    const statsRes = await fetch(`${BASE_URL}/applications/stats`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const statsData = await statsRes.json();
    assert(statsRes.status === 200 && statsData.status === 'success', 'GET /api/applications/stats returns 200 OK');
    const stats = statsData.stats;
    assert(stats.total === 5, `Total applications count is 5 (got ${stats.total})`);
    assert(stats.applied === 1, `Applied count is 1 (got ${stats.applied})`);
    assert(stats.assessment === 1, `Assessment count is 1 (got ${stats.assessment})`);
    assert(stats.interview === 1, `Interview count is 1 (got ${stats.interview})`);
    assert(stats.selected === 1, `Selected count is 1 (got ${stats.selected})`);
    assert(stats.rejected === 1, `Rejected count is 1 (got ${stats.rejected})`);
    assert(stats.active === 3, `Active applications (applied+assessment+interview) is 3 (got ${stats.active})`);

    // 8. Update Application (PUT /api/applications/:id)
    const updateRes = await fetch(`${BASE_URL}/applications/${app1Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        notes: 'HR called today. First technical round booked for next Wednesday.',
        location: 'Hyderabad, India',
      }),
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, 'PUT /api/applications/:id updates application');
    assert(
      updateData.application.notes.includes('First technical round') && updateData.application.location === 'Hyderabad, India',
      'Updated application persists modified notes and location'
    );

    // Empty company name in update returns 400
    const invalidUpdateRes = await fetch(`${BASE_URL}/applications/${app1Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ companyName: '   ' }),
    });
    assert(invalidUpdateRes.status === 400, 'PUT /api/applications/:id rejects empty company name (400)');

    // 9. Quick Status Update (PATCH /api/applications/:id/status)
    const patchRes = await fetch(`${BASE_URL}/applications/${app2Id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ status: 'Interview' }),
    });
    const patchData = await patchRes.json();
    assert(patchRes.status === 200, 'PATCH /api/applications/:id/status succeeds (200)');
    assert(patchData.application.status === 'Interview', 'Microsoft status transitioned to Interview');

    // Invalid status in PATCH returns 400
    const invalidPatchRes = await fetch(`${BASE_URL}/applications/${app2Id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ status: 'UnderReview' }),
    });
    assert(invalidPatchRes.status === 400, 'PATCH /api/applications/:id/status rejects invalid status (400)');

    // Verify stats changed after status update: interviews should be 2, assessment 0
    const updatedStatsRes = await fetch(`${BASE_URL}/applications/stats`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const updatedStats = (await updatedStatsRes.json()).stats;
    assert(updatedStats.interview === 2 && updatedStats.assessment === 0, 'Stats accurately reflect updated status transition');

    // 10. Delete Application (DELETE /api/applications/:id)
    const deleteRes = await fetch(`${BASE_URL}/applications/${app5Id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(deleteRes.status === 200, 'DELETE /api/applications/:id deletes rejected application');

    // Verify application count decreased to 4
    const postDeleteRes = await fetch(`${BASE_URL}/applications`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const postDeleteData = await postDeleteRes.json();
    assert(postDeleteData.count === 4, 'Application count decreased to 4 after deletion');
    assert(!postDeleteData.applications.some((a) => a.id === app5Id), 'Deleted application is no longer in list');

    // Attempting to delete again returns 404
    const repeatDeleteRes = await fetch(`${BASE_URL}/applications/${app5Id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(repeatDeleteRes.status === 404, 'DELETE on already deleted application returns 404 Not Found');

    // 11. Student Data Isolation Verification
    // Register Student B
    const studentB = {
      name: 'Rohan Verma',
      email: `rohan_${timestamp}@placementai.edu`,
      password: 'SecurePassword2026!',
    };
    const regBRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentB),
    });
    const tokenB = (await regBRes.json()).token;

    // Student B applications list should be empty
    const listBRes = await fetch(`${BASE_URL}/applications`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const listBData = await listBRes.json();
    assert(listBData.count === 0, 'Student B cannot see Student A applications (isolated count = 0)');

    // Student B stats should all be 0
    const statsBRes = await fetch(`${BASE_URL}/applications/stats`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const statsBData = (await statsBRes.json()).stats;
    assert(statsBData.total === 0 && statsBData.active === 0, 'Student B stats are completely isolated (0)');

    // Student B attempting to edit Student A application returns 404
    const unauthEditRes = await fetch(`${BASE_URL}/applications/${app1Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({ companyName: 'Hacked Corp' }),
    });
    assert(unauthEditRes.status === 404, 'Student B cannot edit Student A application (returns 404)');

    // Student B attempting to delete Student A application returns 404
    const unauthDeleteRes = await fetch(`${BASE_URL}/applications/${app1Id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(unauthDeleteRes.status === 404, 'Student B cannot delete Student A application (returns 404)');

  } catch (err) {
    console.error('Fatal test error in Stage 6:', err);
    failCount++;
  }

  console.log('\n======================================================');
  console.log(`STAGE 6 RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('======================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
};

runStage6Tests();
