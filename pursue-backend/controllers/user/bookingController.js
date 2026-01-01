const Booking = require("../../models/common/Booking");
const Space = require("../../models/common/Space");
const User = require("../../models/user/User");

/* =========================
   USER: CREATE BOOKING
========================= */
exports.createBooking = async (req, res) => {
  try {
    console.log("payload",req.body)
    const { spaceId, fromDate, toDate, planType, notes } = req.body;

    const user = await User.findById(req.user.id);
    const space = await Space.findById(spaceId);

    if (!user || !space) {
      return res.status(404).json({ message: "User or Space not found" });
    }

    /* 🔢 Calculate amount (basic example) */
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth()) +
      1;

    const totalAmount = space.price * months;

    const booking = await Booking.create({
      userId: user._id,
      userName: user.name,           // ✅ FIX
      userEmail: user.email,         // ✅ FIX
      spaceId: space._id,
      fromDate,
      toDate,
      planType,
      totalAmount,                   // ✅ FIX
      notes,
      status: "pending",
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    console.error("Create Booking Error:", err);
    res.status(500).json({ message: "Booking failed" });
  }
};


/* =========================
   USER: MY BOOKINGS
========================= */
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("spaceId", "name type")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   USER: UPDATE BOOKING
========================= */
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: "pending",
      },
      req.body,
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Cannot update booking" });
    }

    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
};

/* =========================
   USER: DELETE BOOKING
========================= */
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
      status: "pending",
    });

    if (!booking) {
      return res.status(404).json({ message: "Cannot delete booking" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
