import { useState, useEffect, useCallback } from 'react';
import { workshopService } from '../api/WorkshopApi';
import { courseService } from '../api/CoursesApi';

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    workshops: [],
    workshopRegistrations: [],
    courses: [],
    courseRegistrations: [],
    stats: {
      workshops: 0,
      courses: 0,
      internships: 5,
      registrations: 0
    }
  });

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [workshopsData, coursesData] = await Promise.all([
        workshopService.getWorkshops(),
        courseService.getCourses(),
      ]);

      // Calculate total registrations (you might need to fetch this separately)
      const totalRegistrations = (workshopsData.length + coursesData.length) * 25; // Mock calculation

      setDashboardData(prevData => ({
        ...prevData,
        workshops: workshopsData || [],
        courses: coursesData || [],
        stats: {
          ...prevData.stats,
          workshops: workshopsData?.length || 0,
          courses: coursesData?.length || 0,
          registrations: totalRegistrations,
        }
      }));
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(`Failed to load dashboard data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Workshop handlers
  const handleUpdateWorkshop = useCallback((updatedWorkshop) => {
    setDashboardData(prevData => ({
      ...prevData,
      workshops: prevData.workshops.map(ws =>
        ws.id === updatedWorkshop.id ? updatedWorkshop : ws
      ),
    }));
  }, []);

  const handleCreateWorkshop = useCallback(async (newWorkshop) => {
    try {
      const createdWorkshop = await workshopService.createWorkshop(newWorkshop);
      setDashboardData(prevData => ({
        ...prevData,
        workshops: [...prevData.workshops, createdWorkshop],
        stats: {
          ...prevData.stats,
          workshops: prevData.stats.workshops + 1,
        }
      }));
      return createdWorkshop;
    } catch (error) {
      console.error("Error creating workshop:", error);
      throw error;
    }
  }, []);

  // Course handlers
  const handleUpdateCourse = useCallback((updatedCourse) => {
    setDashboardData(prevData => ({
      ...prevData,
      courses: prevData.courses.map(course =>
        course.id === updatedCourse.id ? updatedCourse : course
      ),
    }));
  }, []);

  const handleCreateCourse = useCallback(async (newCourse) => {
    try {
      const createdCourse = await courseService.createCourse(newCourse);
      setDashboardData(prevData => ({
        ...prevData,
        courses: [...prevData.courses, createdCourse],
        stats: {
          ...prevData.stats,
          courses: prevData.stats.courses + 1,
        }
      }));
      return createdCourse;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  }, []);

  const handleDeleteCourse = useCallback(async (courseId) => {
    try {
      await courseService.deleteCourse(courseId);
      setDashboardData(prevData => ({
        ...prevData,
        courses: prevData.courses.filter(course => course.id !== courseId),
        stats: {
          ...prevData.stats,
          courses: prevData.stats.courses - 1,
        }
      }));
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  }, []);

  const handleArchiveCourse = useCallback(async (courseId) => {
    try {
      const archivedCourse = await courseService.archiveCourse(courseId);
      setDashboardData(prevData => ({
        ...prevData,
        courses: prevData.courses.map(course =>
          course.id === courseId ? { ...course, isArchived: true } : course
        ),
      }));
      return archivedCourse;
    } catch (error) {
      console.error("Error archiving course:", error);
      throw error;
    }
  }, []);

  // Initialize data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    isLoading,
    error,
    refetch: fetchDashboardData,
    // Workshop handlers
    handleUpdateWorkshop,
    handleCreateWorkshop,
    // Course handlers
    handleUpdateCourse,
    handleCreateCourse,
    handleDeleteCourse,
    handleArchiveCourse,
  };
};