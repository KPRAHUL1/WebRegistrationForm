import express from "express";
const router = express.Router();

import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  archiveCourse,
  getCourseRegistrations,
  createCourseRegistration,
  updateCourseRegistration,
  deleteCourseRegistration,
  getActiveCourses
} from './course.service';

// ============ COURSE ROUTES ============

// Create course
router.post("/", async (req:any, res:any) => {
  try {
    // Validate required fields
    const { title, startDate, endDate } = req.body;
    
    if (!title || !startDate || !endDate) {
      return res.status(400).json({
        error: "Missing required fields: title, startDate, endDate"
      });
    }
    
    const result = await createCourse(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: "Course created successfully"
    });
  } catch (error:any) {
    console.error("Error creating course:", error);
    res.status(400).json({
      error: error.message || "Failed to create course"
    });
  }
});

// Get all courses
router.get("/", async (req: any, res: any) => {
  try {
    const courses = await getAllCourses();
    res.json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ 
      error: error.message || "Failed to fetch courses" 
    });
  }
});
router.get('/active', async (req: any, res: any) => {
  try {
    const workshops = await getActiveCourses();
    res.json(workshops);
  } catch (error) {
    console.error("Error fetching active workshops:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// IMPORTANT: Put specific routes BEFORE dynamic routes
// Get all registrations (admin view) - MOVED UP
router.get("/registrations", async (req: any, res: any) => {
  try {
    const registrations = await getCourseRegistrations();
    res.json({
      success: true,
      data: registrations,
      count: registrations.length
    });
  } catch (error: any) {
    console.error("Error fetching all registrations:", error);
    res.status(500).json({ 
      error: error.message || "Failed to fetch registrations" 
    });
  }
});

// Get course by ID - NOW AFTER /registrations
router.get("/:id", async (req: any, res: any) => {
  try {
    const course = await getCourseById(req.params.id);
    res.json({
      success: true,
      data: course
    });
  } catch (error: any) {
    console.error("Error fetching course:", error);
    const statusCode = error.message === "Course not found" ? 404 : 500;
    res.status(statusCode).json({ 
      error: error.message || "Failed to fetch course" 
    });
  }
});

// Update course
router.put("/:id", async (req: any, res: any) => {
  try {
    const result = await updateCourse(req.params.id, req.body);
    res.json({
      success: true,
      data: result,
      message: "Course updated successfully"
    });
  } catch (error: any) {
    console.error("Error updating course:", error);
    const statusCode = error.message === "Course not found" ? 404 : 400;
    res.status(statusCode).json({ 
      error: error.message || "Failed to update course" 
    });
  }
});

// Delete course
router.delete("/:id", async (req: any, res: any) => {
  try {
    await deleteCourse(req.params.id);
    res.json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting course:", error);
    const statusCode = error.message === "Course not found" ? 404 : 400;
    res.status(statusCode).json({ 
      error: error.message || "Failed to delete course" 
    });
  }
});

// Archive course
router.put("/:id/archive", async (req: any, res: any) => {
  try {
    const result = await archiveCourse(req.params.id);
    res.json({
      success: true,
      data: result,
      message: "Course archived successfully"
    });
  } catch (error: any) {
    console.error("Error archiving course:", error);
    const statusCode = error.message === "Course not found" ? 404 : 500;
    res.status(statusCode).json({ 
      error: error.message || "Failed to archive course" 
    });
  }
});

// Get registrations for a specific course
router.get("/:courseId/registrations", async (req: any, res: any) => {
  try {
    const registrations = await getCourseRegistrations(req.params.courseId);
    res.json({
      success: true,
      data: registrations,
      count: registrations.length
    });
  } catch (error: any) {
    console.error("Error fetching course registrations:", error);
    res.status(500).json({ 
      error: error.message || "Failed to fetch registrations" 
    });
  }
});

// Create course registration
router.post("/:courseId/register", async (req: any, res: any) => {
  try {
    const { fullName, email, phone } = req.body;
    
    if (!fullName || !email) {
      return res.status(400).json({
        error: "Missing required fields: name, email"
      });
    }

    const registrationData = {
      courseId: req.params.courseId,
      fullName,
      email,
      phone,
      formData: req.body.formData
    };

    const result = await createCourseRegistration(registrationData);
    res.status(201).json({
      success: true,
      data: result,
      message: "Registration successful"
    });
  } catch (error: any) {
    console.error("Error creating registration:", error);
    res.status(400).json({ 
      error: error.message || "Failed to create registration" 
    });
  }
});

// Update course registration
router.put("/registrations/:registrationId", async (req: any, res: any) => {
  try {
    const result = await updateCourseRegistration(req.params.registrationId, req.body);
    res.json({
      success: true,
      data: result,
      message: "Registration updated successfully"
    });
  } catch (error: any) {
    console.error("Error updating registration:", error);
    const statusCode = error.message === "Registration not found" ? 404 : 400;
    res.status(statusCode).json({ 
      error: error.message || "Failed to update registration" 
    });
  }
});

// Delete course registration
router.delete("/registrations/:registrationId", async (req: any, res: any) => {
  try {
    await deleteCourseRegistration(req.params.registrationId);
    res.json({
      success: true,
      message: "Registration deleted successfully"
    });
  } catch (error: any) {
    console.error("Error deleting registration:", error);
    const statusCode = error.message === "Registration not found" ? 404 : 500;
    res.status(statusCode).json({ 
      error: error.message || "Failed to delete registration" 
    });
  }
});

module.exports = router;