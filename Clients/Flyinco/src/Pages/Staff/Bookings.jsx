import React, { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import {
    Plus, Search, Eye, UserCheck, Trash2, X, ChevronLeft, ChevronRight
} from "lucide-react";

/* ─── helpers ─── */
function badge(status, assigned) {
    if (!assigned) return { label: "Unassigned", cls: "bg-red-500/20 text-red-400" };
    if (status === "confirmed") return { label: "Confirmed", cls: "bg-green-500/20 text-green-400" };
    if (status === "cancelled") return { label: "Cancelled", cls: "bg-gray-500/20 text-gray-400" };
    return { label: "Pending", cls: "bg-amber-500/20 text-amber-400" };
}

const EMPTY_FORM = {
    firstName: "", lastName: "", email: "", countryCode: "+973", contactNumber: "",
    service: "Airport Transfer", pickupLocation: "", dropLocation: "",
    pickupDate: "", pickupTime: "", passengers: 1, luggage: 0,
    vehicle: "Sedan", notes: "", status: "pending", amount: "",
};

export default function StaffBookings() {
    const [bookings, setBookings] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI
    const [query, setQuery] = useState("");
    const [statusFilter, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;

    // Modals
    const [showForm, setShowForm] = useState(false);
    const [showView, setShowView] = useState(null);   // booking obj
    const [showAssign, setShowAssign] = useState(null);   // booking obj
    const [showDelete, setShowDelete] = useState(null);   // booking id

    // Form state
    const [form, setForm] = useState(EMPTY_FORM);
    const [assignDriverId, setAssignDriverId] = useState("");
    const [assignAmount, setAssignAmount] = useState("");
    const [saving, setSaving] = useState(false);

    /* ─── fetch ─── */
    async function load() {
        try {
            const [br, dr] = await Promise.all([
                api.get("/bookings"),
                api.get("/auth/drivers"),
            ]);
            setBookings(br.data);
            setDrivers(dr.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }
    useEffect(() => { load(); }, []);

    /* ─── filter / sort ─── */
    const filtered = useMemo(() => {
        let arr = [...bookings];
        if (query.trim()) {
            const q = query.toLowerCase();
            arr = arr.filter(b =>
                `${b.firstName} ${b.lastName} ${b.email} ${b.pickupLocation} ${b.dropLocation}`
                    .toLowerCase().includes(q)
            );
        }
        if (statusFilter === "unassigned") arr = arr.filter(b => !b.assignedDriver);
        else if (statusFilter !== "all") arr = arr.filter(b => b.status === statusFilter);
        return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [bookings, query, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const page_data = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    /* ─── actions ─── */
    async function createBooking() {
        setSaving(true);
        try {
            const { data } = await api.post("/bookings", {
                ...form,
                amount: form.amount ? Number(form.amount) : 0,
                passengers: Number(form.passengers),
                luggage: Number(form.luggage),
            });
            setBookings(prev => [data, ...prev]);
            setShowForm(false);
            setForm(EMPTY_FORM);
        } catch (e) { alert(e.response?.data?.message || "Error creating booking"); }
        finally { setSaving(false); }
    }

    async function doAssign() {
        if (!assignDriverId) return alert("Select a driver");
        setSaving(true);
        try {
            const { data } = await api.put(`/bookings/${showAssign._id}/assign`, {
                driverId: assignDriverId,
                amount: assignAmount ? Number(assignAmount) : showAssign.amount,
            });
            setBookings(prev => prev.map(b => b._id === data._id ? data : b));
            setShowAssign(null);
        } catch (e) { alert(e.response?.data?.message || "Error"); }
        finally { setSaving(false); }
    }

    async function doDelete() {
        try {
            await api.delete(`/bookings/${showDelete}`);
            setBookings(prev => prev.filter(b => b._id !== showDelete));
            setShowDelete(null);
        } catch (e) { alert(e.response?.data?.message || "Error"); }
    }

    /* ─── render ─── */
    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Bookings</h1>
                    <p className="text-white/40 text-sm">{filtered.length} total</p>
                </div>
                <button
                    onClick={() => { setForm(EMPTY_FORM); setShowForm(true); }}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-xl text-sm transition"
                >
                    <Plus size={16} /> New Booking
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                        value={query}
                        onChange={e => { setQuery(e.target.value); setPage(1); }}
                        placeholder="Search name, email, location…"
                        className="w-full bg-[#1e2435] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => { setStatus(e.target.value); setPage(1); }}
                    className="bg-[#1e2435] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
                >
                    <option value="all">All Status</option>
                    <option value="unassigned">Unassigned</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-[#1e2435] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                                <th className="px-5 py-3 text-left">Customer</th>
                                <th className="px-5 py-3 text-left">Service</th>
                                <th className="px-5 py-3 text-left">Route</th>
                                <th className="px-5 py-3 text-left">Date</th>
                                <th className="px-5 py-3 text-left">Driver</th>
                                <th className="px-5 py-3 text-left">Amount</th>
                                <th className="px-5 py-3 text-left">Status</th>
                                <th className="px-5 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {page_data.length === 0 && (
                                <tr><td colSpan={8} className="text-center py-12 text-white/30">No bookings found</td></tr>
                            )}
                            {page_data.map(b => {
                                const { label, cls } = badge(b.status, b.assignedDriver);
                                const driver = b.assignedDriver;
                                return (
                                    <tr key={b._id} className="hover:bg-white/5 transition">
                                        <td className="px-5 py-3">
                                            <div className="font-medium text-white">{b.firstName} {b.lastName}</div>
                                            <div className="text-white/40 text-xs">{b.email}</div>
                                        </td>
                                        <td className="px-5 py-3 text-white/70">{b.service}</td>
                                        <td className="px-5 py-3">
                                            <div className="text-white/80 text-xs">{b.pickupLocation}</div>
                                            <div className="text-white/40 text-xs">→ {b.dropLocation}</div>
                                        </td>
                                        <td className="px-5 py-3 text-white/60 text-xs">
                                            {new Date(b.pickupDate).toLocaleDateString()}<br />
                                            {b.pickupTime}
                                        </td>
                                        <td className="px-5 py-3 text-white/60 text-xs">
                                            {driver
                                                ? <span className="text-green-400">{driver.firstName} {driver.lastName}</span>
                                                : <span className="text-red-400">None</span>
                                            }
                                        </td>
                                        <td className="px-5 py-3 text-amber-400 font-medium">
                                            {b.amount ? `BHD ${Number(b.amount).toFixed(2)}` : "—"}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${cls}`}>{label}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setShowView(b)} title="View"
                                                    className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition">
                                                    <Eye size={14} />
                                                </button>
                                                <button onClick={() => { setShowAssign(b); setAssignDriverId(driver?._id || ""); setAssignAmount(b.amount || ""); }} title="Assign Driver"
                                                    className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition">
                                                    <UserCheck size={14} />
                                                </button>
                                                <button onClick={() => setShowDelete(b._id)} title="Delete"
                                                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                        <span className="text-xs text-white/40">Page {page} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 transition">
                                <ChevronLeft size={16} />
                            </button>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 transition">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Modal: New Booking ── */}
            {showForm && (
                <Modal title="New Booking" onClose={() => setShowForm(false)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            ["First Name", "firstName"], ["Last Name", "lastName"],
                            ["Email", "email"], ["Phone", "contactNumber"],
                            ["Pickup Location", "pickupLocation"], ["Drop Location", "dropLocation"],
                            ["Pickup Date", "pickupDate", "date"], ["Pickup Time", "pickupTime", "time"],
                            ["Passengers", "passengers", "number"], ["Luggage", "luggage", "number"],
                            ["Amount (BHD)", "amount", "number"],
                        ].map(([label, key, type = "text"]) => (
                            <div key={key}>
                                <label className="text-xs text-white/50 mb-1 block">{label}</label>
                                <input
                                    type={type}
                                    value={form[key]}
                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                    className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                                />
                            </div>
                        ))}
                        <div>
                            <label className="text-xs text-white/50 mb-1 block">Service</label>
                            <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50">
                                {["Airport Transfer", "Hotel Transfer", "City Tour", "Corporate", "Chauffeur", "Other"].map(s => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-white/50 mb-1 block">Vehicle</label>
                            <select value={form.vehicle} onChange={e => setForm(f => ({ ...f, vehicle: e.target.value }))}
                                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50">
                                {["Sedan", "SUV", "Minibus", "Coach"].map(v => <option key={v}>{v}</option>)}
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-xs text-white/50 mb-1 block">Notes</label>
                            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                rows={2}
                                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 resize-none" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-5">
                        <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm text-white/60 hover:bg-white/5 transition">Cancel</button>
                        <button onClick={createBooking} disabled={saving}
                            className="px-5 py-2 rounded-xl text-sm bg-amber-500 hover:bg-amber-400 text-black font-semibold transition disabled:opacity-50">
                            {saving ? "Saving…" : "Create Booking"}
                        </button>
                    </div>
                </Modal>
            )}

            {/* ── Modal: View ── */}
            {showView && (
                <Modal title="Booking Details" onClose={() => setShowView(null)}>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                            ["Customer", `${showView.firstName} ${showView.lastName}`],
                            ["Email", showView.email],
                            ["Phone", `${showView.countryCode} ${showView.contactNumber}`],
                            ["Service", showView.service],
                            ["Vehicle", showView.vehicle],
                            ["Pickup", showView.pickupLocation],
                            ["Drop", showView.dropLocation],
                            ["Date", new Date(showView.pickupDate).toLocaleDateString()],
                            ["Time", showView.pickupTime],
                            ["Passengers", showView.passengers],
                            ["Luggage", showView.luggage],
                            ["Amount", showView.amount ? `BHD ${Number(showView.amount).toFixed(2)}` : "—"],
                            ["Status", showView.status],
                            ["Driver", showView.assignedDriver ? `${showView.assignedDriver.firstName} ${showView.assignedDriver.lastName}` : "Not assigned"],
                            ["Notes", showView.notes || "—"],
                        ].map(([k, v]) => (
                            <div key={k}>
                                <div className="text-white/40 text-xs">{k}</div>
                                <div className="text-white font-medium">{v}</div>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}

            {/* ── Modal: Assign Driver ── */}
            {showAssign && (
                <Modal title="Assign Driver" onClose={() => setShowAssign(null)}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-white/50 mb-1 block">Select Driver</label>
                            <select value={assignDriverId} onChange={e => setAssignDriverId(e.target.value)}
                                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50">
                                <option value="">— Choose driver —</option>
                                {drivers.map(d => (
                                    <option key={d._id} value={d._id}>
                                        {d.firstName} {d.lastName} ({d.vehicleType || "—"})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-white/50 mb-1 block">Amount (BHD)</label>
                            <input type="number" value={assignAmount} onChange={e => setAssignAmount(e.target.value)}
                                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-5">
                        <button onClick={() => setShowAssign(null)} className="px-4 py-2 rounded-xl text-sm text-white/60 hover:bg-white/5 transition">Cancel</button>
                        <button onClick={doAssign} disabled={saving}
                            className="px-5 py-2 rounded-xl text-sm bg-green-500 hover:bg-green-400 text-black font-semibold transition disabled:opacity-50">
                            {saving ? "Saving…" : "Assign"}
                        </button>
                    </div>
                </Modal>
            )}

            {/* ── Modal: Delete Confirm ── */}
            {showDelete && (
                <Modal title="Delete Booking?" onClose={() => setShowDelete(null)}>
                    <p className="text-white/60 text-sm">This action cannot be undone.</p>
                    <div className="flex justify-end gap-3 mt-5">
                        <button onClick={() => setShowDelete(null)} className="px-4 py-2 rounded-xl text-sm text-white/60 hover:bg-white/5 transition">Cancel</button>
                        <button onClick={doDelete} className="px-5 py-2 rounded-xl text-sm bg-red-500 hover:bg-red-400 text-white font-semibold transition">Delete</button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

/* ─── Reusable Modal wrapper ─── */
function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1e2435] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <h2 className="text-white font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition"><X size={18} /></button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}
