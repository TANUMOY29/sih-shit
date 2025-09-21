const API_URL = 'http://localhost:5000/api'; // Your backend server URL

const api = {
  get: async (endpoint) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers: { 'x-auth-token': token },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Network response was not ok');
    }
    return response.json();
  },

  post: async (endpoint, body) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'An error occurred');
    return data;
  },
  
  put: async (endpoint, body) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'An error occurred');
    return data;
  },
};

export default api;
