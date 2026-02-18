import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, CalendarCheck, FileText, BarChart2,
    LogOut, ChevronLeft, ChevronRight, Car
} from "lucide-react";
import logo from "../../assets/Flyinco.png";

const links = [
    { name: "Overview", path: "/staff", icon: LayoutDashboard, end: true },
    { name: "Bookings", path: "/staff/bookings", icon: CalendarCheck },
    { name: "Invoices", path: "/staff/invoices", icon: FileText },
    { name: "Reports", path: "/staff/reports", icon: BarChart2 },
];

export default function StaffLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("userInfo");
        navigate("/login");
    }

    return (
        <div className="h-screen flex bg-[#0f1117] text-white overflow-hidden">
            {/* ── Sidebar ── */}
            <aside
                className={`flex flex-col bg-[#161b27] border-r border-white/10 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-64"
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 h-16 px-4 border-b border-white/10">
                    <img src={logo} alt="Flyinco" className="h-8 shrink-0" />
                    {!collapsed && (
                        <span className="font-bold text-sm tracking-wide text-white/90">
                            Staff Portal
                        </span>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-2 space-y-1">
                    {links.map(({ name, path, icon: Icon, end }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${isActive
                                    ? "bg-amber-500/20 text-amber-400"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                                }`
                            }
                        >
                            <Icon size={18} className="shrink-0" />
                            {!collapsed && <span>{name}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Collapse + Logout */}
                <div className="p-2 border-t border-white/10 space-y-1">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
                    >
                        <LogOut size={18} className="shrink-0" />
                        {!collapsed && <span>Logout</span>}
                    </button>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/40 hover:bg-white/5 transition"
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        {!collapsed && <span className="text-xs">Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-16 flex items-center justify-between px-6 bg-[#161b27] border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Car size={16} className="text-amber-400" />
                        <span>Flyinco Chauffeur — Staff Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {(() => {
                            const u = JSON.parse(localStorage.getItem("userInfo") || "{}");
                            return (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm">
                                        {u.name?.[0] || "S"}
                                    </div>
                                    <span className="text-sm text-white/80">{u.name || "Staff"}</span>
                                </div>
                            );
                        })()}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
