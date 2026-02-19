// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
  User,
  Mail,
  Phone,
  Camera,
  LogOut,
  ArrowLeft,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import api from "../../lib/api";
import Footer from "../../Components/Users/Footer";
import BookingList from "../../Components/Users/BookingProfile"; // ✅ Import BookingList
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: profileData } = await api.get("/auth/profile");
        setProfile(profileData);

        const { data: bookingsData } = await api.get("/bookings/my");
        setBookings(bookingsData);
      } catch (err) {
        console.error("Profile/Bookings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-indigo-300">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center text-red-400">
        Failed to load profile.
      </div>
    );
  }

  const completed = bookings.filter((b) => b.status === "completed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* --- Top Bar --- */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gray-900/60 backdrop-blur-lg">
        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-300 hover:text-indigo-300 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Title */}
        <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
          My Profile
        </h1>

        {/* Help */}
        <button
          onClick={() => setHelpOpen(true)}
          className="flex items-center gap-2 text-gray-300 hover:text-indigo-300 transition"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </button>
      </div>

      {/* --- Main Content --- */}
      <motion.div
        className="container mx-auto px-6 mt-10 relative z-10 space-y-10 flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* --- Profile Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
        >
          <Card className="p-8 rounded-2xl shadow-xl bg-gray-900/80 backdrop-blur-lg border border-indigo-500/20">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Avatar */}
              <div className="relative w-32 h-32">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="User Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500/50 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-5xl font-bold text-white shadow-lg">
                    {profile.firstName?.[0]}
                  </div>
                )}
                <button className="absolute bottom-2 right-2 bg-gray-800/80 p-2 rounded-full hover:bg-indigo-600 transition">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-indigo-400" />
                    <span>
                      {profile.firstName} {profile.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-indigo-400" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-indigo-400" />
                    <span>{profile.phone}</span>
                  </div>
                </div>

                {/* Driver-only fields */}
                {profile.role === "driver" && (
                  <div className="mt-6 space-y-2 text-sm">
                    <p>
                      <span className="font-semibold text-indigo-300">
                        Vehicle:
                      </span>{" "}
                      {profile.vehicle || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-indigo-300">
                        Type:
                      </span>{" "}
                      {profile.vehicleType || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-indigo-300">
                        Availability:
                      </span>{" "}
                      {profile.availability ? "✅ Available" : "❌ Unavailable"}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 mt-8">
                  <Button
                    className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white shadow-lg"
                    onClick={() => alert("Edit profile coming soon")}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/20"
                    onClick={() => {
                      localStorage.removeItem("userInfo");
                      window.location.href = "/";
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 text-center">
                  <div className="p-4 rounded-xl bg-gray-800/50 border border-indigo-500/20">
                    <p className="text-2xl font-bold text-indigo-300">
                      {bookings.length}
                    </p>
                    <p className="text-gray-400 text-sm">Total Bookings</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-800/50 border border-indigo-500/20">
                    <p className="text-2xl font-bold text-green-300">
                      {completed}
                    </p>
                    <p className="text-gray-400 text-sm">Completed</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-800/50 border border-indigo-500/20">
                    <p className="text-2xl font-bold text-yellow-300">
                      {pending}
                    </p>
                    <p className="text-gray-400 text-sm">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* --- Bookings Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        >
          <BookingList bookings={bookings} /> {/* ✅ Use BookingList component */}
        </motion.div>
      </motion.div>

      {/* --- Footer --- */}
      <Footer />

      {/* Help Dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="bg-gray-900/90 text-white border border-indigo-500/20 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Need Help?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-gray-300">
            <p>
              <span className="font-semibold text-indigo-300">Phone:</span>{" "}
              <a href="tel:+97333692021" className="hover:underline">
                +973 33692021
              </a>{" "}
              /{" "}
              <a href="tel:+97335016007" className="hover:underline">
                +973 35016007
              </a>
            </p>
            <p>
              <span className="font-semibold text-indigo-300">Email:</span>{" "}
              <a href="mailto:limo@flyinco.com" className="hover:underline">
                limo@flyinco.com
              </a>
            </p>
          </div>
          <DialogFooter>
            <Button
              className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white"
              onClick={() => setHelpOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
