// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/mailer.js";

// 🔑 Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ✅ Register User (Customer, Admin, Driver)
export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      vehicle,
      vehicleType,
      availability,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Default role is customer unless specified
    const userRole =
      role && ["customer", "admin", "driver", "staff"].includes(role)
        ? role
        : "customer";

    // Create new user (with driver fields if role === driver)
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: userRole,
      vehicle: userRole === "driver" ? vehicle : undefined,
      vehicleType: userRole === "driver" ? vehicleType : undefined,
      availability:
        userRole === "driver" ? availability ?? true : undefined,
    });

    if (user) {
      // Send welcome email
      try {
        await sendEmail(
          user.email,
          "Welcome to Flyinco Limo 🚘",
          `Hi ${user.firstName},\n\nWelcome to Flyinco! Your account has been created successfully.`,
          `<h2>Hi ${user.firstName},</h2>
           <p>Welcome to <b>Flyinco Limo</b>! 🚘<br/>We’re excited to have you on board.</p>`
        );
      } catch (mailErr) {
        console.warn("⚠️ Failed to send welcome email:", mailErr.message);
      }

      res.status(201).json({
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        vehicle: user.vehicle || null,
        vehicleType: user.vehicleType || null,
        availability: user.availability ?? null,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        vehicle: user.vehicle || null,
        vehicleType: user.vehicleType || null,
        availability: user.availability ?? null,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get logged-in user's profile
export const getUserProfile = async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      vehicle: req.user.vehicle || null,
      vehicleType: req.user.vehicleType || null,
      availability: req.user.availability ?? null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin: Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin: Get all drivers
export const getDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: "driver" }).select("-password");
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin: Update user (supports driver fields)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;

    if (user.role === "driver") {
      user.vehicle = req.body.vehicle || user.vehicle;
      user.vehicleType = req.body.vehicleType || user.vehicleType;
      if (req.body.availability !== undefined)
        user.availability = req.body.availability;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updated = await user.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin: Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
