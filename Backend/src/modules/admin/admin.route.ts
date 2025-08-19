const express = require("express");
const router = express.Router();
import { adminLogin, getAdminProfile } from './admin.service'

// Admin login (no auth required)
router.post("/login", async (req: any, res: any) => {
  try {
    const result = await adminLogin(req.body);
    res.status(200).json(result);
  } catch (error:any) {
    console.error("Error in admin login:", error);
    res.status(401).json({ error: error.message });
  }
});

// Protected routes

router.get("/profile", async (req: any, res: any) => {
  try {
    const response = await getAdminProfile(req.admin.id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting admin profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;