// services/workshopService.js
const API_BASE = 'http://localhost:7700/api';

export const workshopService = {
  // Get all workshops
  getWorkshops: async () => {
    const response = await fetch(`${API_BASE}/workshop`);
    if (!response.ok) throw new Error('Failed to fetch workshops');
    return response.json();
  },

  // Get workshop by ID
  getWorkshopById: async (id) => {
    const response = await fetch(`${API_BASE}/workshop/${id}`);
    if (!response.ok) throw new Error('Failed to fetch workshop');
    return response.json();
  },

  // Create new workshop
  createWorkshop: async (workshopData) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE}/workshop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(workshopData)
    });
    if (!response.ok) throw new Error('Failed to create workshop');
    return response.json();
  },

  // Update workshop
 updateWorkshop: async (id, workshopData) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE}/workshop/${id}`, {
      method: 'PUT', // Changed from PATCH to PUT
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(workshopData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update workshop');
    }
    return response.json();
  },

  // Delete workshop
  deleteWorkshop: async (id) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE}/workshop/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete workshop');
    return response.json();
  }
};