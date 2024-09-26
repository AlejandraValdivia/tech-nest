import express from "express";
import { sendPasswordResetEmail } from "../middleware/sendPasswordResetEmail.js"; // Correct import path

const router = express.Router();

// POST request to send a test password reset email
router.post("/test-email", async (req, res) => {
  console.log("Hit the /test-email route");
  res.status(200).json({ message: "Route is working" });
  const { email, name } = req.body;
  const token = "dummy-reset-token"; // Generate a real token if needed
  const result = await sendPasswordResetEmail(token, email, name);

  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(500).json({ message: result.message });
  }
});

export default router;
