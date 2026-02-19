// src/Components/HeroSection.jsx
import React from "react";
import { motion } from "framer-motion";
import heroImg from "../../assets/Cars/Header.png";

export default function HeroSection() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center bg-black overflow-hidden">
      {/* Background image with Parallax-like scale effect on load */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={heroImg}
          alt="Luxury travel background"
          className="h-full w-full object-cover"
        />
        {/* Gradient Overlay for better text readability and premium look */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-4 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-5xl md:text-7xl font-bold tracking-tight drop-shadow-2xl"
        >
          Premium Chauffeur Service
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8 text-lg md:text-2xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed"
        >
          Flyinco offers world-class chauffeur experiences with unmatched comfort,
          style, and professionalism.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a
            href="/book"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-medium text-black shadow-xl transition-all hover:bg-gray-100 hover:ring-4 hover:ring-white/20"
          >
            <span>Book Your Ride</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
