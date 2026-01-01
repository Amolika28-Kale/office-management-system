const Admin = require("../../models/admin/Admin");
const User = require("../../models/user/User");
const Space = require("../../models/common/Space");
const Booking = require("../../models/common/Booking");
const Lead = require("../../models/admin/Leads");

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalAdmins,
      totalUsers,
      totalSpaces,
      activeSpaces,
      totalBookings,
      pendingBookings,
      totalLeads,
    ] = await Promise.all([
      Admin.countDocuments(),
      User.countDocuments(),
      Space.countDocuments(),
      Space.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Lead.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalAdmins,
        totalUsers,
        totalSpaces,
        activeSpaces,
        totalBookings,
        pendingBookings,
        totalLeads,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};


exports.getDashboardAnalytics = async (req, res) => {
  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    /* Monthly Bookings */
    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          revenue: { $sum: { $ifNull: ["$totalAmount", 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    /* Total Revenue */
    const revenueAgg = await Booking.aggregate([
      {
        $match: {
          status: { $in: ["active", "completed"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $ifNull: ["$totalAmount", 0] } },
        },
      },
    ]);

    /* Recent Bookings */
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("spaceId", "name type");

    /* Pending Approvals */
    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });

    res.status(200).json({
      monthlyBookings,
      totalRevenue: revenueAgg[0]?.total || 0,
      recentBookings,
      pendingBookings,
    });
  } catch (err) {
    console.error("Dashboard Analytics Error:", err);
    res.status(500).json({ message: "Analytics failed" });
  }
};
