const Inventory = require("../../models/admin/Inventory");

/**
 * @desc    Create inventory item
 * @route   POST /api/admin/inventory
 * @access  Private (Admin)
 */
exports.createItem = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);

    res.status(201).json({
      success: true,
      message: "Inventory item created",
      data: item,
    });
  } catch (error) {
    console.error("Create Inventory Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create inventory item",
    });
  }
};

/**
 * @desc    Get all inventory items
 * @route   GET /api/admin/inventory
 * @access  Private (Admin)
 */
exports.getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get Inventory Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
    });
  }
};

/**
 * @desc    Get single inventory item
 * @route   GET /api/admin/inventory/:id
 * @access  Private (Admin)
 */
exports.getItemById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Get Inventory By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory item",
    });
  }
};

/**
 * @desc    Update inventory item
 * @route   PUT /api/admin/inventory/:id
 * @access  Private (Admin)
 */
exports.updateItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory updated",
      data: item,
    });
  } catch (error) {
    console.error("Update Inventory Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update inventory",
    });
  }
};

/**
 * @desc    Delete inventory item
 * @route   DELETE /api/admin/inventory/:id
 * @access  Private (Admin)
 */
exports.deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory item deleted",
    });
  } catch (error) {
    console.error("Delete Inventory Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete inventory",
    });
  }
};

/**
 * 🚨 LOW STOCK ITEMS (Dashboard Widget)
 * @desc    Get low stock items
 * @route   GET /api/admin/inventory/low-stock
 * @access  Private (Admin)
 */
exports.getLowStockItems = async (req, res) => {
  try {
    const items = await Inventory.find({
      $expr: { $lte: ["$quantity", "$minStock"] },
    });

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Low Stock Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch low stock items",
    });
  }
};
