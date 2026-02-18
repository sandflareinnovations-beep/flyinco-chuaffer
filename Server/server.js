import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import bookingRoutes from "./routes/BookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/Errormiddleware.js";
import reportRoutes from "./routes/reports.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ---------- Root route ----------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ---------- API Routes ----------

// ✅ Mount reports FIRST so it takes priority over /:id
app.use("/api/bookings/report", reportRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// ---------- Error Handling ----------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
