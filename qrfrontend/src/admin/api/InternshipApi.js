// services/internshipService.js
const API_BASE = '/api';

export const internshipService = {
  getInternships: async () => {
    const response = await fetch(`${API_BASE}/internships`);
    if (!response.ok) throw new Error('Failed to fetch internships');
    return response.json();
  },

  createInternship: async (internshipData) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE}/internships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(internshipData)
    });
    if (!response.ok) throw new Error('Failed to create internship');
    return response.json();
  }
};