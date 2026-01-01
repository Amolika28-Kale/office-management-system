const Lead = require("../../models/admin/Leads");

/**
 * CREATE LEAD (Admin / Website / WhatsApp)
 */
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL LEADS (Pagination + Filters)
 */
exports.getLeads = async (req, res) => {
  try {
    const { status, source, interestedIn } = req.query;

    const query = {};
    if (status) query.status = status;
    if (source) query.source = source;
    if (interestedIn) query.interestedIn = interestedIn;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: leads,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SINGLE LEAD
 */
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead)
      return res.status(404).json({ message: "Lead not found" });

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE LEAD
 */
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!lead)
      return res.status(404).json({ message: "Lead not found" });

    res.status(200).json({
      success: true,
      message: "Lead updated",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE LEAD
 */
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead)
      return res.status(404).json({ message: "Lead not found" });

    res.status(200).json({
      success: true,
      message: "Lead deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
