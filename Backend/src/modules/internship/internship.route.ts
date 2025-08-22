import express from "express";
const router = express.Router();

import {
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
  archiveInternship,
  getInternshipRegistrations,
  createInternshipRegistration,
  updateInternshipRegistration,
  deleteInternshipRegistration,
  getActiveInternship
} from "./internship.service";

// Create internship
router.post("/", async (req:any, res:any) => {
  try {
    const { title, startDate, endDate } = req.body;
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = await createInternship(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get all internships
router.get("/", async (_, res) => {
  try {
    const internships = await getAllInternships();
    res.json({ success: true, data: internships });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Registrations (admin view)
router.get("/registrations", async (_, res) => {
  try {
    const registrations = await getInternshipRegistrations();
    res.json({ success: true, data: registrations });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/active', async (req: any, res: any) => {
  try {
    const workshops = await getActiveInternship();
    res.json(workshops);
  } catch (error) {
    console.error("Error fetching active workshops:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Get internship by ID
router.get("/:id", async (req, res) => {
  try {
    const internship = await getInternshipById(req.params.id);
    res.json({ success: true, data: internship });
  } catch (err: any) {
    res.status(err.message.includes("not found") ? 404 : 500).json({ error: err.message });
  }
});

// Update internship
router.put("/:id", async (req, res) => {
  try {
    const updated = await updateInternship(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Delete internship
router.delete("/:id", async (req, res) => {
  try {
    await deleteInternship(req.params.id);
    res.json({ success: true, message: "Internship deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Archive internship
router.put("/:id/archive", async (req, res) => {
  try {
    const result = await archiveInternship(req.params.id);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get registrations for internship
router.get("/:internshipId/registrations", async (req, res) => {
  try {
    const regs = await getInternshipRegistrations(req.params.internshipId);
    res.json({ success: true, data: regs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Register
router.post("/:internshipId/register", async (req, res) => {
  try {
    const result = await createInternshipRegistration({
      ...req.body,
      internshipId: req.params.internshipId
    });
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Update registration
router.put("/registrations/:id", async (req, res) => {
  try {
    const result = await updateInternshipRegistration(req.params.id, req.body);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Delete registration
router.delete("/registrations/:id", async (req, res) => {
  try {
    await deleteInternshipRegistration(req.params.id);
    res.json({ success: true, message: "Registration deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
