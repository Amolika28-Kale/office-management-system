const Admin = require("../../models/admin/Admin");
const User = require("../../models/user/User");
const Space = require("../../models/common/Space");
const Booking = require("../../models/common/Booking");
const Lead = require("../../models/admin/Leads");

/* ---------------- DASHBOARD STATS ---------------- */
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
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

/* ---------------- DASHBOARD ANALYTICS ---------------- */
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const spaceType = req.query.spaceType || "all";

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    /* Space Filter */
    let spaceFilter = {};
    if (spaceType !== "all") spaceFilter.type = spaceType;

    const spaces = await Space.find(spaceFilter);
    const spaceIds = spaces.map(s => s._id);

    /* ---------------- MONTHLY BOOKINGS ---------------- */
    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lt: endOfYear },
          ...(spaceIds.length && { spaceId: { $in: spaceIds } }),
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

    /* ---------------- TOTAL & PREVIOUS REVENUE ---------------- */
    const revenueAgg = await Booking.aggregate([
      {
        $match: {
          status: { $in: ["active", "completed"] },
          createdAt: { $gte: startOfYear, $lt: endOfYear },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $ifNull: ["$totalAmount", 0] } },
        },
      },
    ]);

    const prevRevenueAgg = await Booking.aggregate([
      {
        $match: {
          status: { $in: ["active", "completed"] },
          createdAt: {
            $gte: new Date(year - 1, 0, 1),
            $lt: new Date(year, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $ifNull: ["$totalAmount", 0] } },
        },
      },
    ]);

    /* ---------------- BOOKINGS BY SPACE (PIE) ---------------- */
    const bookingsBySpace = await Booking.aggregate([
      {
        $match: {
          ...(spaceIds.length && { spaceId: { $in: spaceIds } }),
        },
      },
      {
        $lookup: {
          from: "spaces",
          localField: "spaceId",
          foreignField: "_id",
          as: "space",
        },
      },
      { $unwind: "$space" },
      {
        $group: {
          _id: "$space.type",
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          value: 1,
          _id: 0,
        },
      },
    ]);

    /* ---------------- REVENUE BY SPACE (PIE) ---------------- */
    const revenueBySpace = await Booking.aggregate([
      {
        $match: {
          status: { $in: ["active", "completed"] },
        },
      },
      {
        $lookup: {
          from: "spaces",
          localField: "spaceId",
          foreignField: "_id",
          as: "space",
        },
      },
      { $unwind: "$space" },
      {
        $group: {
          _id: "$space.type",
          value: { $sum: { $ifNull: ["$totalAmount", 0] } },
        },
      },
      {
        $project: {
          name: "$_id",
          value: 1,
          _id: 0,
        },
      },
    ]);

    /* ---------------- OCCUPANCY ---------------- */
    const activeBookings = await Booking.find({
      status: "active",
    }).populate("spaceId");

    const occupancy = {
      cabins: Math.round(
        (activeBookings.filter(b => b.spaceId?.type === "cabin").length / 9) * 100
      ),
      desks: Math.round(
        (activeBookings.filter(b => b.spaceId?.type === "desk").length / 60) * 100
      ),
      conference: Math.round(
        (activeBookings.filter(b => b.spaceId?.type === "conference").length / 1) * 100
      ),
    };

    /* ---------------- RECENT BOOKINGS ---------------- */
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("spaceId", "name type");

    /* ---------------- PENDING ---------------- */
    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });

    res.status(200).json({
      monthlyBookings,
      bookingsBySpace,
      revenueBySpace,
      occupancy,
      totalRevenue: revenueAgg[0]?.total || 0,
      previousRevenue: prevRevenueAgg[0]?.total || 0,
      recentBookings,
      pendingBookings,
    });
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);
    res.status(500).json({ message: "Analytics failed" });
  }
};
