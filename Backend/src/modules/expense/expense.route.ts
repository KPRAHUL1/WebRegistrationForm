const express = require("express");
const router = express.Router();
import { createExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense, getTotalExpenses } from './expense.service';

router.post("/", async (req: any, res: any) => {
  try {
    const result = await createExpense(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req: any, res: any) => {
  try {
    const expenses = await getAllExpenses();
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/total", async (req: any, res: any) => {
  try {
    const total = await getTotalExpenses();
    res.json({ total });
  } catch (error) {
    console.error("Error fetching total expenses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: any, res: any) => {
  try {
    const expense = await getExpenseById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req: any, res: any) => {
  try {
    const result = await updateExpense(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req: any, res: any) => {
  try {
    await deleteExpense(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
