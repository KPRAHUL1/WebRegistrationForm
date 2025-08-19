const express = require("express");
const router = express.Router();
import  {
  createPayment,
  updatePaymentStatus,
  getPaymentById
} from "./payment.service"

// Create payment
router.post("/", async (req: any, res: any) => {
  try {
    const payment = await createPayment(req.body);
    res.status(201).json(payment);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update payment status
router.patch("/:id/status", async (req: any, res: any) => {
  try {
    const payment = await updatePaymentStatus(req.params.id, req.body.status);
    res.json(payment);
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get payment by ID
router.get("/:id", async (req: any, res: any) => {
  try {
    const payment = await getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;