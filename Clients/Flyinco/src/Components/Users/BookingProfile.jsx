// src/Components/Users/BookingList.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/Components/ui/card";
import { MapPin, Calendar, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

// Mapping for service labels
const SERVICE_LABELS = {
  airport: "Airport Service",
  hotel: "Hotel Transfer Service",
  chauffeur: "Chauffeur Service",
  corporate: "Corporate Transportation Service",
  event: "Event Transportation",
  group: "Group Transportation",
};

// ✅ Utility: Capitalize each word properly
const formatLabel = (text = "") =>
  text
    .split(" ")
    .map((word) => {
      if (word.length <= 3) return word.toUpperCase(); // e.g. SUV
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");

export default function BookingList({ bookings }) {
  const [selectedBooking, setSelectedBooking] = useState(null);

  return (
    <Card className="p-8 rounded-2xl shadow-xl bg-gray-900/70 backdrop-blur-lg border border-indigo-500/20">
      <h3 className="text-2xl font-bold mb-10 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        Recent Bookings
      </h3>

      {bookings.length > 0 ? (
        <div className="relative border-l-2 border-indigo-500/30 ml-4 pl-6 space-y-10">
          {bookings.map((booking, index) => {
            const rawService = booking.service?.toLowerCase();
            const serviceLabel =
              SERVICE_LABELS[rawService] ||
              formatLabel(booking.service || "Service");

            const vehicleFormatted = booking.vehicle
              ? formatLabel(booking.vehicle)
              : null;
            const vehicleModelFormatted = booking.vehicleModel
              ? formatLabel(booking.vehicleModel)
              : null;

            return (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[33px] top-2 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs text-white shadow-lg">
                  {index + 1}
                </div>

                {/* Booking Card */}
                <div className="relative p-6 rounded-xl bg-gray-800/60 border border-indigo-500/20 shadow-md hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-indigo-300">
                        {serviceLabel}
                      </h4>
                      {vehicleFormatted && (
                        <p className="text-sm text-gray-400">
                          Vehicle:{" "}
                          <span className="text-indigo-200 font-medium">
                            {vehicleFormatted}
                            {vehicleModelFormatted &&
                              ` (${vehicleModelFormatted})`}
                          </span>
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${booking.status === "completed"
                          ? "bg-green-500/20 text-green-300"
                          : booking.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                    >
                      {booking.status || "New"}
                    </span>
                  </div>

                  {/* Trip Info */}
                  <div className="space-y-2 text-sm text-gray-300">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      {booking.pickupDate
                        ? new Date(booking.pickupDate).toLocaleDateString()
                        : "N/A"}
                      {booking.pickupTime && (
                        <span className="ml-2 flex items-center gap-1">
                          <Clock className="w-4 h-4 text-indigo-400" />
                          {booking.pickupTime}
                        </span>
                      )}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="font-medium text-gray-200">Pickup:</span>{" "}
                      {booking.pickupLocation || "N/A"}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-400" />
                      <span className="font-medium text-gray-200">Dropoff:</span>{" "}
                      {booking.dropLocation || "N/A"}
                    </p>
                  </div>

                  {/* View Details button */}
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/20 text-sm"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      View Details
                    </Button>
                  </div>

                  {/* ✅ Disclaimer (always visible under each card) */}
                  <div className="mt-6 text-xs text-gray-400 border-t border-white/10 pt-3 leading-relaxed">
                    <p>
                      For cancellations or booking changes, please contact our{" "}
                      <span className="text-indigo-300 font-medium">
                        helpline
                      </span>{" "}
                      at{" "}
                      <a
                        href="tel:+97333692021"
                        className="text-indigo-400 hover:underline"
                      >
                        +973 33692021
                      </a>{" "}
                      /{" "}
                      <a
                        href="tel:+97335016007"
                        className="text-indigo-400 hover:underline"
                      >
                        +973 35016007
                      </a>{" "}
                      or email us at{" "}
                      <a
                        href="mailto:limo@flyinco.com"
                        className="text-indigo-400 hover:underline"
                      >
                        limo@flyinco.com
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400">No bookings found.</p>
      )}

      {/* --- Booking Details Dialog --- */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={(open) => {
          if (!open) setSelectedBooking(null);
        }}
      >
        <DialogContent className="bg-gray-900/95 text-white border border-indigo-500/30 rounded-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Booking Details
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detailed information about your selected booking.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-300 mt-4">
              {/* Left Column */}
              <div>
                <p className="mb-3">
                  <span className="font-semibold text-indigo-300">Service:</span>{" "}
                  {SERVICE_LABELS[selectedBooking.service?.toLowerCase()] ||
                    formatLabel(selectedBooking.service)}
                </p>
                <p>
                  <span className="font-semibold text-indigo-300">Date:</span>{" "}
                  {selectedBooking.pickupDate
                    ? new Date(selectedBooking.pickupDate).toLocaleDateString()
                    : "N/A"}{" "}
                  {selectedBooking.pickupTime && (
                    <span>({selectedBooking.pickupTime})</span>
                  )}
                </p>
                <p>
                  <span className="font-semibold text-indigo-300">Pickup:</span>{" "}
                  {selectedBooking.pickupLocation}
                </p>
                <p>
                  <span className="font-semibold text-indigo-300">Dropoff:</span>{" "}
                  {selectedBooking.dropLocation}
                </p>
              </div>

              {/* Right Column */}
              <div>
                <p>
                  <span className="font-semibold text-indigo-300">Passengers:</span>{" "}
                  {selectedBooking.passengers || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-indigo-300">Luggage:</span>{" "}
                  {selectedBooking.luggage || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-indigo-300">Vehicle:</span>{" "}
                  {selectedBooking.vehicle
                    ? formatLabel(selectedBooking.vehicle)
                    : "N/A"}{" "}
                  {selectedBooking.vehicleModel &&
                    `(${formatLabel(selectedBooking.vehicleModel)})`}
                </p>
                <p>
                  <span className="font-semibold text-indigo-300">Notes:</span>{" "}
                  {selectedBooking.notes || "None"}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white"
              onClick={() => setSelectedBooking(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
