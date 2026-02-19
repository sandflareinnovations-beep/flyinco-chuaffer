import React from "react";
import BookingForm from "../../Components/Users/BookingForm";
import Navbar from "../../Components/Users/Navbar";
import Footer from "../../Components/Users/Footer"; // ✅ import footer

export default function BookNow() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-indigo-950 flex flex-col">
      {/* Navbar stays at the top */}
      <Navbar />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-5xl w-full">
          {/* Page Heading */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
              Book Your Luxury Ride
            </h1>
            <p className="mt-3 text-lg text-gray-300">
              Seamless, comfortable, and reliable chauffeur services tailored for you.
            </p>
          </div>

          {/* Booking Form directly */}
          <BookingForm />
        </div>
      </div>

      {/* Footer stays at bottom */}
      <Footer />
    </div>
  );
}
