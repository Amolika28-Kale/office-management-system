const Booking = require("../../models/common/Booking");
const Space = require("../../models/common/Space");
const Payment = require("../../models/user/Payment");

exports.getUserDashboardStats = async (req, res) => {
  const userId = req.user.id;

  const bookings = await Booking.find({ user: userId });

  const activeBookings = bookings.filter(b => b.status === "active").length;
  const upcomingBookings = bookings.filter(b => b.status === "upcoming").length;

  const payments = await Payment.find({
    user: userId,
    status: "completed",
  });

  const totalSpent = payments.reduce(
    (sum, p) => sum + p.totalAmount,
    0
  );

  const hoursBooked = bookings.reduce(
    (sum, b) => sum + (b.hours || 0),
    0
  );

  res.json({
    success: true,
    data: {
      activeBookings,
      upcomingBookings,
      totalSpent,
      hoursBooked,
    },
  });
};

exports.getActiveBookings = async (req, res) => {
  const bookings = await Booking.find({
    user: req.user.id,
    status: "active",
  })
    .populate("spaceId", "name type")
    .sort({ startDate: -1 });

  res.json({
    success: true,
    data: bookings,
  });
};

exports.getUserDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { branchId, spaceType, range = "7d" } = req.query;

    /* DATE RANGE */
    const now = new Date();
    const fromDate = new Date();

    if (range === "30d") fromDate.setDate(now.getDate() - 30);
    else if (range === "90d") fromDate.setDate(now.getDate() - 90);
    else fromDate.setDate(now.getDate() - 7);

    /* SPACE FILTER */
    const spaceFilter = {};
    if (spaceType) spaceFilter.type = spaceType;
    if (branchId) spaceFilter.branchId = branchId;

    const spaces = await Space.find(spaceFilter).select("_id");
    const spaceIds = spaces.map(s => s._id);

    /* BOOKING FILTER */
    const bookingFilter = {
      user: userId,
      startDate: { $gte: fromDate },
    };

    if (spaceIds.length) {
      bookingFilter.spaceId = { $in: spaceIds };
    }

    const bookings = await Booking.find(bookingFilter)
      .populate("spaceId", "type name")
      .populate("branchId", "name");

    /* METRICS */
    const totalSpent = bookings.reduce((s, b) => s + (b.amount || 0), 0);
    const hoursBooked = bookings.reduce((s, b) => s + (b.hours || 0), 0);

    /* SPACE DISTRIBUTION */
    const spaceDistribution = {};
    bookings.forEach(b => {
      const type = b.spaceId?.type || "Other";
      spaceDistribution[type] = (spaceDistribution[type] || 0) + 1;
    });

    /* BRANCH DISTRIBUTION */
    const branchDistribution = {};
    bookings.forEach(b => {
      const name = b.branchId?.name || "Unknown";
      branchDistribution[name] = (branchDistribution[name] || 0) + 1;
    });

    /* USAGE TREND */
    const dailyUsage = {};
    bookings.forEach(b => {
      const day = new Date(b.startDate).toLocaleDateString("en-IN", {
        weekday: "short",
      });
      dailyUsage[day] = (dailyUsage[day] || 0) + (b.hours || 0);
    });

    res.json({
      success: true,
      data: {
        totalSpent,
        hoursBooked,
        spacePie: Object.entries(spaceDistribution).map(([name, value]) => ({
          name,
          value,
        })),
        branchPie: Object.entries(branchDistribution).map(([name, value]) => ({
          name,
          value,
        })),
        usageTrend: Object.entries(dailyUsage).map(([name, hours]) => ({
          name,
          hours,
        })),
      },
    });
  } catch (error) {
    console.error("User analytics error:", error);
    res.status(500).json({ message: "Analytics failed" });
  }
};


