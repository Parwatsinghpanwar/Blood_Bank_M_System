const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const { 
  createCollection, 
  getMyCollections, 
  getMyDonationHistory, 
  searchDonors,
  getAllDonations
} = require("../controllers/collectionController");

// Create collection
router.post("/", protect, authorize("collector", "admin", "lead_dev"), createCollection);

// Collector's own collections
router.get("/", protect, authorize("collector", "admin", "lead_dev"), getMyCollections);

// Admin: ALL donations
router.get("/all", protect, authorize("admin", "lead_dev"), getAllDonations);

// Donor self history
router.get("/my-history", protect, getMyDonationHistory);

// Search donors
router.get("/search-donor", protect, authorize("collector", "admin", "lead_dev"), searchDonors);

module.exports = router;