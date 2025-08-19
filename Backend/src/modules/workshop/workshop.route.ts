
const express = require("express");
const router = express.Router();
 import {createWorkshop,getAllWorkshops,updateWorkshop,deleteWorkshop} from './workshop.service'
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
router.put("/:id", async (req: any, res: any) => {
  try {
    const result = await updateWorkshop(req.params.id, req.body);
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
module.exports =router;