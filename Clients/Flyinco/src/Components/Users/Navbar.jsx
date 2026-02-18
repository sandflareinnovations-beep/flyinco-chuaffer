import React, { useEffect, useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import logo from "../../assets/Flyinco White Logo.png";

// ---- Nav links ----
const leftLinks = [
  { label: "Services", to: "/services" },
  { label: "Why Choose Us", to: "/why-choose-us" },
  { label: "About", to: "/about" },
];
const rightLinks = [
  { label: "Fleet", to: "/fleet" },
  { label: "Contact", to: "/contact" },
];

// desktop link styling
function linkClasses(isActive) {
  return [
    "group inline-flex items-center rounded-md px-1.5 py-2 font-medium transition-colors",
    isActive ? "text-white" : "text-white/80 hover:text-white",
  ].join(" ");
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={[
          "w-full backdrop-blur-lg transition-all",
          scrolled ? "bg-black/50" : "bg-transparent",
        ].join(" ")}
      >
        <nav className="grid grid-cols-3 items-center px-4 py-2 sm:px-6 sm:py-3 relative">
          {/* Left links (desktop) */}
          <ul className="hidden md:flex items-center gap-6 text-sm justify-start">
            {leftLinks.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => linkClasses(isActive)}
                >
                  <span>{item.label}</span>
                  <span className="block h-0.5 scale-x-0 bg-white/80 transition-transform duration-300 group-hover:scale-x-100" />
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Center logo (desktop only) */}
          <div className="hidden md:flex items-center justify-center">
            <Link to="/" aria-label="Flyinco home">
              <img
                src={logo}
                alt="Flyinco logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right links (desktop) */}
          <div className="hidden md:flex items-center justify-end gap-6">
            <ul className="flex items-center gap-6 text-sm">
              {rightLinks.map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => linkClasses(isActive)}
                  >
                    <span>{item.label}</span>
                    <span className="block h-0.5 scale-x-0 bg-white/80 transition-transform duration-300 group-hover:scale-x-100" />
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* ✅ Auth Section */}
            {userInfo ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="rounded-full px-5 text-white"
                    style={{ backgroundColor: "#4b0082" }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    {userInfo.name?.split(" ")[0] || "Profile"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-44 bg-black/60 backdrop-blur-md border border-white/20 text-white"
                >
                  <DropdownMenuItem
                    asChild
                    className="text-white data-[highlighted]:bg-[#4b0082] data-[highlighted]:text-white"
                  >
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white data-[highlighted]:bg-red-600 data-[highlighted]:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                size="sm"
                className="rounded-full px-5 text-white"
                style={{ backgroundColor: "#4b0082" }}
              >
                <Link to="/login" aria-label="Login">
                  Login
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile (logo + hamburger) */}
          <div className="md:hidden col-span-3 flex items-center justify-between relative">
            {/* Logo */}
            <Link
              to="/"
              aria-label="Flyinco home"
              className="flex items-center gap-2"
            >
              <img
                src={logo}
                alt="Flyinco logo"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Mobile menu */}
            <MobileMenu userInfo={userInfo} handleLogout={handleLogout} />
          </div>
        </nav>
      </div>
    </header>
  );
}

function MobileMenu({ userInfo, handleLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full flex justify-end">
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? "Close menu" : "Open menu"}
        className="h-10 w-10 text-white hover:bg-white/10"
        onClick={() => setOpen(!open)}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Full-width dropdown panel with animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[3.5rem] right-0 w-[90vw] max-w-sm rounded-xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl z-50 overflow-hidden"
          >
            <nav className="flex flex-col space-y-1 p-4">
              {[...leftLinks, ...rightLinks].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      [
                        "block rounded-lg px-4 py-3 text-base font-medium transition-all",
                        "hover:bg-white/10 hover:pl-6", // subtle shift on hover
                        isActive ? "bg-white/10 text-white" : "text-white/80",
                      ].join(" ")
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}

              {/* ✅ Auth section (mobile) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-4 mt-2 border-t border-white/10"
              >
                {userInfo ? (
                  <div className="flex flex-col gap-3">
                    <Button
                      asChild
                      className="w-full rounded-full text-base py-6 text-white shadow-lg"
                      style={{ backgroundColor: "#4b0082" }}
                      onClick={() => setOpen(false)}
                    >
                      <Link to="/profile" className="flex items-center justify-center gap-2">
                        <User className="h-5 w-5" />
                        Profile
                      </Link>
                    </Button>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="w-full rounded-full text-base py-6 bg-red-600/80 text-white flex items-center justify-center gap-2 hover:bg-red-700"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    asChild
                    className="w-full rounded-full text-base py-6 text-white shadow-lg"
                    style={{ backgroundColor: "#4b0082" }}
                    onClick={() => setOpen(false)}
                  >
                    <Link to="/login" aria-label="Login">
                      Login
                    </Link>
                  </Button>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
