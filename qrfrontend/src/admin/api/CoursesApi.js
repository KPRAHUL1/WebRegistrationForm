// services/courseService.js
const API_BASE = 'http://localhost:7700/api';

export const courseService = {
  getCourses: async () => {
    const response = await fetch(`${API_BASE}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  createCourse: async (courseData) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(courseData)
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
  }
};