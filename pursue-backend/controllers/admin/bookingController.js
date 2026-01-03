const Booking = require("../../models/common/Booking");
const { notifyUser } = require("../../utils/notify");

/**
 * CREATE BOOKING (Admin)
 */
exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL BOOKINGS (Pagination + Filters)
 */
exports.getAllBookings = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 50;

    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("spaceId", "name type")
      .lean();

    const formatted = bookings.map((b) => ({
      ...b,
      space: b.spaceId,          // ✅ map for frontend
      startDate: b.fromDate,     // ✅ alias
      endDate: b.toDate,         // ✅ alias
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    console.error("Admin Bookings Error:", err);
    res.status(500).json({ message: "Failed to load bookings" });
  }
};


/**
 * GET SINGLE BOOKING
 */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("spaceId", "name type pricePerDay");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get Booking By ID Error:", error);
    res.status(500).json({ message: error.message });
  }
};


/**
 * UPDATE BOOKING STATUS
 */

exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id);

  booking.status = status;
  await booking.save();

  if (status === "approved") {
    await notifyUser({
      userId: booking.user,
      title: "Booking Approved",
      message: "Your booking has been approved",
      meta: { bookingId: booking._id },
    });
  }

  if (status === "rejected") {
    await notifyUser({
      userId: booking.user,
      title: "Booking Rejected",
      message: "Your booking was rejected",
      meta: { bookingId: booking._id },
    });
  }

  res.json({ success: true });
};



/**
 * CANCEL BOOKING
 */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
