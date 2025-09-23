const API_URL = 'http://localhost:5000/api'; // backend base URL

const api = {
  get: async (endpoint) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${endpoint.replace(/^\/+/, '')}`, {
      headers: { 'x-auth-token': token },
    });
    let data = {};
    try { data = await res.json(); } catch {}
    if (!res.ok) throw new Error(data.msg || 'Network response was not ok');
    return data;
  },

  post: async (endpoint, body) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${endpoint.replace(/^\/+/, '')}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify(body),
    });
    let data = {};
    try { data = await res.json(); } catch {}
    if (!res.ok) throw new Error(data.msg || 'An error occurred');
    return data;
  },

  put: async (endpoint, body) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${endpoint.replace(/^\/+/, '')}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify(body),
    });
    let data = {};
    try { data = await res.json(); } catch {}
    if (!res.ok) throw new Error(data.msg || 'An error occurred');
    return data;
  },
};

export default api;

