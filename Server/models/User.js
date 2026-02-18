// models/UserSchema.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },

    // --- Secure Password ---
    password: { type: String, required: true },

    // --- Role (default: customer) ---
    role: {
      type: String,
      enum: ["customer", "admin", "driver", "staff"],
      default: "customer",
    },

    // --- Driver-specific fields ---
    vehicle: {
      type: String, // e.g., Toyota Fortuner
    },
    vehicleType: {
      type: String, // Sedan, SUV, Minibus, Coach
      enum: ["Sedan", "SUV", "Minibus", "Coach"],
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔑 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare entered password with hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
