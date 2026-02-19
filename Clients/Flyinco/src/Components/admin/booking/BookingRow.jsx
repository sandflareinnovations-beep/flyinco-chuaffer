import React, { useState } from "react";
import { Settings, Eye, User, Trash, Car, MapPin, FileText } from "lucide-react";

function hashStringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return `#${"00000".substring(0, 6 - c.length) + c}`;
}
function initials(first = "", last = "") {
  return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase() || "?";
}

function statusBadge(status, assignedDriver) {
  const st = assignedDriver ? status : "unassigned";
  const colors = {
    unassigned: "bg-gray-200 text-gray-700",
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[st] || ""}`}>
      {st}
    </span>
  );
}

export default function BookingRow({ booking, handlers }) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div
      className="grid gap-4 px-4 py-4 items-start hover:bg-slate-50 dark:hover:bg-slate-800 transition"
      style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 96px" }}
    >
      {/* Customer */}
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-sm"
            style={{ backgroundColor: hashStringToColor(booking.firstName + booking.lastName) }}
          >
            {initials(booking.firstName, booking.lastName)}
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">
              {booking.firstName} {booking.lastName}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {booking.email}
            </div>
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} /> {booking.service}
          </span>
          <span className="inline-flex items-center gap-1">
            <Car size={12} /> {booking.passengers} pax
          </span>
          {statusBadge(booking.status, booking.assignedDriver)}
          <span className="inline-flex items-center gap-1">
            <User size={12} /> {booking.assignedDriver ? booking.assignedDriver.name : "Unassigned"}
          </span>
        </div>
      </div>

      {/* Pickup → Dropoff */}
      <div className="hidden sm:block text-sm">
        <div className="truncate font-medium">{booking.pickup}</div>
        <div className="truncate text-muted-foreground mt-1">{booking.dropoff}</div>
      </div>

      {/* Vehicle */}
      <div className="hidden md:block text-sm">
        <div className="font-medium">{booking.vehicleType}</div>
        <div className="text-xs text-muted-foreground mt-1">Luggage: {booking.luggage}</div>
        <div className="text-xs text-muted-foreground mt-1">
          Amount: {booking.amount != null ? `${booking.amount}` : "—"}
          {booking.invoiceIssued && (
            <span className="ml-2 text-green-600 font-medium text-[10px] border border-green-200 bg-green-50 px-1 rounded">
              Invoiced
            </span>
          )}
        </div>
      </div>

      {/* Date */}
      <div className="text-sm">
        <div className="font-medium">{new Date(booking.date).toLocaleDateString()}</div>
        <div className="text-xs text-muted-foreground mt-1">{booking.time}</div>
      </div>

      {/* Actions */}
      <div className="flex justify-end items-center relative">
        <button
          type="button"
          onClick={() => setOpenMenu((prev) => !prev)}
          className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Settings size={18} />
        </button>
        {openMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border rounded-md shadow-lg z-50">
            <button
              onClick={() => {
                handlers.openViewBooking(booking);
                setOpenMenu(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Eye size={14} /> View
            </button>
            <button
              onClick={() => {
                handlers.openAssignDialog(booking);
                setOpenMenu(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <User size={14} /> Assign driver
            </button>
            <button
              onClick={() => {
                handlers.promptDelete(booking);
                setOpenMenu(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center gap-2 text-red-600"
            >
              <Trash size={14} /> Delete
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // If already invoiced, we just download. If not, open dialog to create.
                if (booking.invoiceIssued) {
                  handlers.downloadInvoice(booking);
                } else {
                  handlers.openInvoiceDialog(booking);
                }
                setOpenMenu(false);
              }}
              className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-blue-600"
            >
              <FileText size={14} />
              {booking.invoiceIssued ? "Download Invoice" : "Issue Invoice"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
