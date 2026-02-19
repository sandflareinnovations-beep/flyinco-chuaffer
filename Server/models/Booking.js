// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // --- Link to User (who booked) ---
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --- Customer Details ---
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    countryCode: { type: String, default: "+971" },
    contactNumber: { type: String, required: true }, // phone number

    // --- Trip Details ---
    service: { type: String, required: true }, // airport, hotel, chauffeur, etc.
    tripType: { type: String, enum: ["arrival", "departure"] }, // for airport
    flightNumber: { type: String }, // optional

    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    stops: [{ type: String }], // optional intermediate stops

    pickupDate: { type: Date, required: true },
    pickupTime: { type: String, required: true },
    dropDate: { type: Date },

    // --- Party Details ---
    passengers: { type: Number, default: 1 },
    luggage: { type: Number, default: 0 },

    // --- Vehicle ---
    vehicle: { type: String, required: true }, // e.g. SUV, Sedan
    vehicleModel: { type: String, default: "none" },

    // --- Enhancements / Addons ---
    addons: [{ type: String }], // ["wifi", "child_seat", "extra_luggage"]

    // --- Notes / Preferences ---
    notes: { type: String },

    // --- Driver Assignment ---
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ changed from "Driver" to "User"
      default: null,
    },

    // --- Status & Billing ---
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    amount: { type: Number, default: 0 },
    invoiceIssued: { type: Boolean, default: false }, // NEW
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
