import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookings as getUserBookings,
  getBookingById,
  deleteBooking,
  updateBooking,
  adminDeleteBooking,
  assignDriver,
} from "../controllers/bookingController.js";

import { protect, admin, roleGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

// ----------------- USER ROUTES -----------------
router.route("/my").get(protect, getUserBookings);
router.route("/").post(protect, createBooking);

// ----------------- ADMIN + STAFF ROUTES -----------------
router.route("/").get(protect, roleGuard("admin", "staff"), getAllBookings);
router
  .route("/:id")
  .put(protect, roleGuard("admin", "staff"), updateBooking)
  .delete(protect, admin, adminDeleteBooking); // delete: admin only

// Assign driver: admin + staff
router.put("/:id/assign", protect, roleGuard("admin", "staff"), assignDriver);

// ----------------- SHARED ROUTE -----------------
router.route("/:id").get(protect, getBookingById);

export default router;
