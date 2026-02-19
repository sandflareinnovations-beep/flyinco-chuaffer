// src/pages/Fleet.jsx
import React from "react";
import { motion } from "framer-motion";
import { Users, Luggage } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Link } from "react-router-dom";

// Navbar & Footer
import Navbar from "../../Components/Users/Navbar";
import Footer from "../../Components/Users/Footer";

// Car Images
import yukon from "../../assets/Cars/yukon.jpeg";
import tahoe from "../../assets/Cars/Cheverolet tahoe.jpg";
import Taurus from "../../assets/Cars/Ford Taurus.jpg";
import Territory from "../../assets/Cars/Ford Territory.jpg";
import bus from "../../assets/Cars/Mercedees bus.jpg";
import S_class from "../../assets/Cars/Mercedees S class front.jpg";
import sprinter from "../../assets/Cars/Mercedees sprinter.jpg";
import vito from "../../assets/Cars/Mercedees Vito 9.jpg";
import Bmw from "../../assets/Cars/BMW 7.jpg";

// ✅ Vehicle data (luxury descriptions + passengers excluding driver)
const vehicles = [
  {
    id: "gmc-yukon",
    name: "GMC Yukon",
    description:
      "Command the road in the GMC Yukon — a full-size SUV that blends bold presence with refined comfort. With premium leather interiors, advanced climate control, and a whisper-quiet cabin, every journey becomes an indulgent escape for families and groups.",
    passengers: 6, // 7 total - driver
    luggage: 6,
    imageBase: yukon,
    alt: "Front angle view of GMC Yukon parked outdoors",
  },
  {
    id: "chevrolet-tahoe",
    name: "Chevrolet Tahoe",
    description:
      "The Chevrolet Tahoe offers the perfect balance of elegance and power. Its spacious cabin, smooth ride, and versatile luxury features make it the ultimate choice for city transfers or long-distance getaways with complete peace of mind.",
    passengers: 6,
    luggage: 6,
    imageBase: tahoe,
    alt: "Chevrolet Tahoe in a scenic background",
  },
  {
    id: "ford-taurus",
    name: "Ford Taurus",
    description:
      "Sophisticated and timeless, the Ford Taurus sedan delivers executive-class comfort with a focus on refinement. Plush seating, advanced safety technology, and a serene ride make it the ideal companion for business or leisure travel.",
    passengers: 3,
    luggage: 3,
    imageBase: Taurus,
    alt: "Ford Taurus sedan in daylight",
  },
  {
    id: "ford-territory",
    name: "Ford Territory",
    description:
      "The Ford Territory is a mid-size SUV crafted for modern lifestyles. Offering a luxurious interior with intuitive technology and spacious seating, it redefines everyday journeys into experiences of pure sophistication.",
    passengers: 3,
    luggage: 4,
    imageBase: Territory,
    alt: "Ford Territory SUV parked near modern buildings",
  },
  {
    id: "bmw-7-series",
    name: "BMW 7 Series",
    description:
      "Experience executive luxury at its finest with the BMW 7 Series. Combining cutting-edge innovation with handcrafted details, its serene cabin and commanding performance ensure every moment on the road feels first class.",
    passengers: 3,
    luggage: 3,
    imageBase: Bmw,
    alt: "BMW 7 Series luxury sedan at night",
  },
  {
    id: "mercedes-s-class",
    name: "Mercedes-Benz S-Class",
    description:
      "Step into the epitome of prestige — the Mercedes-Benz S-Class. Known worldwide as the standard of luxury sedans, it offers unparalleled comfort with massage seating, ambient lighting, and silent elegance that transforms travel into an occasion.",
    passengers: 3,
    luggage: 3,
    imageBase: S_class,
    alt: "Mercedes-Benz S-Class parked elegantly",
  },
  {
    id: "mercedes-vito",
    name: "Mercedes-Benz Vito",
    description:
      "Designed for group travel without compromising style, the Mercedes-Benz Vito MPV offers generous seating, refined ride quality, and versatile luxury. Whether it’s family holidays or corporate transfers, it ensures a smooth journey for all.",
    passengers: 6,
    luggage: 7,
    imageBase: vito,
    alt: "Mercedes Vito van parked on roadside",
  },
  {
    id: "mercedes-sprinter",
    name: "Mercedes-Benz Sprinter",
    description:
      "Travel together in unmatched luxury with the Mercedes-Benz Sprinter. Configurable seating, executive finishes, and advanced comfort systems make it the premier choice for business groups and long-distance journeys.",
    passengers: 14,
    luggage: 10,
    imageBase: sprinter,
    alt: "Mercedes Sprinter van in open area",
  },
  {
    id: "mercedes-bus",
    name: "Mercedes Multi Axle Bus",
    description:
      "For the ultimate in group luxury travel, the Mercedes Multi Axle Bus offers reclining executive seats, onboard amenities, and an ultra-smooth ride. Perfect for corporate tours and special occasions, it redefines coach travel with prestige.",
    passengers: 47,
    luggage: 40,
    imageBase: bus,
    alt: "Mercedes multi-axle bus on highway",
  },
];

export default function Fleet() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <section className="text-center py-16 px-6">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 
                     bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 
                     bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30, letterSpacing: "0.05em" }}
          whileInView={{ opacity: 1, y: 0, letterSpacing: "0em" }}
          transition={{ duration: 1 }}
        >
          Featured Luxury Fleet
        </motion.h1>
        <motion.p
          className="text-lg text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Travel in unmatched style, comfort, and prestige with our curated
          collection of premium vehicles.
        </motion.p>
      </section>

      {/* Fleet Listing */}
      <section className="space-y-20 max-w-6xl mx-auto px-6 pb-20">
        {vehicles.map((car, index) => (
          <motion.div
            key={car.id}
            className={`relative flex flex-col md:flex-row items-center gap-10 rounded-2xl p-6 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Subtle alternating background */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/30 via-gray-700/20 to-transparent rounded-2xl -z-10" />

            {/* Car Image */}
            <motion.div
              className="md:w-1/2 overflow-hidden rounded-2xl shadow-xl"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={car.imageBase}
                alt={car.alt}
                className="object-cover w-full h-[320px] md:h-[400px] rounded-2xl"
              />
            </motion.div>

            {/* Car Content */}
            <motion.div
              className="md:w-1/2 space-y-4"
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-indigo-300">
                {car.name}
              </h2>
              <p className="text-gray-300">{car.description}</p>

              {/* Passengers & Luggage */}
              <div className="flex items-center gap-6 text-gray-400 mt-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span>{car.passengers} Passengers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Luggage className="w-5 h-5 text-indigo-400" />
                  <span>{car.luggage} Luggage</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                asChild
                className="mt-6 bg-indigo-500 text-white font-semibold hover:bg-indigo-400"
              >
                <Link to="/book">Book Now</Link>
              </Button>
            </motion.div>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
