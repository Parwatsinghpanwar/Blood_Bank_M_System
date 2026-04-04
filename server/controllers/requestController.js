const Request = require("../models/Request");
const Inventory = require("../models/Inventory");
const User = require("../models/User");
const sendNotification = require("../utils/notificationService");
const InventoryLog = require("../models/InventoryLog");
const Collection = require("../models/Collection"); // ✅ ADD THIS

// @desc Get active requests (FIXED FILTER)
exports.getActiveRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      status: { $in: ["pending"] } // ✅ ONLY ACTIVE
    })
      .populate("hospitalId", "name location")
      .populate("requesterId", "name")
      .populate("volunteers.user", "name phone bloodGroup")
      .sort({ urgency: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// @desc Volunteer apply
exports.volunteerForRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request)
      return res.status(404).json({ success: false, message: "Request not found" });

    // ❌ STOP if already assigned / locked
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This request is already being handled"
      });
    }

    const alreadyApplied = request.volunteers.some(
      v => v.user.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You already applied"
      });
    }

    request.volunteers.push({
      user: req.user._id,
      status: "pending"
    });

    await request.save();

    res.status(200).json({
      success: true,
      message: "Applied successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// @desc Assign volunteer (MAIN FIX)
exports.assignVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request)
      return res.status(404).json({ success: false, message: "Request not found" });

    // 1. Find volunteer
    const volunteerEntry = request.volunteers.find(
      v => v.user.toString() === volunteerId
    );

    if (!volunteerEntry) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found"
      });
    }

    // 2. Assign
    volunteerEntry.status = "assigned";

    // ❗ IMPORTANT FIX
    request.status = "fulfilled"; // ✅ STOP showing to others

    await request.save();

    // 3. Update donor eligibility
    await User.findByIdAndUpdate(volunteerId, {
      lastDonationDate: new Date()
    });

    // 4. ADD TO DONOR COLLECTION LIST ✅🔥
    await Collection.create({
      donor: volunteerId,
      donorName: req.user.name,
      bloodGroup: req.user.bloodGroup,
      quantityUnits: 1,
      location: request.location
    });

    // 5. Notify
    await sendNotification({
      userId: volunteerId,
      type: "volunteer_selected",
      message: `You are selected for donation`,
      relatedId: request._id
    });

    res.status(200).json({
      success: true,
      message: "Donor assigned & request locked"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error", error });
  }
};

// @desc Complete request
exports.markRequestComplete = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("volunteers.user");

    if (!request)
      return res.status(404).json({ success: false, message: "Not found" });

    request.status = "completed";
    await request.save();

    const donors = request.volunteers.filter(v => v.status === "assigned");

    for (const d of donors) {
      await User.findByIdAndUpdate(d.user._id, {
        lastDonationDate: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: "Completed"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error", error });
  }
};