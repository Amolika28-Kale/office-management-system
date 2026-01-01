const Space = require("../../models/common/Space");

/**
 * USER: GET ACTIVE SPACES BY TYPE
 * /api/user/spaces?type=cabin
 */
exports.getSpaces = async (req, res) => {
  try {
    const query = { isActive: true };

    if (req.query.type) {
      query.type = req.query.type;
    }

    const spaces = await Space.find(query).sort({ name: 1 });

    res.json(spaces);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch spaces" });
  }
};
