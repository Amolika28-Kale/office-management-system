const Booking = require("../../models/common/Booking");
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
