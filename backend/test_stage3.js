// Comprehensive Stage 3 verification test script
const BASE_URL = 'http://localhost:5000/api';

const runStage3Tests = async () => {
  console.log('=== STAGE 3: PLACEMENT LAUNCHPAD AI VERIFICATION ===\n');
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
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'GET /api/health returns 200 OK');

    // 2. Unauthorized resume endpoints check
    const noTokenGet = await fetch(`${BASE_URL}/resume`);
    assert(noTokenGet.status === 401, 'GET /api/resume without token returns 401 Unauthorized');

    const noTokenDelete = await fetch(`${BASE_URL}/resume`, { method: 'DELETE' });
    assert(noTokenDelete.status === 401, 'DELETE /api/resume without token returns 401 Unauthorized');

    // Register a new student for Stage 3 testing
    const timestamp = Date.now();
    const testStudent = {
      name: 'Ananya Sharma',
      email: `ananya_${timestamp}@placementai.edu`,
      password: 'SecurePassword2026!',
    };

    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testStudent),
    });
    const registerData = await registerRes.json();
    const token = registerData.token;
    assert(registerRes.status === 201 && Boolean(token), 'POST /api/auth/register creates student and returns token');

    // 3. Profile Loading
    const profileRes = await fetch(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const profileData = await profileRes.json();
    assert(
      profileRes.status === 200 && profileData.profile?.name === testStudent.name,
      'GET /api/profile retrieves authenticated student profile'
    );

    // 4. Target Job Role Selection & Profile Update
    const targetRole = 'Full Stack Developer';
    const updateRoleRes = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetJobRole: targetRole }),
    });
    const updateRoleData = await updateRoleRes.json();
    assert(
      updateRoleRes.status === 200 && updateRoleData.profile?.targetJobRole === targetRole,
      'PUT /api/profile saves selected targetJobRole to user profile'
    );

    // 5. Initial Resume retrieval when no resume uploaded yet
    const initResumeRes = await fetch(`${BASE_URL}/resume`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const initResumeData = await initResumeRes.json();
    assert(
      initResumeRes.status === 200 && initResumeData.resume === null,
      'GET /api/resume returns null before any resume is uploaded'
    );

    // 6. Test Invalid File Type Upload (.txt file)
    const invalidFormData = new FormData();
    const invalidBlob = new Blob(['Plain text resume content'], { type: 'text/plain' });
    invalidFormData.append('resume', invalidBlob, 'sample_resume.txt');

    const invalidTypeRes = await fetch(`${BASE_URL}/resume/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: invalidFormData,
    });
    const invalidTypeData = await invalidTypeRes.json();
    assert(
      invalidTypeRes.status === 400 &&
      invalidTypeData.message === 'Only PDF, DOC and DOCX files are allowed.',
      'POST /api/resume/upload rejects .txt file with "Only PDF, DOC and DOCX files are allowed."'
    );

    // 7. Test Oversized File Upload (> 5MB)
    const oversizedFormData = new FormData();
    // 5.2 MB buffer
    const oversizedBuffer = new Uint8Array(5.2 * 1024 * 1024);
    const oversizedBlob = new Blob([oversizedBuffer], { type: 'application/pdf' });
    oversizedFormData.append('resume', oversizedBlob, 'heavy_resume.pdf');

    const oversizedRes = await fetch(`${BASE_URL}/resume/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: oversizedFormData,
    });
    const oversizedData = await oversizedRes.json();
    assert(
      oversizedRes.status === 400 &&
      oversizedData.message === 'Maximum file size is 5 MB.',
      'POST /api/resume/upload rejects file > 5 MB with "Maximum file size is 5 MB."'
    );

    // 8. Test Valid PDF Upload
    const validPdfFormData = new FormData();
    const dummyPdfContent = '%PDF-1.4\n1 0 obj\n<< /Title (Student Resume) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF';
    const pdfBlob = new Blob([dummyPdfContent], { type: 'application/pdf' });
    validPdfFormData.append('resume', pdfBlob, 'Ananya_Sharma_Resume.pdf');

    const uploadPdfRes = await fetch(`${BASE_URL}/resume/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: validPdfFormData,
    });
    const uploadPdfData = await uploadPdfRes.json();
    assert(
      (uploadPdfRes.status === 200 || uploadPdfRes.status === 201) &&
      uploadPdfData.status === 'success' &&
      uploadPdfData.resume?.originalName === 'Ananya_Sharma_Resume.pdf',
      'POST /api/resume/upload successfully uploads valid PDF and stores metadata'
    );
    assert(
      !uploadPdfData.resume?.storedPath && !uploadPdfData.resume?.path,
      'Stored server file paths are not exposed to the client'
    );

    // 9. Test Resume Retrieval (GET /api/resume)
    const getResumeRes = await fetch(`${BASE_URL}/resume`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getResumeData = await getResumeRes.json();
    assert(
      getResumeRes.status === 200 &&
      getResumeData.resume?.originalName === 'Ananya_Sharma_Resume.pdf' &&
      getResumeData.resume?.fileSize > 0,
      'GET /api/resume retrieves current uploaded resume metadata'
    );

    // 10. Test Resume Replacement with DOCX
    const replaceFormData = new FormData();
    const docxBlob = new Blob(['PK\x03\x04Mock DOCX binary payload for testing'], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    replaceFormData.append('resume', docxBlob, 'Ananya_Updated_Resume.docx');

    const replaceRes = await fetch(`${BASE_URL}/resume/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: replaceFormData,
    });
    const replaceData = await replaceRes.json();
    assert(
      replaceRes.status === 200 &&
      replaceData.status === 'success' &&
      replaceData.resume?.originalName === 'Ananya_Updated_Resume.docx',
      'POST /api/resume/upload successfully replaces existing resume with new file'
    );

    // Verify GET now returns the replaced resume
    const verifyReplaceRes = await fetch(`${BASE_URL}/resume`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const verifyReplaceData = await verifyReplaceRes.json();
    assert(
      verifyReplaceData.resume?.originalName === 'Ananya_Updated_Resume.docx',
      'GET /api/resume reflects the replaced resume document'
    );

    // 11. Test Resume Deletion (DELETE /api/resume)
    const deleteRes = await fetch(`${BASE_URL}/resume`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const deleteData = await deleteRes.json();
    assert(
      deleteRes.status === 200 && deleteData.status === 'success',
      'DELETE /api/resume deletes uploaded resume successfully'
    );

    // Verify GET now returns null
    const verifyDeleteRes = await fetch(`${BASE_URL}/resume`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const verifyDeleteData = await verifyDeleteRes.json();
    assert(
      verifyDeleteData.status === 'success' && verifyDeleteData.resume === null,
      'GET /api/resume confirms resume was removed and returns null'
    );

    // 12. Test Deleting When No Resume Exists (404)
    const deleteAgainRes = await fetch(`${BASE_URL}/resume`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(
      deleteAgainRes.status === 404,
      'DELETE /api/resume when no resume exists returns 404 Not Found'
    );

    // 13. Test Login Again & Verify Profile & Dashboard
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testStudent.email, password: testStudent.password }),
    });
    const loginData = await loginRes.json();
    assert(
      loginRes.status === 200 && loginData.user?.targetJobRole === targetRole,
      'POST /api/auth/login logs student in again and retains targetJobRole'
    );

    console.log(`\n===================================`);
    console.log(`STAGE 3 SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
    console.log(`===================================\n`);

    if (failCount > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
};

runStage3Tests();
