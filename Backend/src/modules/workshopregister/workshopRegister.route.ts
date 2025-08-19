const express = require("express");
const router = express.Router();
import { uploadFileMiddleware } from "../../shared/lib/utils/fileUpload";
        import {
          registerForWorkshop,
          getWorkshopById, getActiveWorkshops,
        } from "./workshopRegister.service"

        
// Create workshop

// Register for workshop
router.post("/:id/register", async (req: any, res: any) => {
  try {
    console.log("=== Registration Request Debug ===");
    console.log("Workshop ID:", req.params.id);
    console.log("Request body:", req.body);
    console.log("Files:", req.files || req.file);
    
    // Run your upload middleware for "paymentProof" field
    const filePath: any = await uploadFileMiddleware(req, res, "paymentProof");
    console.log("File uploaded to:", filePath);

    if (!filePath) {
      return res.status(400).json({ error: "Payment proof file upload failed" });
    }

    // Build relative path + url
    const imagePath = filePath?.replace(/^.*uploads[\\/]/, "/uploads/");
    const imageUrl = `${req.protocol}://${req.get("host")}${imagePath}`;

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'upiId', 'amount'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    const registrationData = {
      ...req.body,
      workshopId: req.params.id,
      paymentProof: imagePath, // store only the relative path in DB
    };

    console.log("Registration data:", registrationData);

    const registration = await registerForWorkshop(registrationData);

    res.status(201).json({
      ...registration,
      imageUrl,
      imagePath,
    });
  } catch (error:any) {
    console.error("Error registering for workshop:", error);
    
    // More detailed error response
    if (error.code === 'P2002') {
      res.status(409).json({ error: "Registration already exists for this email/phone" });
    } else if (error.code && error.code.startsWith('P')) {
      res.status(400).json({ error: "Database validation error: " + error.message });
    } else {
      res.status(500).json({ 
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});


// Get workshop by ID
router.get("/:id", async (req: any, res: any) => {
  try {
    const workshop = await getWorkshopById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ error: "Workshop not found" });
    }
    res.json(workshop);
  } catch (error) {
    console.error("Error fetching workshop:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Add this route handler
router.get('/workshop/active', async (req: any, res: any) => {
  try {
    const workshops = await getActiveWorkshops();
    res.json(workshops);
  } catch (error) {
    console.error("Error fetching active workshops:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Delete workshop


module.exports = router;