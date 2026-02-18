// routes/authRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  getDrivers,
  updateUser,
  deleteUser,
} from "../controllers/authController.js";

import { getDashboardStats } from "../controllers/statsController.js";
import { protect, admin, roleGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

// ---------- Public routes ----------
router.post("/register", registerUser);
router.post("/login", loginUser);

// ---------- Protected routes ----------
router.get("/profile", protect, getUserProfile);
router.get("/users", protect, admin, getAllUsers);
router.get("/drivers", protect, roleGuard("admin", "staff"), getDrivers);

// ✅ Admin CRUD
router.put("/users/:id", protect, admin, updateUser);
router.delete("/users/:id", protect, admin, deleteUser);

// ---------- Admin Stats Route ----------
router.get("/stats", protect, admin, getDashboardStats);

export default router;
