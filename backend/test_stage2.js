// Comprehensive Stage 2 verification test script
const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('=== STAGE 2: AUTHENTICATION & PROFILE VERIFICATION ===\n');
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
    // 1. Check Health Endpoint
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'GET /api/health returns 200 OK');

    // 2. Test protected endpoint without token
    const noTokenRes = await fetch(`${BASE_URL}/profile`);
    const noTokenData = await noTokenRes.json();
    assert(noTokenRes.status === 401 && noTokenData.status === 'error', 'GET /api/profile without token returns 401 Unauthorized');

    // Unique user details for test run
    const testTimestamp = Date.now();
    const testUser = {
      name: 'Roshan Kumar',
      email: `student_${testTimestamp}@college.edu`,
      password: 'SecurePassword123!',
    };

    // 3. Test Student Registration
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const registerData = await registerRes.json();
    assert(
      registerRes.status === 201 && registerData.token && registerData.user?.email === testUser.email,
      'POST /api/auth/register registers student and returns JWT token'
    );
    assert(!registerData.user.password, 'User password is not exposed in registration response');

    // 4. Test Duplicate Email Registration
    const duplicateRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const duplicateData = await duplicateRes.json();
    assert(
      duplicateRes.status === 409 && duplicateData.status === 'error',
      'POST /api/auth/register rejects duplicate email with 409 Conflict'
    );

    // 5. Test Invalid Login (Wrong Password)
    const invalidLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: 'WrongPassword999!' }),
    });
    const invalidLoginData = await invalidLoginRes.json();
    assert(
      invalidLoginRes.status === 401 && invalidLoginData.status === 'error',
      'POST /api/auth/login rejects invalid credentials with 401 Unauthorized'
    );

    // 6. Test Valid Login & Receive JWT
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    assert(
      loginRes.status === 200 && Boolean(token) && loginData.user?.email === testUser.email,
      'POST /api/auth/login logs in student and returns JWT'
    );
    assert(!loginData.user.password, 'User password is not exposed in login response');

    // 7. Test Access Protected Profile with JWT
    const getProfileRes = await fetch(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getProfileData = await getProfileRes.json();
    assert(
      getProfileRes.status === 200 && getProfileData.profile?.email === testUser.email,
      'GET /api/profile retrieves authenticated student profile'
    );

    // 8. Test Update Student Profile
    const profileUpdatePayload = {
      college: 'National Institute of Technology',
      degree: 'B.Tech',
      branch: 'Computer Science and Engineering',
      year: 'Final Year',
      targetJobRole: 'Software Development Engineer (SDE)',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Data Structures', 'Git'],
      careerGoal: 'Secure a product-company SDE role with 14+ LPA package by June 2026',
    };

    const updateProfileRes = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileUpdatePayload),
    });
    const updateProfileData = await updateProfileRes.json();
    assert(
      updateProfileRes.status === 200 &&
      updateProfileData.profile?.targetJobRole === profileUpdatePayload.targetJobRole &&
      updateProfileData.profile?.skills.length === 6,
      'PUT /api/profile updates profile fields successfully'
    );

    // 9. Test Reload Profile (Verify Persistence)
    const reloadProfileRes = await fetch(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const reloadProfileData = await reloadProfileRes.json();
    assert(
      reloadProfileRes.status === 200 &&
      reloadProfileData.profile?.targetJobRole === profileUpdatePayload.targetJobRole &&
      reloadProfileData.profile?.profileCompletion > 50,
      'GET /api/profile reloads updated profile with calculated profile completion score'
    );

    console.log(`\n===================================`);
    console.log(`SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
    console.log(`===================================\n`);

    if (failCount > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err.message);
    process.exit(1);
  }
};

runTests();
