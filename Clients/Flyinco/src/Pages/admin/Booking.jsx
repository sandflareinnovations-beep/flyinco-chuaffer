import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Plus, Download } from "lucide-react";

import BookingTable from "../../Components/admin/booking/BookingTable";
import BookingDialogs from "../../Components/admin/booking/BookingDialogs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import api from "../../lib/api";

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [assignForm, setAssignForm] = useState({
    driverId: "",
    driverName: "",
    vehicleType: "",
    amount: "",
  });

  const [viewingBooking, setViewingBooking] = useState(null);

  // UI states
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false); // NEW
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  // ---------------- NEW: Report Dialog State ----------------
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportType, setReportType] = useState("monthly");
  const [reportMonth, setReportMonth] = useState("");
  const [reportYear, setReportYear] = useState("");

  // filters
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_desc");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const pageSize = 8;

  /** ---------------- HELPERS ---------------- **/
  function normalizeBooking(b) {
    return {
      _id: b._id,
      user: b.user,
      firstName: b.firstName,
      lastName: b.lastName,
      email: b.email,
      countryCode: b.countryCode,
      phone: b.contactNumber,
      service: b.service,
      pickup: b.pickupLocation,
      dropoff: b.dropLocation,
      stops: b.stops || [],
      date: b.pickupDate,
      time: b.pickupTime,
      passengers: b.passengers,
      luggage: b.luggage,
      vehicleType: b.vehicle,
      vehicleModel: b.vehicleModel,
      enhancements: {
        childSeat: b.addons?.includes("child_seat") ? [{ age: 3 }] : [],
        meetAndGreet: b.addons?.includes("meet_greet") || false,
        extraLuggage: b.addons?.includes("extra_luggage") || false,
        wifi: b.addons?.includes("wifi") || false,
        wheelchair: b.addons?.includes("wheelchair") || false,
        bottledWater: b.addons?.includes("bottled_water") || false,
      },
      preferences: { notes: b.notes || "" },
      status: b.status || "pending",
      amount: b.amount || null,
      assignedDriver: b.assignedDriver
        ? {
          id: b.assignedDriver._id,
          name: b.assignedDriver.name,
          phone: b.assignedDriver.phone,
          email: b.assignedDriver.email,
          licenseNumber: b.assignedDriver.licenseNumber,
          vehicleName: b.assignedDriver.vehicleName,
          vehicleModel: b.assignedDriver.vehicleModel,
          vehicleType: b.assignedDriver.vehicleType,
        }
        : null,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      invoiceIssued: b.invoiceIssued || false, // NEW
    };
  }

  function denormalizeBooking(f) {
    return {
      user: f.user,
      firstName: f.firstName,
      lastName: f.lastName,
      email: f.email,
      countryCode: f.countryCode,
      contactNumber: f.phone,
      service: f.service,
      pickupLocation: f.pickup,
      dropLocation: f.dropoff,
      stops: f.stops,
      pickupDate: f.date,
      pickupTime: f.time,
      passengers: f.passengers,
      luggage: f.luggage,
      vehicle: f.vehicleType,
      vehicleModel: f.vehicleModel,
      addons: [
        ...(f.enhancements?.childSeat?.length ? ["child_seat"] : []),
        ...(f.enhancements?.meetAndGreet ? ["meet_greet"] : []),
        ...(f.enhancements?.extraLuggage ? ["extra_luggage"] : []),
        ...(f.enhancements?.wifi ? ["wifi"] : []),
        ...(f.enhancements?.wheelchair ? ["wheelchair"] : []),
        ...(f.enhancements?.bottledWater ? ["bottled_water"] : []),
      ],
      notes: f.preferences?.notes || "",
      status: f.status,
      amount: f.amount,
      assignedDriver: f.assignedDriver ? f.assignedDriver.id : null,
    };
  }

  /** ---------------- API CALLS ---------------- **/
  async function fetchBookings() {
    try {
      const { data } = await api.get("/bookings");
      setBookings(data.map(normalizeBooking));
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  }

  async function fetchDrivers() {
    try {
      const { data } = await api.get("/auth/drivers");
      setDrivers(
        data.map((d) => ({
          id: d._id,
          name: d.name,
          phone: d.phone,
          email: d.email,
          licenseNumber: d.licenseNumber,
          vehicleName: d.vehicleName,
          vehicleModel: d.vehicleModel,
          vehicleType: d.vehicleType,
        }))
      );
    } catch (err) {
      console.error("Error fetching drivers:", err);
    }
  }

  async function addBooking(payload) {
    try {
      const backendPayload = denormalizeBooking(payload);
      const { data } = await api.post("/bookings", backendPayload);
      setBookings((prev) => [normalizeBooking(data), ...prev]);
      setOpenForm(false);
    } catch (err) {
      console.error("Error adding booking:", err);
    }
  }

  async function assignDriver(bookingId, payload) {
    try {
      const { data } = await api.put(`/bookings/${bookingId}/assign`, payload);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? normalizeBooking(data) : b))
      );
      setOpenAssign(false);
    } catch (err) {
      console.error("Error assigning driver:", err);
    }
  }

  async function deleteBooking(bookingId) {
    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      setOpenDelete(false);
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  }

  async function issueInvoice(bookingId) {
    if (!bookingId) {
      alert("Error: No booking ID selected");
      return;
    }
    try {
      const response = await api.post(`/bookings/${bookingId}/invoice`, {}, {
        responseType: 'blob'
      });

      // Check if response is actually JSON (error) disguised as Blob
      if (response.data.type === 'application/json') {
        const errorText = await response.data.text();
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || "Failed to generate invoice");
      }

      // Check if blob is empty
      if (response.data.size === 0) {
        throw new Error("Received empty PDF file");
      }

      // Generate filename properly
      const filename = `invoice-${bookingId}.pdf`;

      // Trigger download
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, invoiceIssued: true } : b))
      );
      setOpenInvoice(false);

    } catch (err) {
      console.error("Error issuing invoice:", err);
      alert(`Failed to issue invoice: ${err.message}`);
    }
  }

  async function downloadInvoice(booking) {
    if (!booking || !booking._id) return;
    try {
      const response = await api.post(`/bookings/${booking._id}/invoice`, {}, {
        responseType: 'blob'
      });

      // Check if response is actually JSON (error) disguised as Blob
      if (response.data.type === 'application/json') {
        const errorText = await response.data.text();
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || "Failed to download invoice");
      }

      // Check if blob is empty
      if (response.data.size === 0) {
        throw new Error("Received empty PDF file");
      }

      const filename = `invoice-${booking._id}.pdf`;
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Error downloading invoice:", err);
      alert(`Failed to download invoice: ${err.message}`);
    }
  }

  /** ---------------- NEW: DOWNLOAD REPORT ---------------- **/
  async function handleDownload() {
    try {
      const params = { type: reportType };

      if (reportType === "monthly") {
        if (!reportMonth) {
          alert("Please select a month first.");
          return;
        }
        params.month = reportMonth;
      } else {
        if (!reportYear) {
          alert("Please enter a year first.");
          return;
        }
        params.year = reportYear;
      }

      const res = await api.get("/bookings/report", {
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "booking-report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setOpenReportDialog(false);
    } catch (err) {
      console.error("Error downloading report:", err);
      alert("Failed to generate report. Check console for details.");
    }
  }

  /** ---------------- INIT ---------------- **/
  useEffect(() => {
    fetchBookings();
    fetchDrivers();
  }, []);

  /** ---------------- FILTERING + SORT ---------------- **/
  const filtered = useMemo(() => {
    let arr = bookings.slice();
    if (query.trim()) {
      arr = arr.filter((b) =>
        `${b.firstName} ${b.lastName} ${b.email} ${b.phone} ${b.pickup} ${b.dropoff}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      arr = arr.filter((b) => {
        const s = b.assignedDriver ? b.status : "unassigned";
        return s === statusFilter;
      });
    }
    if (sortBy === "created_desc") {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "created_asc") {
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    return arr;
  }, [bookings, query, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  /** ---------------- HANDLERS ---------------- **/
  function openViewBooking(b) {
    setViewingBooking(b);
    setOpenView(true);
  }

  function openAssignDialog(b) {
    setViewingBooking(b);
    setAssignForm({
      driverId: b.assignedDriver?.id || "",
      driverName: b.assignedDriver?.name || "",
      vehicleType: b.vehicleType || "",
      amount: b.amount || "",
    });
    setOpenAssign(true);
  }

  function promptDelete(b) {
    setTargetDeleteId(b._id);
    setOpenDelete(true);
  }

  function openInvoiceDialog(b) {
    setViewingBooking(b);
    setOpenInvoice(true);
  }

  function handleDeleteConfirmed() {
    if (targetDeleteId) {
      deleteBooking(targetDeleteId);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Booking Management</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setOpenReportDialog(true)}
          >
            <Download size={14} /> Download Report
          </Button>

          <Button
            onClick={() => setOpenForm(true)}
            className="flex items-center gap-2"
          >
            <Plus size={14} /> Add Booking
          </Button>
        </div>
      </div>

      {/* table */}
      <BookingTable
        bookings={paginated}
        query={query}
        sortBy={sortBy}
        statusFilter={statusFilter}
        page={page}
        totalPages={totalPages}
        handlers={{
          setQuery,
          setSortBy,
          setStatusFilter,
          setPage,
          openViewBooking,
          openAssignDialog,
          promptDelete,
          openInvoiceDialog, // NEW
          downloadInvoice, // NEW
        }}
      />

      {/* dialogs */}
      <BookingDialogs
        openForm={openForm}
        setOpenForm={setOpenForm}
        openView={openView}
        setOpenView={setOpenView}
        openAssign={openAssign}
        setOpenAssign={setOpenAssign}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        viewingBooking={viewingBooking}
        assignForm={assignForm}
        setAssignForm={setAssignForm}
        handleDeleteConfirmed={handleDeleteConfirmed}
        drivers={drivers}
        apiHandlers={{
          addBooking,
          assignDriver,
          issueInvoice, // NEW
        }}
        openInvoice={openInvoice} // NEW
        setOpenInvoice={setOpenInvoice} // NEW
      />

      {/* Report Dialog */}
      <Dialog open={openReportDialog} onOpenChange={setOpenReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Booking Report</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <select
              className="border px-2 py-1 rounded w-full"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            {reportType === "monthly" ? (
              <input
                type="month"
                className="border px-2 py-1 rounded w-full"
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
              />
            ) : (
              <input
                type="number"
                placeholder="Year"
                className="border px-2 py-1 rounded w-full"
                value={reportYear}
                onChange={(e) => setReportYear(e.target.value)}
              />
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setOpenReportDialog(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleDownload}>
              <Download size={14} /> Generate PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
