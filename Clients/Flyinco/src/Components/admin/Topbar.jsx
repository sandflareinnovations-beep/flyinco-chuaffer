// src/components/admin/Topbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Flyinco.png";
import { Sun, Moon, LogOut, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import NotificationBell from "../../components/admin/Notification";

export default function Topbar() {
  const navigate = useNavigate();

  /* ── Dark mode ── persisted in localStorage, applied to <html> */
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("adminTheme") === "dark" ||
      (!localStorage.getItem("adminTheme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("adminTheme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("adminTheme", "light");
    }
  }, [dark]);

  /* ── Logout ── */
  function handleLogout() {
    localStorage.removeItem("userInfo");
    navigate("/login");
  }

  /* ── Notifications (sample) ── */
  const [notifications, setNotifications] = useState([
    { id: "1", title: "New booking created", message: "PNR #1024 by Sarah W.", time: "2m ago", type: "info", read: false },
    { id: "2", title: "Driver approved", message: "Alex Johnson is now active", time: "15m ago", type: "success", read: false },
    { id: "3", title: "Payment failed", message: "Booking #1018", time: "1h ago", type: "warning", read: true },
  ]);

  const handleItemClick = (item) => setNotifications(p => p.map(n => n.id === item.id ? { ...n, read: true } : n));
  const handleMarkAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })));

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">

      {/* ── Logo ── */}
      <div className="flex items-center gap-2 min-w-0">
        <img src={logo} alt="Flyinco" className="h-8 sm:h-10 w-auto object-contain" />
      </div>

      {/* ── Right controls ── */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Notifications */}
        <NotificationBell
          items={notifications}
          onItemClick={handleItemClick}
          onMarkAllRead={handleMarkAllRead}
        />

        {/* Dark / Light toggle */}
        <button
          onClick={() => setDark(d => !d)}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-full border transition-colors",
            dark
              ? "bg-gray-800 border-gray-600 text-yellow-400 hover:bg-gray-700"
              : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
          )}
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Logout — icon only on mobile, icon+text on sm+ */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
