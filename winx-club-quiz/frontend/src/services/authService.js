const API_URL = 'http://localhost:5000/auth';

const request = async (endpoint, method, body = null) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      return { message: errorData.message || 'Request failed' };
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return { message: 'Network error' };
  }
};

export const signup = async (username, password) => {
  return await request('/signup', 'POST', { username, password });
};

export const login = async (username, password) => {
  return await request('/login', 'POST', { username, password });
};
