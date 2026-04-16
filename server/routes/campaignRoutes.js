const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

const {
  createCampaign,
  getAllCampaigns,
  getActiveCampaigns,
  joinCampaign
} = require("../controllers/campaignController");

// Logged in users
router.get("/", protect, getAllCampaigns);
router.get("/active", protect, getActiveCampaigns);
router.put("/:id/join", protect, joinCampaign);

// Admin only
router.post("/", protect, authorize("admin", "lead_dev"), createCampaign);

module.exports = router;