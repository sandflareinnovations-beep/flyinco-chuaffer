// src/pages/AuthPage.jsx
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Phone } from "lucide-react"; // ✅ icons
import api from "../../lib/api";

// ✅ shadcn ui select for flags
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ Framer Motion
import { motion } from "framer-motion";

import bgimg from "../../assets/Cars/Login page with tag.jpg";
import companyLogo from "../../assets/Flyinco.png";
import flagUAE from "../../assets/flags/uae.svg";
import flagBahrain from "../../assets/flags/bahrain.svg";
import flagKSA from "../../assets/flags/saudi.svg";

const countries = [
  { code: "+971", abbr: "UAE", flag: flagUAE },
  { code: "+973", abbr: "BHR", flag: flagBahrain },
  { code: "+966", abbr: "KSA", flag: flagKSA },
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    countryCode: "+971",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("All fields are required!");
      return;
    }
    if (!isLogin && (!formData.firstName || !formData.lastName || !formData.phone)) {
      alert("All fields are required for signup!");
      return;
    }

    const fullPhone = isLogin ? formData.phone : `${formData.countryCode}${formData.phone}`;
    const payload = { ...formData, phone: fullPhone };

    try {
      const { data } = await api.post(
        isLogin ? "/auth/login" : "/auth/register",
        payload
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      const role = data.role?.toLowerCase();
      if (role === "admin") window.location.href = "/admin/dashboard";
      else if (role === "staff") window.location.href = "/staff";
      else if (role === "driver") window.location.href = "/driver";
      else window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      {/* Card with fade/slide in animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="w-full rounded-2xl shadow-2xl bg-white/60 backdrop-blur-md p-8 text-gray-800">
          {/* Header */}
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold">
              {isLogin ? "Welcome Back!" : "Create an Account"}
            </h1>

            {/* Animated underline */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "4rem" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="h-1 bg-[#4b0082] mx-auto mt-2 rounded"
            />

            <p className="mt-2 mb-2 text-sm text-gray-600">
              {isLogin ? "Please log in to continue." : "Please fill details to sign up."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10 bg-white border-gray-300 text-gray-800 placeholder-gray-500 h-12"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-10 bg-white border-gray-300 text-gray-800 placeholder-gray-500 h-12"
                  />
                </div>

                {/* Phone input with flag dropdown */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <Select
                    value={formData.countryCode}
                    onValueChange={(val) =>
                      setFormData((p) => ({ ...p, countryCode: val }))
                    }
                  >
                    <SelectTrigger className="min-w-[120px] h-12 bg-white border-none focus:ring-0 text-gray-800">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <img
                            src={countries.find((c) => c.code === formData.countryCode)?.flag}
                            alt="flag"
                            className="w-5 h-5"
                          />
                          <span>{formData.countryCode}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          <div className="flex items-center gap-2">
                            <img src={c.flag} alt={c.abbr} className="w-5 h-5" />
                            <span>
                              {c.abbr} {c.code}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 h-12 outline-none text-gray-800 placeholder-gray-500 bg-white"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="pl-10 bg-white border-gray-300 text-gray-800 placeholder-gray-500 h-12"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="pl-10 bg-white border-gray-300 text-gray-800 placeholder-gray-500 h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-white font-semibold h-12"
              style={{ backgroundColor: "#4b0082" }}
            >
              {isLogin ? "Log In" : "Sign Up"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-4 w-full">
            <div className="relative bg-gray-100 rounded-lg shadow-sm flex justify-center items-center">
              <img src={companyLogo} alt="Company Logo" className="w-28 h-auto py-2" />
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-[#4b0082] font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-[#4b0082] font-semibold hover:underline"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
