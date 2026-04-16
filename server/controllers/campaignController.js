const Campaign = require("../models/Campaign");

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @access  Admin
exports.createCampaign = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const campaign = await Campaign.create({
      title,
      description,
      date,
      location,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @desc    Get all upcoming campaigns
// @route   GET /api/campaigns
// @access  Private
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      date: { $gte: new Date() },
    })
      .populate("participants", "name email role")
      .populate("createdBy", "name")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @desc    Get active campaigns
// @route   GET /api/campaigns/active
// @access  Private
exports.getActiveCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      date: { $gte: new Date() },
    })
      .populate("participants", "name email role")
      .populate("createdBy", "name")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @desc    Join a campaign
// @route   PUT /api/campaigns/:id/join
// @access  Private
exports.joinCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    const alreadyJoined = campaign.participants.some(
      (participant) => participant.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: "You have already joined this campaign",
      });
    }

    campaign.participants.push(req.user._id);
    await campaign.save();

    const updatedCampaign = await Campaign.findById(campaign._id)
      .populate("participants", "name email role")
      .populate("createdBy", "name");

    res.status(200).json({
      success: true,
      message: "You have joined the campaign",
      data: updatedCampaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};