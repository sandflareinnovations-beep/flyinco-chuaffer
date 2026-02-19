// src/pages/ServicesJourney.jsx
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Users/Navbar";
import Footer from "../../Components/Users/Footer";

import airportService from "../../assets/Cars/Airport service.jpg";
import HotelTransfer from "../../assets/Cars/Hotel Transfer service.jpg";
import ChaufferService from "../../assets/Cars/Chauffeur Services.jpg";
import corporateTransport from "../../assets/Cars/Corporate transportation.jpg";
import EventTransport from "../../assets/Cars/Event transportation.jpg";
import GroupTransport from "../../assets/Cars/Group transportation.jpg";

const SERVICES = [
  {
    id: "01",
    name: "Airport Arrival",
    img: airportService,
    summary:
      "Your journey begins the moment you land. A Flyinco chauffeur awaits with flawless timing, managing luggage and guiding you to a calm, private ride that feels like stepping into a sanctuary.",
  },
  {
    id: "02",
    name: "Hotel Transfers",
    img: HotelTransfer,
    summary:
      "Glide seamlessly between lobby and destination. With every detail coordinated in advance, you arrive or depart in serene comfort — refreshed, unhurried, and always on time.",
  },
  {
    id: "03",
    name: "Chauffeur Service",
    img: ChaufferService,
    summary:
      "This is private travel elevated. A dedicated chauffeur anticipates your needs, shields your privacy, and ensures every ride feels like a curated luxury experience.",
  },
  {
    id: "04",
    name: "Corporate Journeys",
    img: corporateTransport,
    summary:
      "Move like leadership. Whether it’s an executive transfer, a roadshow, or a VIP itinerary, every journey flows with discipline, discretion, and seamless precision.",
  },
  {
    id: "05",
    name: "Event Arrivals",
    img: EventTransport,
    summary:
      "Make an entrance that feels effortless. From galas to weddings, Flyinco orchestrates vehicles, routes, and timings so you and your guests arrive with elegance — as if on cue.",
  },
  {
    id: "06",
    name: "Group Experiences",
    img: GroupTransport,
    summary:
      "Together, without compromise. Spacious vans and minibuses offer refined interiors and smooth coordination, so your family, friends, or colleagues travel as one in comfort.",
  },
];

export default function ServicesJourney() {
  return (
    <div className="bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="text-center py-16 px-6">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Your Journey with Flyinco
        </motion.h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Every milestone in our service line is a chapter in your luxury
          journey. From first arrival to final destination — each step is
          refined, seamless, and unforgettable.
        </p>
      </section>

      {/* Journey Line */}
      <div className="relative max-w-6xl mx-auto px-6 pb-20">
        {/* Glowing journey line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-indigo-400 via-purple-400 to-blue-400 opacity-80" />

        <div className="space-y-32 relative z-10">
          {SERVICES.map((s, i) => {
            const [ref, inView] = useInView({
              triggerOnce: true,
              threshold: 0.3,
            });
            const controls = useAnimation();

            useEffect(() => {
              if (inView) controls.start("visible");
            }, [inView, controls]);

            return (
              <motion.div
                ref={ref}
                key={s.id}
                className={`relative flex flex-col md:flex-row items-center gap-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 80 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.9, ease: "easeOut" },
                  },
                }}
              >
                {/* Journey dot */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 shadow-[0_0_25px_rgba(99,102,241,0.9)] animate-pulse" />
                </div>

                {/* Image */}
                <motion.div
                  className="md:w-1/2 overflow-hidden rounded-2xl shadow-xl"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.img
                    src={s.img}
                    alt={s.name}
                    className="w-full h-[280px] md:h-[340px] object-cover rounded-2xl"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </motion.div>

                {/* Content */}
                <motion.div
                  className="md:w-1/2 space-y-4 text-center md:text-left"
                  initial={{ opacity: 0, x: i % 2 === 0 ? 100 : -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  <h2 className="text-2xl md:text-3xl font-semibold text-indigo-300">
                    {s.id}. {s.name}
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{s.summary}</p>

                  {/* CTA */}
                  <Link
                    to="/book"
                    className="inline-block mt-4 px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white font-medium hover:scale-105 transition-transform"
                  >
                    Book Now
                  </Link>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
