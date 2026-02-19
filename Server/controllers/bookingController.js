import Booking from "../models/Booking.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// ✅ Issue Invoice (just updates flag and returns updated booking)
// ✅ Issue Invoice + Generate PDF
export const issueInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Mark as invoice issued
    booking.invoiceIssued = true;
    await booking.save();

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    // Set headers
    const invoiceId = `INV-${new Date().getFullYear()}-${booking._id.toString().slice(-4).toUpperCase()}`;
    const filename = `${invoiceId}.pdf`;

    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    /** ---------------- PDF DESIGN ---------------- **/

    // Logo Path
    const logoPath = path.join(__dirname, "../assets/Flyinco.png");

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 150 });
    }

    // Company Info (Right Aligned)
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("FLYINCO TRAVEL AND TOURISM W.L.L", 200, 50, { align: "right" })
      .font("Helvetica")
      .text("CR No: 167235-1", 200, 65, { align: "right" })
      .text("VAT Account No: 220021727100002", 200, 80, { align: "right" })
      .text("VAT Reg Date: 26/12/2023", 200, 95, { align: "right" })
      .text("Building 227A, Road 318", 200, 110, { align: "right" })
      .text("Block 308, Manama / Alqudaybiyah, Bahrain", 200, 125, { align: "right" })
      .moveDown();

    // Divider
    doc.moveDown();
    doc.moveTo(50, 140).lineTo(550, 140).strokeColor("#cccccc").lineWidth(1).stroke();

    // Invoice Title & ID
    doc
      .fontSize(20)
      .fillColor("#333333")
      .text("TAX INVOICE", 50, 160);

    doc
      .fontSize(10)
      .fillColor("#666666")
      .text(`Invoice ID: ${invoiceId}`, 50, 185)
      .text(`Date: ${new Date().toLocaleDateString()}`, 50, 200)
      .text(`Status: Paid`, 50, 215); // Assuming paid if invoiced, or use booking.status

    // Bill To (Left)
    doc
      .fontSize(12)
      .fillColor("#333333")
      .text("Bill To:", 300, 160, { bold: true });

    doc
      .fontSize(10)
      .fillColor("#666666")
      .text(`${booking.firstName} ${booking.lastName}`, 300, 170)
      .text(booking.email, 300, 185)
      .text(booking.contactNumber || booking.phone, 300, 200);

    // Trip Details Table Header
    const tableTop = 250;
    doc
      .fontSize(10)
      .fillColor("#333333")
      .text("Description", 50, tableTop, { bold: true })
      .text("Details", 200, tableTop, { bold: true })
      .text("Amount", 450, tableTop, { align: "right", bold: true });

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table Content
    let y = tableTop + 30;

    // Service
    doc.text("Service Type", 50, y);
    doc.text(booking.service.toUpperCase(), 200, y);
    y += 20;

    // Vehicle
    doc.text("Vehicle", 50, y);
    doc.text(`${booking.vehicle} (${booking.vehicleModel || "Standard"})`, 200, y);
    y += 20;

    // Route
    doc.text("Route", 50, y);
    doc.text(`${booking.pickupLocation} -> ${booking.dropLocation}`, 200, y, { width: 250 });
    // Adjust y for potentially long route text
    const routeHeight = doc.heightOfString(`${booking.pickupLocation} -> ${booking.dropLocation}`, { width: 250 });
    y += routeHeight + 10;

    // Date/Time
    doc.text("Pickup Time", 50, y);
    doc.text(`${new Date(booking.pickupDate).toLocaleDateString()} at ${booking.pickupTime}`, 200, y);
    y += 20;

    // Enhancements
    if (booking.enhancements && Object.values(booking.enhancements).some(v => v)) {
      doc.text("Extras", 50, y);
      const extras = booking.addons?.join(", ") || "None"; // simplistic view
      doc.text(extras, 200, y);
      y += 20;
    }

    doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();

    // Total
    y += 30;
    doc
      .fontSize(14)
      .fillColor("#000000")
      .text("Total Amount", 300, y, { bold: true })
      .text(`BHD ${booking.amount || 0}`, 450, y, { align: "right", bold: true });

    // Footer
    doc
      .fontSize(10)
      .fillColor("#999999")
      .text("Thank you for your business.", 50, 700, { align: "center", width: 500 });

    doc.end();

  } catch (error) {
    console.error("Error generating invoice:", error);
    // If headers already sent (due to pipe), can't send JSON error easily, but try:
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};
