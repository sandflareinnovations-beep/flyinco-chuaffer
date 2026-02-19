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

// ✅ Issue Invoice + Generate PDF (File System Strategy)
export const issueInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Mark as invoice issued
    if (!booking.invoiceIssued) {
      booking.invoiceIssued = true;
      await booking.save();
    }

    console.log("Generating invoice (filesystem) for:", booking._id);

    // Setup Temp File Path
    const idSuffix = booking._id.toString().slice(-4).toUpperCase();
    const invoiceId = `INV-${new Date().getFullYear()}-${idSuffix}`;
    const filename = `${invoiceId}.pdf`;
    const tempDir = path.join(__dirname, "../temp");

    // Ensure temp dir exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filePath = path.join(tempDir, filename);
    const writeStream = fs.createWriteStream(filePath);

    // Create PDF Document
    const doc = new PDFDocument({ margin: 50, bufferPages: true });

    // Pipe PDF to File Stream
    doc.pipe(writeStream);

    /** ---------------- PDF DESIGN CONTENT ---------------- **/

    // Logo Path - DISABLED TO DEBUG (User requirement: basic working invoice first)
    /*
    const logoPath = path.join(__dirname, "../assets/Flyinco.png");
    if (fs.existsSync(logoPath)) {
      try {
        doc.image(logoPath, 50, 45, { width: 150 });
      } catch (imgErr) {
        console.error("Error embedding logo:", imgErr);
      }
    }
    */

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

    const invoiceDate = new Date().toLocaleDateString();

    doc
      .fontSize(10)
      .fillColor("#666666")
      .text(`Invoice ID: ${invoiceId}`, 50, 185)
      .text(`Date: ${invoiceDate}`, 50, 200)
      .text(`Status: Paid`, 50, 215);

    // Bill To (Left)
    doc
      .fontSize(12)
      .fillColor("#333333")
      .text("Bill To:", 300, 160, { bold: true });

    // Safe Navigation
    const fullName = `${booking.firstName || ""} ${booking.lastName || ""}`.trim() || "Valued Customer";
    const email = booking.email || "";
    const phone = booking.contactNumber || booking.phone || "";

    doc
      .fontSize(10)
      .fillColor("#666666")
      .text(fullName, 300, 170)
      .text(email, 300, 185)
      .text(phone, 300, 200);

    // Trip Details Table Header
    const tableTop = 250;
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#333333")
      .text("Description", 50, tableTop)
      .text("Details", 200, tableTop)
      .text("Amount", 450, tableTop, { align: "right" });

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor("#aaaaaa").lineWidth(1).stroke();

    // Table Content
    let y = tableTop + 30;
    doc.font("Helvetica").fillColor("#000000"); // Reset font

    // Service
    const serviceType = (booking.service || "Chauffeur Service").toUpperCase();
    doc.text("Service Type", 50, y);
    doc.text(serviceType, 200, y);
    y += 20;

    // Vehicle
    const vehicleName = booking.vehicle || "Vehicle Assignment";
    const vehicleModel = booking.vehicleModel || "Standard";
    doc.text("Vehicle", 50, y);
    doc.text(`${vehicleName} (${vehicleModel})`, 200, y);
    y += 20;

    // Route
    const pickup = booking.pickupLocation || "Pickup";
    const drop = booking.dropLocation || "Dropoff";
    const routeText = `${pickup} -> ${drop}`;

    doc.text("Route", 50, y);
    doc.text(routeText, 200, y, { width: 250 });

    // Adjust y
    const routeHeight = doc.heightOfString(routeText, { width: 250 });
    y += routeHeight + 10;

    // Date/Time
    doc.text("Pickup Time", 50, y);
    const pDate = booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString() : "N/A";
    const pTime = booking.pickupTime || "N/A";
    doc.text(`${pDate} at ${pTime}`, 200, y);
    y += 20;

    // Enhancements
    if (booking.enhancements && Object.values(booking.enhancements).some(v => v)) {
      doc.text("Extras", 50, y);
      const extras = booking.addons?.join(", ") || "None";
      doc.text(extras, 200, y);
      y += 20;
    }

    doc.moveTo(50, y + 10).lineTo(550, y + 10).strokeColor("#cccccc").lineWidth(1).stroke();

    // Total
    y += 30;
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#000000")
      .text("Total Amount", 300, y)
      .text(`BHD ${booking.amount || 0}`, 450, y, { align: "right" });

    // Footer
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#999999")
      .text("Thank you for choosing Flyinco Chauffeur Service.", 50, 700, { align: "center", width: 500 });

    // Finalize PDF file
    doc.end();

    // Wait for file to fully write
    writeStream.on('finish', () => {
      // Send the file
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          if (!res.headersSent) {
            res.status(500).json({ message: "Could not send file." });
          }
        }
        // Cleanup: delete temp file
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
        });
      });
    });

    writeStream.on('error', (err) => {
      console.error("Error writing PDF stream:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Failed to write PDF file." });
      }
    });

  } catch (error) {
    console.error("Error generating invoice:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate invoice PDF. " + (error.message || "Unknown Error") });
    }
  }
};
