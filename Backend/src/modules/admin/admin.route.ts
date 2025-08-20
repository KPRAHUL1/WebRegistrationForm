import express from "express";
import { adminLogin, getAdminProfile, createAdmin } from "./admin.service";

const router = express.Router();

// Admin login (public route)
router.post("/login", async (req: any, res: any) => {
  try {
    const result = await adminLogin(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error in admin login:", error);
    res.status(401).json({ error: error.message });
  }
});

// Admin registration (optional, for seeding first admin)
router.post("/register", async (req: any, res: any) => {
  try {
    const admin = await createAdmin(req.body);
    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error: any) {
    console.error("Error in admin registration:", error);
    res.status(400).json({ error: error.message });
  }
});

// Protected route - profile
router.get("/profile", async (req: any, res: any) => {
  try {
    // req.admin is expected from auth middleware (decode JWT)
    const response = await getAdminProfile(req.admin.id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting admin profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
