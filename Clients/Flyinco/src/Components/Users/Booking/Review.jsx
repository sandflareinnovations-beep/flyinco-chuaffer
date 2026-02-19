import React from "react";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { Pencil, Check } from "lucide-react";

export default function Review({
  sectionRef,
  data,
  SERVICES,
  ADDONS,
  selectedCountry,
  selectedVehicleObj,
  onEdit,
  onConfirm,
}) {
  const isAirport = data.service === "airport";

  return (
    <>
      <Separator className="bg-white/10 my-8" />
      <section ref={sectionRef} className="space-y-6">
        <h3 className="text-white/90 font-semibold text-xl flex items-center gap-2">
          <Check className="w-5 h-5" /> Review Your Details
        </h3>

        {/* Guest Summary */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 font-medium">Your Details</p>
            <Button
              size="sm"
              type="button"
              onClick={() => onEdit("guest")}
              className="border border-white/30 bg-white text-black hover:bg-[#4b0082] hover:text-white"
            >
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </Button>
          </div>
          <ul className="text-white/80 text-sm space-y-1">
            <li>
              Name:{" "}
              <span className="text-white">
                {data.firstName} {data.lastName}
              </span>
            </li>
            <li>
              Email: <span className="text-white">{data.email}</span>
            </li>
            <li>
              Phone:{" "}
              <span className="text-white">
                {data.countryCode} {data.contactNumber}
              </span>
            </li>
          </ul>
        </div>

        {/* Trip Summary */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 font-medium">Trip Details</p>
            <Button
              size="sm"
              type="button"
              onClick={() => onEdit("trip")}
              className="border border-white/30 bg-white text-black hover:bg-[#4b0082] hover:text-white"
            >
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </Button>
          </div>
          <ul className="text-white/80 text-sm space-y-1">
            <li>
              Service:{" "}
              <span className="text-white">
                {SERVICES.find((s) => s.value === data.service)?.label || "-"}
              </span>
            </li>
            {isAirport && (
              <>
                <li>
                  Airport Trip:{" "}
                  <span className="text-white capitalize">{data.tripType}</span>
                </li>
                <li>
                  Flight No.:{" "}
                  <span className="text-white">{data.flightNumber}</span>
                </li>
              </>
            )}
            <li>
              Pickup: <span className="text-white">{data.pickupLocation}</span>
            </li>
            <li>
              Drop: <span className="text-white">{data.dropLocation}</span>
            </li>
            <li>
              Pickup Date & Time:{" "}
              <span className="text-white">
                {data.pickupDate || "-"} {data.pickupTime || ""}
              </span>
            </li>
            {data.dropDate && (
              <li>
                Drop Date: <span className="text-white">{data.dropDate}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Guests & Luggage Summary */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 font-medium">Guests & Luggage</p>
            <Button
              size="sm"
              type="button"
              onClick={() => onEdit("party")}
              className="border border-white/30 bg-white text-black hover:bg-[#4b0082] hover:text-white"
            >
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </Button>
          </div>
          <ul className="text-white/80 text-sm space-y-1">
            <li>
              Passengers:{" "}
              <span className="text-white">{data.passengers || "-"}</span>
            </li>
            <li>
              Luggage:{" "}
              <span className="text-white">{data.luggage || "-"}</span>
            </li>
          </ul>
        </div>

        {/* Vehicle Summary */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 font-medium">Vehicle</p>
            <Button
              size="sm"
              type="button"
              onClick={() => onEdit("vehicle")}
              className="border border-white/30 bg-white text-black hover:bg-[#4b0082] hover:text-white"
            >
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </Button>
          </div>
          <ul className="text-white/80 text-sm space-y-1">
            <li>
              Category:{" "}
              <span className="text-white">
                {selectedVehicleObj ? selectedVehicleObj.label : "-"}
              </span>
            </li>
            <li>
              Specific Vehicle:{" "}
              <span className="text-white">
                {data.vehicleModel && data.vehicleModel !== "none"
                  ? data.vehicleModel
                  : "No preference"}
              </span>
            </li>
          </ul>
        </div>

        {/* Enhancements Summary */}
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 font-medium">Enhancements</p>
            <Button
              size="sm"
              type="button"
              onClick={() => onEdit("extras")}
              className="border border-white/30 bg-white text-black hover:bg-[#4b0082] hover:text-white"
            >
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </Button>
          </div>
          <ul className="text-white/80 text-sm space-y-1">
            <li>
              Add-ons:{" "}
              <span className="text-white">
                {data.addons.length
                  ? data.addons
                    .map((v) => ADDONS.find((a) => a.value === v)?.label)
                    .filter(Boolean)
                    .join(", ")
                  : "—"}
              </span>
            </li>
            {data.notes?.trim() && (
              <li>
                Notes: <span className="text-white">{data.notes}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Confirm */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            onClick={() => onEdit("guest")}
            className="border border-white/30 bg-white text-black hover:bg-[#4b0082] hover:text-white"
          >
            Make Changes
          </Button>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm();
            }}
            className="bg-white text-black hover:bg-[#4b0082] hover:text-white"
          >
            Confirm Booking
          </Button>
        </div>
      </section>
    </>
  );
}
