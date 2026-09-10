const API_BASE_URL = 'http://localhost:5000/api';

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

export const api = {
  // Auth endpoints
  async register(data) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
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
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
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
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
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
    const res = await fetch(`${API_BASE_URL}/profile`, {
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
    const res = await fetch(`${API_BASE_URL}/profile`, {
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

  // Health check
  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  },
};
