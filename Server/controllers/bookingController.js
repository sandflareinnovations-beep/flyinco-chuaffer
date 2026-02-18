import Booking from "../models/Booking.js";

// ----------------- USER CONTROLLERS -----------------

// ✅ Create new booking (user comes from token)
export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      user: req.user._id,
      ...req.body,
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get all bookings for logged-in user
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("assignedDriver") // ✅ populate driver for user’s bookings
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single booking by ID (only if belongs to user)
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("assignedDriver");

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (
      req.user.role !== "admin" &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete booking (only if belongs to user)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (
      req.user.role !== "admin" &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------- ADMIN CONTROLLERS -----------------

// ✅ Get ALL bookings (admin only)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "firstName lastName email")
      .populate("assignedDriver"); // ✅ populate driver for admin
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update booking (admin can edit any booking)
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    Object.assign(booking, req.body);
    await booking.save();

    res.json(await booking.populate("assignedDriver"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete booking (admin can delete any booking)
export const adminDeleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.deleteOne();
    res.json({ message: "Booking removed by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Assign driver to booking (admin only)
export const assignDriver = async (req, res) => {
  try {
    const { driverId, amount } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { assignedDriver: driverId, amount },
      { new: true }
    ).populate("assignedDriver");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
