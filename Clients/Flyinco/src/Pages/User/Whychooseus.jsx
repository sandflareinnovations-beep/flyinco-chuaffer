// src/pages/WhyChooseUsPage.jsx
import React, { useEffect } from "react";
import {
  Clock,
  Gem,
  UserCheck,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Navbar from "../../Components/Users/Navbar";
import Footer from "../../Components/Users/Footer";

const ITEMS = [
  {
    icon: UserCheck,
    title: "Professional Chauffeurs & Unmatched Safety",
    desc: "Your journey deserves more than a driver — it deserves a professional. Our chauffeurs are meticulously trained in etiquette, discretion, and precision driving. With rigorous safety standards, advanced vehicle technology, and continuous training, every mile is safeguarded. You’re not just traveling; you’re protected by professionals who make your comfort and safety their highest priority.",
    bullets: [
      "Expert chauffeurs trained in discretion & courtesy",
      "Multi-point safety checks before every trip",
      "State-of-the-art safety systems in every vehicle",
    ],
  },
  {
    icon: Gem,
    title: "Luxury Fleet & Elevated Comforts",
    desc: "From sleek executive sedans to spacious group vehicles, our fleet is curated to impress and maintained to perfection. Inside, every detail is considered — ensuring you arrive in comfort and style that reflects your status. Complimentary amenities turn every transfer into a refined travel experience.",
    bullets: [
      "Complimentary bottled water & premium tissues",
      "Newspapers, magazines & curated media on request",
      "On-board Wi-Fi (available in select locations)",
    ],
    accentIcon: Sparkles,
  },
  {
    icon: Clock,
    title: "Reliability That Respects Your Time",
    desc: "In business and life, time is your most valuable asset. That’s why punctuality isn’t a promise — it’s our standard. With real-time tracking, intelligent route planning, and precision scheduling, you can depend on us to get you where you need to be — seamlessly, every time.",
    bullets: [
      "Guaranteed on-time arrivals and departures",
      "Intelligent route planning with live monitoring",
      "Seamless scheduling for stress-free journeys",
    ],
  },
  {
    icon: SlidersHorizontal,
    title: "Tailored Journeys, Just for You",
    desc: "No two clients are alike — and neither are their journeys. Whether it’s a bespoke itinerary, a preferred in-cabin setting, or specific routing requests, we adapt every detail to suit your preferences. With us, luxury isn’t generic; it’s personal.",
    bullets: [
      "Bespoke route planning & flexible scheduling",
      "In-cabin preferences catered to your taste",
      "Services that adapt to your lifestyle and needs",
    ],
  },
];

export default function WhyChooseUsPage() {
  return (
    <div className="bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center h-[40vh] text-center px-6">
        <motion.h1
          className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Why Choose Us
        </motion.h1>
        <motion.p
          className="mt-6 max-w-3xl text-lg sm:text-xl text-gray-300 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          Excellence isn’t an upgrade — it’s the baseline.
          Here’s why Flyinco stands apart in redefining journeys.
        </motion.p>
      </section>

      {/* Wave Journey Section */}
      <section className="relative py-20 px-6 md:px-12 max-w-6xl mx-auto">
        {/* Wave line */}
        <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none">
          <svg
            viewBox="0 0 1200 400"
            className="w-full h-full opacity-20"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 200 Q 300 100 600 200 T 1200 200"
              stroke="url(#grad)"
              strokeWidth="3"
              fill="transparent"
            />
            <defs>
              <linearGradient id="grad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 space-y-32">
          {ITEMS.map((f, i) => {
            const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
            const controls = useAnimation();

            useEffect(() => {
              if (inView) controls.start("visible");
            }, [inView, controls]);

            return (
              <motion.div
                ref={ref}
                key={i}
                className={`relative flex flex-col md:flex-row items-center gap-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 80 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
                }}
              >
                {/* Icon circle */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.7)]">
                    <f.icon className="h-10 w-10 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-2/3 space-y-4">
                  <h3 className="text-2xl font-semibold text-white">{f.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{f.desc}</p>
                  {f.bullets && (
                    <ul className="mt-5 space-y-2">
                      {f.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2 text-gray-300">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 text-indigo-400" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
