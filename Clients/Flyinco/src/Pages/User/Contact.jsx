// src/pages/Contact.jsx
import React from "react";
import Navbar from "../../Components/Users/Navbar";
import Footer from "../../Components/Users/Footer";
import { Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = (direction = "up", delay = 0) => ({
  hidden: {
    opacity: 0,
    y: direction === "up" ? 40 : -40,
    x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration: 0.8, delay, ease: "easeOut" },
  },
});

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center text-center px-6">
        <motion.div
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Contact Us
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400 leading-relaxed">
            We’re here to assist with bookings, business travel, and special
            occasions. Reach us through phone, email, or drop a message directly.
          </p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="flex-1 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 px-6 py-24">
        {/* Left - Contact Methods */}
        <motion.div
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col justify-center gap-10"
        >
          {/* Phone */}
          <a
            href="tel:+97333692021"
            className="group flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-800 text-white">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-white">Phone</h3>
              <p className="text-gray-300">+973 33692021</p>
              <p className="text-gray-300">+973 35016007</p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:limo@flyinco.com"
            className="group flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-800 text-white">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-white">Email</h3>
              <p className="text-gray-300">limo@flyinco.com</p>
            </div>
          </a>

          {/* Address */}
          <a
            href="https://maps.google.com/?q=Al+Qudaybiyah+0308+Manama+Kingdom+of+Bahrain"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-800 text-white">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-white">Address</h3>
              <p className="text-gray-300 leading-relaxed">
                Flyinco Travel & Tourism W.L.L <br />
                CR.No. 167235-1 <br />
                Office: A0227, Zubara Avenue, Awal Street <br />
                Al Qudaybiyah 0308, Manama <br />
                Kingdom of Bahrain
              </p>
            </div>
          </a>
        </motion.div>

        {/* Right - Contact Form */}
        <motion.div
          variants={fadeIn("right", 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col justify-center"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-10 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-8">
              Send us a Message
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg bg-gray-950/60 border border-gray-700 px-4 py-3 text-white focus:ring-2 focus:ring-white/40 outline-none transition"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg bg-gray-950/60 border border-gray-700 px-4 py-3 text-white focus:ring-2 focus:ring-white/40 outline-none transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea
                  rows="6"
                  className="w-full rounded-lg bg-gray-950/60 border border-gray-700 px-4 py-3 text-white focus:ring-2 focus:ring-white/40 outline-none transition"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition text-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
