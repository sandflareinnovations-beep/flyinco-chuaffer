import React, { useEffect, useState, useMemo } from "react";
import api from "../../lib/api";
import { Download, TrendingUp, DollarSign, CalendarCheck, BarChart2 } from "lucide-react";

export default function StaffReports() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Report controls
    const [reportType, setReportType] = useState("monthly");
    const [month, setMonth] = useState(() => {
        const n = new Date();
        return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
    });
    const [year, setYear] = useState(String(new Date().getFullYear()));
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        api.get("/bookings")
            .then(r => setBookings(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    /* ── Filter bookings for selected period ── */
    const periodBookings = useMemo(() => {
        return bookings.filter(b => {
            const d = new Date(b.createdAt);
            if (reportType === "monthly") {
                const [y, m] = month.split("-");
                return d.getFullYear() === Number(y) && d.getMonth() + 1 === Number(m);
            } else {
                return d.getFullYear() === Number(year);
            }
        });
    }, [bookings, reportType, month, year]);

    const totalRevenue = periodBookings.reduce((s, b) => s + (b.amount || 0), 0);
    const confirmed = periodBookings.filter(b => b.status === "confirmed").length;
    const pending = periodBookings.filter(b => b.status === "pending").length;
    const cancelled = periodBookings.filter(b => b.status === "cancelled").length;
    const avgAmount = periodBookings.length ? totalRevenue / periodBookings.length : 0;

    /* ── Monthly breakdown (for yearly view) ── */
    const monthlyBreakdown = useMemo(() => {
        if (reportType !== "yearly") return [];
        const map = {};
        periodBookings.forEach(b => {
            const m = new Date(b.createdAt).getMonth();
            if (!map[m]) map[m] = { bookings: 0, revenue: 0 };
            map[m].bookings++;
            map[m].revenue += b.amount || 0;
        });
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.map((name, i) => ({
            name,
            bookings: map[i]?.bookings || 0,
            revenue: map[i]?.revenue || 0,
        }));
    }, [periodBookings, reportType]);

    /* ── Download PDF via backend ── */
    async function downloadPDF() {
        setDownloading(true);
        try {
            const params = { type: reportType };
            if (reportType === "monthly") params.month = month;
            else params.year = year;

            const res = await api.get("/bookings/report", { params, responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `flyinco-report-${reportType === "monthly" ? month : year}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            alert("Failed to generate PDF. Check server logs.");
            console.error(e);
        } finally { setDownloading(false); }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const periodLabel = reportType === "monthly"
        ? new Date(month + "-01").toLocaleString("default", { month: "long", year: "numeric" })
        : year;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Monthly Reports</h1>
                <p className="text-white/40 text-sm">Calculate revenue and download PDF reports</p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-end gap-4 p-5 rounded-2xl bg-[#1e2435] border border-white/5">
                <div>
                    <label className="text-xs text-white/50 mb-1 block">Report Type</label>
                    <select value={reportType} onChange={e => setReportType(e.target.value)}
                        className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50">
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>

                {reportType === "monthly" ? (
                    <div>
                        <label className="text-xs text-white/50 mb-1 block">Select Month</label>
                        <input type="month" value={month} onChange={e => setMonth(e.target.value)}
                            className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50" />
                    </div>
                ) : (
                    <div>
                        <label className="text-xs text-white/50 mb-1 block">Year</label>
                        <input type="number" value={year} onChange={e => setYear(e.target.value)}
                            min="2020" max="2030"
                            className="bg-[#0f1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 w-28" />
                    </div>
                )}

                <button onClick={downloadPDF} disabled={downloading}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition disabled:opacity-50">
                    <Download size={16} />
                    {downloading ? "Generating…" : "Download PDF"}
                </button>
            </div>

            {/* Summary Cards */}
            <div>
                <h2 className="text-white/60 text-sm font-medium mb-3">Summary — {periodLabel}</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Bookings", value: periodBookings.length, icon: CalendarCheck, color: "text-blue-400", bg: "bg-blue-500/10" },
                        { label: "Total Revenue", value: `BHD ${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10" },
                        { label: "Avg per Booking", value: `BHD ${avgAmount.toFixed(2)}`, icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" },
                        { label: "Confirmed", value: confirmed, icon: BarChart2, color: "text-purple-400", bg: "bg-purple-500/10" },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="rounded-2xl bg-[#1e2435] border border-white/5 p-5 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                                <Icon size={20} className={color} />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-white">{value}</div>
                                <div className="text-xs text-white/40">{label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#1e2435] border border-white/5 p-5">
                    <h3 className="text-white/70 text-sm font-medium mb-4">Booking Status Breakdown</h3>
                    <div className="space-y-3">
                        {[
                            { label: "Confirmed", count: confirmed, color: "bg-green-500", pct: periodBookings.length ? (confirmed / periodBookings.length) * 100 : 0 },
                            { label: "Pending", count: pending, color: "bg-amber-500", pct: periodBookings.length ? (pending / periodBookings.length) * 100 : 0 },
                            { label: "Cancelled", count: cancelled, color: "bg-red-500", pct: periodBookings.length ? (cancelled / periodBookings.length) * 100 : 0 },
                        ].map(({ label, count, color, pct }) => (
                            <div key={label}>
                                <div className="flex justify-between text-xs text-white/60 mb-1">
                                    <span>{label}</span>
                                    <span>{count} ({pct.toFixed(0)}%)</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Yearly monthly breakdown table */}
                {reportType === "yearly" && (
                    <div className="rounded-2xl bg-[#1e2435] border border-white/5 p-5">
                        <h3 className="text-white/70 text-sm font-medium mb-4">Monthly Breakdown — {year}</h3>
                        <div className="overflow-auto max-h-64">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="text-white/40 border-b border-white/5">
                                        <th className="text-left py-2">Month</th>
                                        <th className="text-right py-2">Bookings</th>
                                        <th className="text-right py-2">Revenue (BHD)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {monthlyBreakdown.map(row => (
                                        <tr key={row.name} className={row.bookings > 0 ? "text-white" : "text-white/30"}>
                                            <td className="py-2">{row.name}</td>
                                            <td className="py-2 text-right">{row.bookings}</td>
                                            <td className="py-2 text-right text-amber-400">{row.revenue.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr className="border-t border-amber-500/30 font-bold text-amber-400">
                                        <td className="py-2">Total</td>
                                        <td className="py-2 text-right">{periodBookings.length}</td>
                                        <td className="py-2 text-right">{totalRevenue.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Monthly: booking list */}
                {reportType === "monthly" && (
                    <div className="rounded-2xl bg-[#1e2435] border border-white/5 p-5">
                        <h3 className="text-white/70 text-sm font-medium mb-4">Bookings in {periodLabel}</h3>
                        <div className="overflow-auto max-h-64 space-y-2">
                            {periodBookings.length === 0 && (
                                <p className="text-white/30 text-xs text-center py-6">No bookings this period</p>
                            )}
                            {periodBookings.map(b => (
                                <div key={b._id} className="flex justify-between items-center text-xs py-1.5 border-b border-white/5">
                                    <div>
                                        <span className="text-white font-medium">{b.firstName} {b.lastName}</span>
                                        <span className="text-white/40 ml-2">{b.service}</span>
                                    </div>
                                    <span className="text-amber-400 font-medium">
                                        {b.amount ? `BHD ${Number(b.amount).toFixed(2)}` : "—"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
