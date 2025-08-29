const express = require("express");
const router = express.Router();
import { 
  getAllIncomes, 
  getIncomeById, 
  createIncomeFromWorkshopRegistration, 
  createIncomeFromCourseRegistration,
  getTotalIncome 
} from './income.service';

router.get("/", async (req: any, res: any) => {
  try {
    const incomes = await getAllIncomes();
    res.json(incomes);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/total", async (req: any, res: any) => {
  try {
    const total = await getTotalIncome();
    res.json({ total });
  } catch (error) {
    console.error("Error fetching total income:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: any, res: any) => {
  try {
    const income = await getIncomeById(req.params.id);
    if (!income) {
      return res.status(404).json({ error: "Income not found" });
    }
    res.json(income);
  } catch (error) {
    console.error("Error fetching income:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create income from workshop registration
router.post("/workshop-registration", async (req: any, res: any) => {
  try {
    const { registrationId, amount } = req.body;
    if (!registrationId || !amount) {
      return res.status(400).json({ error: "Registration ID and amount are required" });
    }
    
    const result = await createIncomeFromWorkshopRegistration(registrationId, amount);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating income from workshop registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create income from course registration
router.post("/course-registration", async (req: any, res: any) => {
  try {
    const { registrationId, amount } = req.body;
    if (!registrationId || !amount) {
      return res.status(400).json({ error: "Registration ID and amount are required" });
    }
    
    const result = await createIncomeFromCourseRegistration(registrationId, amount);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating income from course registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;