import { useState, useEffect, useCallback, useRef } from 'react';
import { workshopService } from '../api/WorkshopApi';
import { courseService } from '../api/CoursesApi';
import { internshipService } from '../api/InternshipApi';

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isInitializedRef = useRef(false);
  
  const [dashboardData, setDashboardData] = useState({
    workshops: [],
    workshopRegistrations: [],
    courses: [],
    courseRegistrations: [],
    internships: [],
    internshipRegistrations: [],
    stats: {
      workshops: 0,
      courses: 0,
      internships: 0,
      registrations: 0
    }
  });

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    // Don't set loading if we already have data (prevents clearing on updates)
    if (!isInitializedRef.current) {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      console.log('Fetching dashboard data...');
      
      // Fetch all data in parallel
      const [
        workshopsData, 
        coursesData, 
        internshipsData,
        workshopRegistrationsData,
        courseRegistrationsData,
        internshipRegistrationsData
      ] = await Promise.all([
        workshopService.getWorkshops(),
        courseService.getCourses(),
        internshipService.getInternships(),
        // Fetch registrations data
        workshopService.getRegistrations(), // Assuming you have this method
        courseService.getRegistrations(),   // Assuming you have this method
        internshipService.getRegistrations() // Assuming you have this method
      ]);

      console.log('Raw API responses:', {
        workshops: workshopsData,
        courses: coursesData,
        internships: internshipsData,
        workshopRegistrations: workshopRegistrationsData,
        courseRegistrations: courseRegistrationsData,
        internshipRegistrations: internshipRegistrationsData
      });

      // Handle different response structures
      const workshops = Array.isArray(workshopsData) ? workshopsData : workshopsData?.data || [];
      const courses = Array.isArray(coursesData) ? coursesData : coursesData?.data || [];
      const internships = Array.isArray(internshipsData) ? internshipsData : internshipsData?.data || [];
      
      // Handle registration data structures
      const workshopRegistrations = Array.isArray(workshopRegistrationsData) 
        ? workshopRegistrationsData 
        : workshopRegistrationsData?.data || [];
      const courseRegistrations = Array.isArray(courseRegistrationsData) 
        ? courseRegistrationsData 
        : courseRegistrationsData?.data || [];
      const internshipRegistrations = Array.isArray(internshipRegistrationsData) 
        ? internshipRegistrationsData 
        : internshipRegistrationsData?.data || [];

      console.log('Processed data arrays:', {
        workshops: workshops,
        courses: courses,
        internships: internships,
        workshopRegistrations: workshopRegistrations,
        courseRegistrations: courseRegistrations,
        internshipRegistrations: internshipRegistrations
      });

      // Calculate total registrations from actual data
      const totalRegistrations = workshopRegistrations.length + courseRegistrations.length + internshipRegistrations.length;

      const newData = {
        workshops: workshops,
        courses: courses,
        internships: internships,
        workshopRegistrations: workshopRegistrations,
        courseRegistrations: courseRegistrations,
        internshipRegistrations: internshipRegistrations,
        stats: {
          workshops: workshops.length || 0,
          courses: courses.length || 0,
          internships: internships.length || 0,
          registrations: totalRegistrations || 0,
        }
      };

      console.log('Setting dashboard data:', newData);
      
      // Use functional update to ensure we don't lose any existing data
      setDashboardData(prevData => {
        console.log('Previous data:', prevData);
        const updatedData = {
          ...prevData,
          ...newData
        };
        console.log('Updated data:', updatedData);
        return updatedData;
      });
      
      isInitializedRef.current = true;
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(`Failed to load dashboard data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Workshop handlers
  const handleUpdateWorkshop = useCallback((updatedWorkshop) => {
    console.log('Updating workshop:', updatedWorkshop);
    setDashboardData(prevData => {
      const newData = {
        ...prevData,
        workshops: prevData.workshops.map(ws =>
          ws.id === updatedWorkshop.id ? updatedWorkshop : ws
        ),
      };
      console.log('Workshop updated, new data:', newData);
      return newData;
    });
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
    console.log('Updating course:', updatedCourse);
    setDashboardData(prevData => {
      const newData = {
        ...prevData,
        courses: prevData.courses.map(course =>
          course.id === updatedCourse.id ? updatedCourse : course
        ),
      };
      console.log('Course updated, new data:', newData);
      return newData;
    });
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

  // Internship handlers
  const handleCreateInternship = useCallback(async (newInternship) => {
    try {
      console.log('Creating internship:', newInternship);
      const created = await internshipService.createInternship(newInternship);
      console.log('Created internship response:', created);
      
      setDashboardData(prev => {
        const newData = {
          ...prev,
          internships: [...prev.internships, created],
          stats: { 
            ...prev.stats, 
            internships: prev.stats.internships + 1 
          }
        };
        console.log('After creating internship, new data:', newData);
        return newData;
      });
      return created;
    } catch (error) {
      console.error("Error creating internship:", error);
      throw error;
    }
  }, []);

  const handleUpdateInternship = useCallback(async (updatedInternship) => {
    try {
      console.log('Updating internship:', updatedInternship);
      
      // If updatedInternship has an id and we need to call the API
      let finalInternship = updatedInternship;
      if (updatedInternship.id && typeof updatedInternship !== 'object') {
        // If we received just an ID, we need more data
        console.error('Invalid internship data for update');
        return;
      }

      // Call API if needed (you might want to uncomment this if your API requires it)
      // if (updatedInternship.id) {
      //   finalInternship = await internshipService.updateInternship(updatedInternship.id, updatedInternship);
      // }
      
      setDashboardData(prevData => {
        console.log('Before update - Previous internships:', prevData.internships);
        const newInternships = prevData.internships.map(internship =>
          internship.id === updatedInternship.id ? finalInternship : internship
        );
        console.log('After update - New internships:', newInternships);
        
        const newData = {
          ...prevData,
          internships: newInternships,
        };
        console.log('Internship updated, full new data:', newData);
        return newData;
      });
      
      return finalInternship;
    } catch (error) {
      console.error("Error updating internship:", error);
      throw error;
    }
  }, []);

  // Registration handlers - add these to handle registration updates
  const handleUpdateRegistrationStats = useCallback(() => {
    setDashboardData(prevData => ({
      ...prevData,
      stats: {
        ...prevData.stats,
        registrations: prevData.workshopRegistrations.length + 
                      prevData.courseRegistrations.length + 
                      prevData.internshipRegistrations.length
      }
    }));
  }, []);

  // Initialize data fetch only once
  useEffect(() => {
    if (!isInitializedRef.current) {
      fetchDashboardData();
    }
  }, [fetchDashboardData]);

  // Add a method to force refresh
  const forceRefresh = useCallback(() => {
    isInitializedRef.current = false;
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    isLoading,
    error,
    refetch: fetchDashboardData,
    forceRefresh,
    // Workshop handlers
    handleUpdateWorkshop,
    handleCreateWorkshop,
    // Course handlers
    handleUpdateCourse,
    handleCreateCourse,
    handleDeleteCourse,
    handleArchiveCourse,
    // Internship handlers
    handleCreateInternship,
    handleUpdateInternship,
    // Registration handlers
    handleUpdateRegistrationStats
  };
};