import React, { useMemo, useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ClipboardList } from "lucide-react";

import { COUNTRY_CODES, SERVICES, VEHICLES, ADDONS } from "./Booking/Constants";
import { validateBooking } from "./Booking/Validation";
import api from "../../lib/api"; // ✅ axios instance

import PersonalDetails from "./Booking/PersonalDetails";
import TripDetails from "./Booking/TripDetails";
import VehicleSection from "./Booking/VehicleSection";
import Enhancements from "./Booking/Enhancement";
import Review from "./Booking/Review";
import BookingSuccess from "./BookingSuccess"; // ✅ Import Success Component

export default function BookingForm() {
  const refs = {
    guest: useRef(null),
    trip: useRef(null),
    party: useRef(null),
    vehicle: useRef(null),
    extras: useRef(null),
    review: useRef(null),
  };

  const [data, setData] = useState({
    // guest
    firstName: "",
    lastName: "",
    email: "",
    countryCode: COUNTRY_CODES[0].value,
    contactNumber: "",

    // trip
    service: "",
    tripType: "arrival",
    flightNumber: "",
    pickupLocation: "",
    dropLocation: "",
    pickupDate: "",
    pickupTime: "",
    dropDate: "",
    stops: [],

    // party
    passengers: "",
    luggage: "",

    // vehicle
    vehicle: "",
    vehicleModel: "none",

    // extras
    addons: [],
    notes: "",
  });

  const isAirport = data.service === "airport";
  const [errors, setErrors] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false); // ✅ Success State

  function update(field, value) {
    setData((d) => {
      if (field === "vehicle") return { ...d, vehicle: value, vehicleModel: "none" };
      return { ...d, [field]: value };
    });
  }

  function toggleAddon(value) {
    setData((d) => {
      const exists = d.addons.includes(value);
      return {
        ...d,
        addons: exists ? d.addons.filter((v) => v !== value) : [...d.addons, value],
      };
    });
  }

  const completion = useMemo(() => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "contactNumber",
      "service",
      "pickupLocation",
      "dropLocation",
      "pickupDate",
      "pickupTime",
      "passengers",
      "luggage",
      "vehicle",
    ];
    const extraAirport = isAirport ? ["tripType", "flightNumber"] : [];
    const all = [...required, ...extraAirport];

    const filled = all.filter((k) => {
      const val = (data[k] ?? "").toString().trim();
      return val !== "" && val !== "0";
    }).length;

    return Math.round((filled / all.length) * 100);
  }, [data, isAirport]);

  const [progressWidth, setProgressWidth] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setProgressWidth(completion));
    return () => cancelAnimationFrame(id);
  }, [completion]);

  function scrollTo(refName) {
    const el = refs[refName]?.current;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleShowReview(e) {
    e.preventDefault();
    const v = validateBooking(data);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      setShowReview(false);
      const keyToSection = {
        firstName: "guest",
        lastName: "guest",
        email: "guest",
        contactNumber: "guest",
        service: "trip",
        tripType: "trip",
        flightNumber: "trip",
        pickupLocation: "trip",
        dropLocation: "trip",
        pickupDate: "trip",
        pickupTime: "trip",
        passengers: "party",
        luggage: "party",
        vehicle: "vehicle",
      };
      const firstErrKey = Object.keys(v)[0];
      scrollTo(keyToSection[firstErrKey] || "guest");
      return;
    }
    setShowReview(true);
    setTimeout(() => scrollTo("review"), 100);
  }

  function resetAll() {
    setData({
      firstName: "",
      lastName: "",
      email: "",
      countryCode: COUNTRY_CODES[0].value,
      contactNumber: "",
      service: "",
      tripType: "arrival",
      flightNumber: "",
      pickupLocation: "",
      dropLocation: "",
      pickupDate: "",
      pickupTime: "",
      dropDate: "",
      stops: [],
      passengers: "",
      luggage: "",
      vehicle: "",
      vehicleModel: "none",
      addons: [],
      notes: "",
    });
    setErrors({});
    setShowReview(false);
  }

  // ✅ Real API submit
  async function handleFinalSubmit() {
    setSubmitting(true);
    try {
      const res = await api.post("/bookings", data);

      // ✅ Instead of alert, show success screen
      console.log("Saved booking:", res.data);
      setSuccess(true);
      setShowReview(false);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit booking: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  }

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.value === data.countryCode) || COUNTRY_CODES[0];
  const selectedVehicleObj = VEHICLES.find((v) => v.value === data.vehicle);

  // ✅ Render Success Screen if successful
  if (success) {
    return <BookingSuccess onReset={() => { setSuccess(false); resetAll(); }} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8">
      <Card className="shadow-2xl border border-white/10 bg-white/5 backdrop-blur">
        <CardContent className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <ClipboardList className="w-6 h-6 text-white/90" />
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
              Reserve Your Journey
            </h1>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-6">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out animate-pulse"
              style={{
                width: `${progressWidth}%`,
                background:
                  "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6, #f59e0b)",
              }}
              aria-label="completion-progress"
            />
          </div>

          <form onSubmit={handleShowReview} className="space-y-8">
            <PersonalDetails
              sectionRef={refs.guest}
              data={data}
              errors={errors}
              update={update}
              COUNTRY_CODES={COUNTRY_CODES}
            />

            <Separator className="bg-white/10" />

            <TripDetails
              sectionRef={refs.trip}
              data={data}
              errors={errors}
              update={update}
              SERVICES={SERVICES}
            />

            <Separator className="bg-white/10" />
            <VehicleSection
              sectionRef={refs.vehicle}
              data={data}
              errors={errors}
              update={update}
              VEHICLES={VEHICLES}
            />

            <Separator className="bg-white/10" />

            <Enhancements
              sectionRef={refs.extras}
              data={data}
              update={update}
              toggleAddon={toggleAddon}
              ADDONS={ADDONS}
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetAll}
                className="border-white/30 text-black hover:bg-[#4b0082]"
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="bg-white text-black hover:bg-[#4b0082] hover:text-white"
              >
                Review & Confirm
              </Button>
            </div>
          </form>

          {/* Inline Review */}
          {showReview && (
            <Review
              sectionRef={refs.review}
              data={data}
              SERVICES={SERVICES}
              ADDONS={ADDONS}
              selectedCountry={selectedCountry}
              selectedVehicleObj={selectedVehicleObj}
              onEdit={(section) => scrollTo(section)}
              onConfirm={handleFinalSubmit} // ✅ now real API call
            />
          )}

          {submitting && (
            <p className="text-sm text-white/70 mt-4">Submitting...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
