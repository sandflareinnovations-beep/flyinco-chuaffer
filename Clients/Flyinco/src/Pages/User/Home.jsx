// src/pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import Navbar from "../../Components/Users/Navbar.jsx";
import HeroSection from "../../Components/Users/HeroSection.jsx";
import heroImg from "../../assets/Cars/Header.png";
import ServicesCarousel from "../../Components/Users/Services.jsx";
import WhyChooseUs from "../../Components/Users/WhyChooseUs.jsx";
import Fleet from "../../Components/Users/fleet.jsx";
import FAQ from "../../Components/Users/FAQ.jsx";
import Contact from "../../Components/Users/contact.jsx";
import Footer from "../../Components/Users/Footer.jsx";

// Reusable scroll animation wrapper
function FadeInSection({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background fixed for parallax-like feel below hero */}
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <HeroSection />

        <FadeInSection>
          <ServicesCarousel />
        </FadeInSection>

        <FadeInSection>
          <WhyChooseUs />
        </FadeInSection>

        <FadeInSection>
          <Fleet />
        </FadeInSection>

        <FadeInSection>
          <FAQ />
        </FadeInSection>

        <FadeInSection>
          <Contact />
        </FadeInSection>

        <Footer variant="default" />
      </div>
    </div>
  );
}
