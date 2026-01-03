const Booking = require("../../models/common/Booking");
const Space = require("../../models/common/Space");
const User = require("../../models/user/User");
const { notifyAdmin } = require("../../utils/notify");

/* =========================
   USER: CREATE BOOKING
========================= */
exports.createBooking = async (req, res) => {
  try {
    console.log("payload", req.body);

    const { spaceId, fromDate, toDate, planType, notes } = req.body;

    const user = await User.findById(req.user.id);
    const space = await Space.findById(spaceId);

    if (!user || !space) {
      return res.status(404).json({ message: "User or Space not found" });
    }

    let start = new Date(fromDate);
    let end = new Date(toDate);
    let totalAmount = 0;

    /* =========================
       CONFERENCE ROOM RULES
    ========================= */
    if (space.type === "Conference") {
      // Enforce DAILY only
      if (planType !== "Daily") {
        return res.status(400).json({
          message: "Conference room can be booked only for Daily plan",
        });
      }

      // Force 1 PM - 2 PM
      start = new Date(`${start.toISOString().slice(0, 10)}T13:00:00`);
      end = new Date(`${start.toISOString().slice(0, 10)}T14:00:00`);

      // Prevent overlap
      const conflict = await Booking.findOne({
        spaceId,
        status: { $ne: "cancelled" },
        fromDate: { $lt: end },
        toDate: { $gt: start },
      });

      if (conflict) {
        return res.status(409).json({
          message: "Conference room already booked for this time",
        });
      }

      totalAmount = space.price; // 1 hour fixed
    }

    /* =========================
       CABIN / DESK LOGIC
    ========================= */
    else {
      if (!start || !end || start > end) {
        return res.status(400).json({ message: "Invalid date range" });
      }

      // Prevent overlap
      const conflict = await Booking.findOne({
        spaceId,
        status: { $ne: "cancelled" },
        fromDate: { $lt: end },
        toDate: { $gt: start },
      });

      if (conflict) {
        return res.status(409).json({
          message: "This space is already booked for selected dates",
        });
      }

      // Amount calculation
      if (planType === "Daily") {
        const days =
          Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        totalAmount = space.price * days;
      }

      if (planType === "Weekly") {
        const weeks =
          Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7)) || 1;
        totalAmount = space.price * weeks;
      }

      if (planType === "Monthly") {
        const months =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth()) +
          1;
        totalAmount = space.price * months;
      }
    }

    /* =========================
       CREATE BOOKING
    ========================= */
const booking = await Booking.create({
  userId: user._id,
  userName: user.name,
  userEmail: user.email,
  spaceId: space._id,
  fromDate: start,
  toDate: end,
  planType,
  totalAmount,
  notes,
  status: "pending",
});

/* ADMIN NOTIFICATION */
await notifyAdmin({
  title: "New Booking Request",
  message: `${user.name} booked ${space.name}`,  // ✅ FIX
  meta: { bookingId: booking._id },
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
