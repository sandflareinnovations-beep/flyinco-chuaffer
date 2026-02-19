// src/pages/AboutUs.jsx
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Navbar from "../../Components/Users/Navbar";
import Footer from "../../Components/Users/Footer"; // ✅ added footer
import {
  Crown,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import bgimg from "../../assets/Cars/Login page.jpg";

const fadeIn = (direction = "up", delay = 0) => {
  return {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : -40,
      x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: "easeOut",
      },
    },
  };
};

const AboutUs = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start("show");
  }, [inView, controls]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200">
      <Navbar />

      {/* Hero Section with Background Image */}
      <section
        className="relative py-28 text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        <motion.div
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          animate="show"
          className="relative max-w-4xl mx-auto px-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            About <span className="text-white">Flyinco</span>
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-gray-300">
            Luxury isn’t just in the cars we drive — it’s in the way we care for
            our clients. Discover our story, values, and the promise that makes
            every journey exceptional.
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section
        ref={ref}
        className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center"
      >
        <motion.div
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          animate={controls}
        >
          <h2 className="text-3xl font-bold mb-6 text-white">
            Our Story
          </h2>
          <p className="text-lg leading-relaxed text-gray-400">
            At <span className="font-semibold text-white">Flyinco Chauffeur Services</span>,
            we believe travel should be more than just reaching a destination —
            it should be an experience of comfort, elegance, and peace of mind.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-gray-400">
            Founded with a vision to redefine luxury transportation, we’ve grown
            into a trusted name for airport transfers, corporate travel, and
            special events. Each journey is delivered with professionalism,
            reliability, and care.
          </p>
        </motion.div>

        <motion.div
          variants={fadeIn("right", 0.4)}
          initial="hidden"
          animate={controls}
          className="rounded-2xl overflow-hidden shadow-2xl"
        >
          <img
            src={bgimg}
            alt="Luxury Car"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-950 to-black py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            animate={controls}
            className="text-3xl font-bold mb-12 text-white"
          >
            Our Core Values
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Crown className="w-10 h-10 text-white mx-auto" />,
                title: "Excellence",
                desc: "We set the benchmark in service quality and client satisfaction.",
              },
              {
                icon: <ShieldCheck className="w-10 h-10 text-white mx-auto" />,
                title: "Discretion",
                desc: "Respecting privacy and ensuring comfort with complete professionalism.",
              },
              {
                icon: <HeartHandshake className="w-10 h-10 text-white mx-auto" />,
                title: "Trust",
                desc: "Building long-term relationships through reliability and transparency.",
              },
              {
                icon: <Sparkles className="w-10 h-10 text-white mx-auto" />,
                title: "Innovation",
                desc: "Continuously enhancing our services to meet modern travel needs.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeIn("up", 0.2 + idx * 0.2)}
                initial="hidden"
                animate={controls}
                className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition"
              >
                {item.icon}
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center flex-1">
        <motion.h2
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          animate={controls}
          className="text-3xl font-bold mb-6 text-white"
        >
          The Flyinco Experience
        </motion.h2>
        <motion.p
          variants={fadeIn("up", 0.4)}
          initial="hidden"
          animate={controls}
          className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-400"
        >
          From the moment you step into one of our vehicles, you’ll notice the
          difference — attention to detail, courteous chauffeurs, and an
          environment designed for relaxation. We don’t just drive you; we
          curate journeys that leave lasting impressions.
        </motion.p>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
