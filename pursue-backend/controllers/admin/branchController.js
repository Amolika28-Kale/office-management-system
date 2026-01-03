const Branch = require("../../models/admin/Branch");

/* CREATE */
exports.createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json(branch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* READ ALL */
exports.getBranches = async (req, res) => {
  const branches = await Branch.find().sort({ createdAt: -1 });
  res.json(branches);
};

/* READ ONE */
exports.getBranchById = async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) return res.status(404).json({ message: "Branch not found" });
  res.json(branch);
};

/* UPDATE */
exports.updateBranch = async (req, res) => {
  const branch = await Branch.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(branch);
};

/* DELETE */
exports.deleteBranch = async (req, res) => {
  await Branch.findByIdAndDelete(req.params.id);
  res.json({ message: "Branch deleted successfully" });
};
