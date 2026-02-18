import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Download, FileText } from "lucide-react";

export default function StaffInvoices() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [downloading, setDownloading] = useState(null);

    useEffect(() => {
        api.get("/bookings")
            .then(r => setBookings(r.data.filter(b => b.amount > 0)))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = bookings.filter(b => {
        const q = query.toLowerCase();
        return `${b.firstName} ${b.lastName} ${b.email} ${b._id}`.toLowerCase().includes(q);
    });

    /* Generate a simple HTML invoice and trigger print/save as PDF */
    function downloadInvoice(b) {
        setDownloading(b._id);
        const driver = b.assignedDriver
            ? `${b.assignedDriver.firstName || ""} ${b.assignedDriver.lastName || ""}`.trim()
            : "Not Assigned";

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Invoice - ${b._id}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Arial, sans-serif; color: #222; padding: 40px; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:30px; }
    .company h2 { font-size:18px; color:#b45309; }
    .company p  { font-size:12px; color:#555; line-height:1.6; }
    .invoice-title { font-size:28px; font-weight:bold; color:#b45309; text-align:right; }
    .invoice-meta  { font-size:12px; color:#555; text-align:right; margin-top:4px; }
    hr { border:none; border-top:2px solid #f59e0b; margin:20px 0; }
    .section { margin-bottom:20px; }
    .section h3 { font-size:13px; text-transform:uppercase; color:#888; margin-bottom:8px; letter-spacing:.5px; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:8px 20px; }
    .field label { font-size:11px; color:#999; display:block; }
    .field span  { font-size:13px; font-weight:600; }
    table { width:100%; border-collapse:collapse; margin-top:10px; }
    th { background:#fef3c7; padding:10px; text-align:left; font-size:12px; }
    td { padding:10px; border-bottom:1px solid #eee; font-size:13px; }
    .total-row td { font-weight:bold; font-size:15px; color:#b45309; border-top:2px solid #f59e0b; }
    .footer { margin-top:40px; text-align:center; font-size:11px; color:#aaa; }
    @media print { body { padding:20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">
      <h2>Flyinco Travel &amp; Tourism W.L.L</h2>
      <p>CR.No. 167235-1<br/>
         A0227, Zubara Avenue, Awal Street<br/>
         Al Qudaybiyah 0308, Manama, Kingdom of Bahrain<br/>
         Phone: +973 33692021 / +973 35016007<br/>
         Email: limo@flyinco.com</p>
    </div>
    <div>
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-meta">
        <strong>Invoice #:</strong> ${b._id.slice(-8).toUpperCase()}<br/>
        <strong>Date:</strong> ${new Date().toLocaleDateString()}<br/>
        <strong>Status:</strong> ${b.status?.toUpperCase()}
      </div>
    </div>
  </div>
  <hr/>

  <div class="section">
    <h3>Customer Details</h3>
    <div class="grid">
      <div class="field"><label>Name</label><span>${b.firstName} ${b.lastName}</span></div>
      <div class="field"><label>Email</label><span>${b.email}</span></div>
      <div class="field"><label>Phone</label><span>${b.countryCode || ""} ${b.contactNumber}</span></div>
      <div class="field"><label>Passengers</label><span>${b.passengers}</span></div>
    </div>
  </div>

  <div class="section">
    <h3>Trip Details</h3>
    <div class="grid">
      <div class="field"><label>Service</label><span>${b.service}</span></div>
      <div class="field"><label>Vehicle</label><span>${b.vehicle}</span></div>
      <div class="field"><label>Pickup</label><span>${b.pickupLocation}</span></div>
      <div class="field"><label>Drop-off</label><span>${b.dropLocation}</span></div>
      <div class="field"><label>Date</label><span>${new Date(b.pickupDate).toLocaleDateString()}</span></div>
      <div class="field"><label>Time</label><span>${b.pickupTime}</span></div>
      <div class="field"><label>Driver</label><span>${driver}</span></div>
      <div class="field"><label>Flight No.</label><span>${b.flightNumber || "—"}</span></div>
    </div>
  </div>

  <div class="section">
    <h3>Billing</h3>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Details</th>
          <th style="text-align:right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${b.service}</td>
          <td>${b.pickupLocation} → ${b.dropLocation}</td>
          <td style="text-align:right">BHD ${Number(b.amount).toFixed(2)}</td>
        </tr>
        <tr class="total-row">
          <td colspan="2">Total</td>
          <td style="text-align:right">BHD ${Number(b.amount).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  ${b.notes ? `<div class="section"><h3>Notes</h3><p style="font-size:13px;color:#555">${b.notes}</p></div>` : ""}

  <div class="footer">
    Thank you for choosing Flyinco Limo — Luxury Chauffeur Services in Bahrain<br/>
    This is a computer-generated invoice.
  </div>
</body>
</html>`;

        const win = window.open("", "_blank");
        win.document.write(html);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); setDownloading(null); }, 500);
    }

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-white">Invoices</h1>
                <p className="text-white/40 text-sm">{filtered.length} invoices with amount set</p>
            </div>

            {/* Search */}
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name, email, booking ID…"
                className="w-full max-w-sm bg-[#1e2435] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
            />

            {/* List */}
            <div className="rounded-2xl bg-[#1e2435] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                                <th className="px-5 py-3 text-left">Invoice #</th>
                                <th className="px-5 py-3 text-left">Customer</th>
                                <th className="px-5 py-3 text-left">Service</th>
                                <th className="px-5 py-3 text-left">Date</th>
                                <th className="px-5 py-3 text-left">Amount</th>
                                <th className="px-5 py-3 text-left">Status</th>
                                <th className="px-5 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} className="text-center py-12 text-white/30">No invoices found</td></tr>
                            )}
                            {filtered.map(b => (
                                <tr key={b._id} className="hover:bg-white/5 transition">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-amber-400" />
                                            <span className="text-white/70 font-mono text-xs">{b._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="font-medium text-white">{b.firstName} {b.lastName}</div>
                                        <div className="text-white/40 text-xs">{b.email}</div>
                                    </td>
                                    <td className="px-5 py-3 text-white/70">{b.service}</td>
                                    <td className="px-5 py-3 text-white/50 text-xs">{new Date(b.pickupDate).toLocaleDateString()}</td>
                                    <td className="px-5 py-3 text-amber-400 font-bold">BHD {Number(b.amount).toFixed(2)}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                                                b.status === "cancelled" ? "bg-gray-500/20 text-gray-400" :
                                                    "bg-amber-500/20 text-amber-400"
                                            }`}>{b.status}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <button
                                            onClick={() => downloadInvoice(b)}
                                            disabled={downloading === b._id}
                                            className="flex items-center gap-1.5 text-xs bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                                        >
                                            <Download size={13} />
                                            {downloading === b._id ? "Opening…" : "Invoice"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
