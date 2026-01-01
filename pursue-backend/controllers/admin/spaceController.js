const Space = require("../../models/common/Space");

/**
 * CREATE SPACE
 */
exports.createSpace = async (req, res) => {
  try {
    const space = await Space.create(req.body);
    res.status(201).json(space);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET ALL SPACES (PAGINATION + SEARCH + FILTER)
 * /api/admin/spaces?page=1&limit=10&type=desk&status=active
 */
exports.getSpaces = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, search } = req.query;

    const query = {};

    if (type) query.type = type;
    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const spaces = await Space.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Space.countDocuments(query);

    res.json({
      data: spaces,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET SINGLE SPACE
 */
exports.getSpaceById = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    if (!space) return res.status(404).json({ message: "Space not found" });
    res.json(space);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE SPACE
 */
exports.updateSpace = async (req, res) => {
  try {
    const space = await Space.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!space) return res.status(404).json({ message: "Space not found" });

    res.json(space);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * DELETE SPACE
 */
exports.deleteSpace = async (req, res) => {
  try {
    const space = await Space.findByIdAndDelete(req.params.id);
    if (!space) return res.status(404).json({ message: "Space not found" });

    res.json({ message: "Space deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * TOGGLE ACTIVE / INACTIVE
 */
exports.toggleSpaceStatus = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    if (!space) return res.status(404).json({ message: "Space not found" });

    space.isActive = !space.isActive;
    await space.save();

    res.json({
      message: "Status updated",
      isActive: space.isActive,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ACTIVE SPACES FOR DROPDOWNS
exports.getActiveSpaces = async (req, res) => {
  const { type } = req.query;

  const query = { isActive: true };
  if (type) query.type = type;

  const spaces = await Space.find(query).sort({ name: 1 });

  res.json(spaces);
};
