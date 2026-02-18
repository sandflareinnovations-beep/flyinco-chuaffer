// src/layouts/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  // Auto-collapse on mobile (initially)
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth < 768) setCollapsed(true);
      else setCollapsed(false);
    };
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsRTL(el.dir === "rtl");
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ["dir"] });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Sidebar is fixed */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content is shifted with margin */}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300",
          isRTL
            ? collapsed
              ? "mr-20"
              : "mr-64"
            : collapsed
              ? "ml-20"
              : "ml-64"
        )}
      >
        {/* Topbar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <Topbar />
        </div>

        {/* Main outlet content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-950 dark:text-white transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
