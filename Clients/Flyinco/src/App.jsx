import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./Components/PrivateRoute.jsx";

// Public Pages
import Home from "./Pages/User/Home.jsx";
import BookingForm from "./Pages/User/BookNow.jsx";
import AuthPage from "./Pages/User/authpage.jsx";
import ProfilePage from "./Pages/User/profile.jsx";
import Fleet from "./Pages/User/fleet.jsx";
import Services from "./Pages/User/Services.jsx";
import WhyChooseUsPage from "./Pages/User/Whychooseus.jsx";
import AboutUs from "./Pages/User/AboutUs.jsx";
import Contact from "./Pages/User/Contact.jsx";
import NotAuthorized from "./Pages/User/NotAuthorised.jsx";

// Admin Pages
import AdminLayout from "./components/admin/AdminLayout.jsx";
import Dashboard from "./Pages/admin/dashboard.jsx";
import Users from "./Pages/admin/user.jsx";
import Bookings from "./Pages/admin/Booking.jsx";
import Drivers from "./Pages/admin/Driver.jsx";

// Driver Pages
import DriverDashboard from "./Pages/Driver/Dashboard.jsx";

// Staff Pages
import StaffLayout from "./Pages/Staff/StaffLayout.jsx";
import StaffOverview from "./Pages/Staff/Overview.jsx";
import StaffBookings from "./Pages/Staff/Bookings.jsx";
import StaffInvoices from "./Pages/Staff/Invoices.jsx";
import StaffReports from "./Pages/Staff/Reports.jsx";

export default function App() {
  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/fleet" element={<Fleet />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />

      {/* ── Protected: any logged-in user ── */}
      <Route path="/book" element={<PrivateRoute><BookingForm /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

      {/* ── Protected: Admin only ── */}
      <Route path="/admin" element={<PrivateRoute roles={["admin"]}><AdminLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="drivers" element={<Drivers />} />
      </Route>

      {/* ── Protected: Staff only ── */}
      <Route path="/staff" element={<PrivateRoute roles={["staff", "admin"]}><StaffLayout /></PrivateRoute>}>
        <Route index element={<StaffOverview />} />
        <Route path="bookings" element={<StaffBookings />} />
        <Route path="invoices" element={<StaffInvoices />} />
        <Route path="reports" element={<StaffReports />} />
      </Route>

      {/* ── Protected: Driver only ── */}
      <Route path="/driver" element={<PrivateRoute roles={["driver"]}><DriverDashboard /></PrivateRoute>} />

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
