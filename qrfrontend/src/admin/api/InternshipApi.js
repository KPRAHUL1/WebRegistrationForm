// services/internshipService.js
const API_BASE = 'http://localhost:7700/api';

export const internshipService = {
  getInternships: async () => {
    const response = await fetch(`${API_BASE}/internship`);
    if (!response.ok) throw new Error('Failed to fetch internships');
    return response.json();
  },

  createInternship: async (internshipData) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE}/internship`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(internshipData)
    });
    if (!response.ok) throw new Error('Failed to create internship');
    return response.json();
  },
   updateInternship: async (id, internshipData) => {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE}/internship/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(internshipData)
  });
  if (!response.ok) throw new Error('Failed to update internship');
  return response.json();
},
getRegistrations : async () => {
  try {
    const response = await fetch(`${API_BASE}/internship/registrations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization headers if needed
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || data; // Handle both {success: true, data: [...]} and direct array responses
  } catch (error) {
    console.error('Error fetching internship registrations:', error);
    throw error;
  }
}

};