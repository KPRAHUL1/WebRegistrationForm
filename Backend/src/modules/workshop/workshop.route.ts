
const express = require("express");
const router = express.Router();
import { createWorkshop, getAllWorkshops, getWorkshopById, updateWorkshop, deleteWorkshop } from './workshop.service';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/workshop-posters/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'poster-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb: any) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.post("/", async (req: any, res: any) => {
  try {
    const result = await createWorkshop(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating workshop:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req: any, res: any) => {
  try {
    const workshops = await getAllWorkshops();
    res.json(workshops);
  } catch (error) {
    console.error("Error fetching workshops:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

router.put("/:id", upload.single('posterImage'), async (req: any, res: any) => {
  try {
    // Handle file upload
    let posterImage = req.body.existingPosterImage; // Keep existing if no new file
    if (req.file) {
      posterImage = `/uploads/workshop-posters/${req.file.filename}`;
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      posterImage: posterImage
    };

    const result = await updateWorkshop(req.params.id, updateData);
    res.json(result);
  } catch (error) {
    console.error("Error updating workshop:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req: any, res: any) => {
  try {
    await deleteWorkshop(req.params.id);
    res.json({ message: "Workshop deleted successfully" });
  } catch (error) {
    console.error("Error deleting workshop:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;