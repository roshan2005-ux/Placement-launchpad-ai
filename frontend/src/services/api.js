const resolveApiBaseUrl = () => {
  let url = (import.meta.env.VITE_API_BASE_URL || '').trim();

  if (!url) {
    if (import.meta.env.PROD) {
      console.warn(
        '[Placement Launchpad API] Warning: VITE_API_BASE_URL was not set during this Vercel build. ' +
        'Defaulting to http://localhost:5000/api. ' +
        'Please set VITE_API_BASE_URL in Vercel Project Settings and trigger a Redeploy.'
      );
    }
    return 'http://localhost:5000/api';
  }

  // Strip trailing slashes
  url = url.replace(/\/+$/, '');

  // Automatically append /api if the user provided only the root domain
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }

  return url;
};

const API_BASE_URL = resolveApiBaseUrl();

if (typeof window !== 'undefined') {
  console.log('[Placement Launchpad] Target Backend API:', API_BASE_URL);
}

const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    return res;
  } catch (err) {
    if (err && (err.name === 'TypeError' || String(err.message).includes('fetch') || String(err.message).includes('NetworkError'))) {
      const isLocal = API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1');
      if (isLocal) {
        throw new Error(
          `Connection Failed: The frontend was built targeting "${API_BASE_URL}". In Vercel, please set VITE_API_BASE_URL to your Render backend URL (e.g. https://your-backend.onrender.com/api) and trigger a Redeploy.`
        );
      }
      throw new Error(
        `Unable to reach backend at ${API_BASE_URL}. If Render is waking up from sleep, please wait 30-60 seconds and try again.`
      );
    }
    throw err;
  }
};

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const getAuthHeaders = () => {
  const headers = {};
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth endpoints
  async register(data) {
    const res = await safeFetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Registration failed');
    }
    return result;
  },

  async login(data) {
    const res = await safeFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Login failed');
    }
    return result;
  },

  async getMe() {
    const res = await safeFetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch user');
    }
    return result;
  },

  // Profile endpoints
  async getProfile() {
    const res = await safeFetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch profile');
    }
    return result;
  },

  async updateProfile(data) {
    const res = await safeFetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update profile');
    }
    return result;
  },

  // Resume endpoints
  async uploadResume(formData) {
    const res = await safeFetch(`${API_BASE_URL}/resume/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to upload resume');
    }
    return result;
  },

  async getResume() {
    const res = await safeFetch(`${API_BASE_URL}/resume`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch resume');
    }
    return result;
  },

  async deleteResume() {
    const res = await safeFetch(`${API_BASE_URL}/resume`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to delete resume');
    }
    return result;
  },

  // Resume Analysis endpoints
  async analyzeResume(force = false) {
    const res = await safeFetch(`${API_BASE_URL}/analysis/resume`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ force }),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to analyze resume');
    }
    return result;
  },

  async getLatestAnalysis() {
    const res = await safeFetch(`${API_BASE_URL}/analysis/resume`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch resume analysis');
    }
    return result;
  },

  // Learning Roadmap endpoints
  async generateRoadmap(force = false) {
    const res = await safeFetch(`${API_BASE_URL}/roadmap/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ force }),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to generate learning roadmap');
    }
    return result;
  },

  async getLatestRoadmap() {
    const res = await safeFetch(`${API_BASE_URL}/roadmap`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch learning roadmap');
    }
    return result;
  },

  async toggleRoadmapWeek(weekNumber) {
    const res = await safeFetch(`${API_BASE_URL}/roadmap/week/${weekNumber}/toggle`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update week milestone');
    }
    return result;
  },

  // Job Application Tracker endpoints
  async getApplications(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const res = await safeFetch(`${API_BASE_URL}/applications${queryString}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch job applications');
    }
    return result;
  },

  async getApplicationStats() {
    const res = await safeFetch(`${API_BASE_URL}/applications/stats`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch application statistics');
    }
    return result;
  },

  async createApplication(data) {
    const res = await safeFetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to create job application');
    }
    return result;
  },

  async updateApplication(id, data) {
    const res = await safeFetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update job application');
    }
    return result;
  },

  async updateApplicationStatus(id, status) {
    const res = await safeFetch(`${API_BASE_URL}/applications/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update application status');
    }
    return result;
  },

  async deleteApplication(id) {
    const res = await safeFetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to delete job application');
    }
    return result;
  },

  // Skill Assessment endpoints
  async getAssessmentQuestions(role) {
    const query = role ? `?role=${encodeURIComponent(role)}` : '';
    const res = await safeFetch(`${API_BASE_URL}/assessment/questions${query}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch assessment questions');
    }
    return result;
  },

  async submitAssessment(data) {
    const res = await safeFetch(`${API_BASE_URL}/assessment/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to submit assessment');
    }
    return result;
  },

  async getLatestAssessment() {
    const res = await safeFetch(`${API_BASE_URL}/assessment/latest`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch latest assessment');
    }
    return result;
  },

  // AI Mock Interview endpoints
  async startMockInterview(role) {
    const res = await safeFetch(`${API_BASE_URL}/interview/start`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(role ? { role } : {}),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to start AI mock interview');
    }
    return result;
  },

  async submitInterviewAnswer(interviewId, data) {
    const res = await safeFetch(`${API_BASE_URL}/interview/${interviewId}/answer`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to evaluate interview answer');
    }
    return result;
  },

  async getLatestInterview() {
    const res = await safeFetch(`${API_BASE_URL}/interview/latest`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch latest interview');
    }
    return result;
  },

  async getInterviewById(interviewId) {
    const res = await safeFetch(`${API_BASE_URL}/interview/${interviewId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch interview details');
    }
    return result;
  },

  // Placement Readiness & Recommendations endpoints
  async getPlacementReadiness() {
    const res = await safeFetch(`${API_BASE_URL}/readiness`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch placement readiness data');
    }
    return result;
  },

  async getPlacementRecommendations() {
    const res = await safeFetch(`${API_BASE_URL}/readiness/recommendations`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch placement recommendations');
    }
    return result;
  },

  // Health check
  async checkHealth() {
    const res = await safeFetch(`${API_BASE_URL}/health`);
    return await res.json();
  },
};
