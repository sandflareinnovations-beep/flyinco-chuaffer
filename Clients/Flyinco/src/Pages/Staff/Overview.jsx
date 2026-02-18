import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import {
    CalendarCheck, Clock, CheckCircle, XCircle,
    TrendingUp, Users, Car, AlertCircle
} from "lucide-react";

export default function StaffOverview() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/bookings")
            .then(r => setBookings(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const total = bookings.length;
    const pending = bookings.filter(b => b.status === "pending").length;
    const confirmed = bookings.filter(b => b.status === "confirmed").length;
    const cancelled = bookings.filter(b => b.status === "cancelled").length;
    const unassigned = bookings.filter(b => !b.assignedDriver).length;

    // Revenue this month
    const now = new Date();
    const thisMonthRevenue = bookings
        .filter(b => {
            const d = new Date(b.createdAt);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, b) => sum + (b.amount || 0), 0);

    // Recent 5 bookings
    const recent = [...bookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    const stats = [
        { label: "Total Bookings", value: total, icon: CalendarCheck, color: "from-blue-500 to-blue-700", bg: "bg-blue-500/10" },
        { label: "Pending", value: pending, icon: Clock, color: "from-amber-400 to-amber-600", bg: "bg-amber-400/10" },
        { label: "Confirmed", value: confirmed, icon: CheckCircle, color: "from-green-400 to-green-600", bg: "bg-green-400/10" },
        { label: "Unassigned", value: unassigned, icon: AlertCircle, color: "from-red-400 to-red-600", bg: "bg-red-400/10" },
    ];

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Good day 👋</h1>
                <p className="text-white/50 text-sm mt-1">Here's what's happening today.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="rounded-2xl bg-[#1e2435] border border-white/5 p-5 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                            <Icon size={22} className={`bg-gradient-to-br ${color} bg-clip-text text-transparent`}
                                style={{ color: bg.includes("amber") ? "#f59e0b" : bg.includes("green") ? "#4ade80" : bg.includes("red") ? "#f87171" : "#60a5fa" }}
                            />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{value}</div>
                            <div className="text-xs text-white/50">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Revenue card */}
                <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/20 p-6">
                    <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
                        <TrendingUp size={16} /> This Month Revenue
                    </div>
                    <div className="text-4xl font-bold text-white">
                        BHD {thisMonthRevenue.toFixed(2)}
                    </div>
                    <div className="text-white/40 text-xs mt-1">
                        From {bookings.filter(b => {
                            const d = new Date(b.createdAt);
                            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                        }).length} bookings this month
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-2 rounded-2xl bg-[#1e2435] border border-white/5 p-6">
                    <h3 className="text-white/70 text-sm font-medium mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "New Booking", icon: CalendarCheck, action: () => navigate("/staff/bookings"), color: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" },
                            { label: "View Unassigned", icon: AlertCircle, action: () => navigate("/staff/bookings?filter=unassigned"), color: "bg-red-500/20 text-red-400 hover:bg-red-500/30" },
                            { label: "Download Report", icon: TrendingUp, action: () => navigate("/staff/reports"), color: "bg-green-500/20 text-green-400 hover:bg-green-500/30" },
                            { label: "Invoices", icon: Car, action: () => navigate("/staff/invoices"), color: "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30" },
                        ].map(({ label, icon: Icon, action, color }) => (
                            <button
                                key={label}
                                onClick={action}
                                className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition ${color}`}
                            >
                                <Icon size={18} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="rounded-2xl bg-[#1e2435] border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h3 className="text-white font-semibold">Recent Bookings</h3>
                    <button onClick={() => navigate("/staff/bookings")} className="text-amber-400 text-xs hover:underline">
                        View all →
                    </button>
                </div>
                <div className="divide-y divide-white/5">
                    {recent.length === 0 && (
                        <div className="px-6 py-8 text-center text-white/30 text-sm">No bookings yet</div>
                    )}
                    {recent.map(b => (
                        <div key={b._id} className="flex items-center justify-between px-6 py-3 hover:bg-white/5 transition">
                            <div>
                                <div className="text-sm font-medium text-white">{b.firstName} {b.lastName}</div>
                                <div className="text-xs text-white/40">{b.service} • {b.pickupLocation} → {b.dropLocation}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                                        b.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                                            "bg-amber-500/20 text-amber-400"
                                    }`}>
                                    {b.status}
                                </span>
                                <span className="text-xs text-white/30">
                                    {new Date(b.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
