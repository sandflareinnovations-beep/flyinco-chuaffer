// src/Components/admin/booking/BookingDialogs.jsx
import React, { useMemo } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function BookingDialogs({
  openForm, setOpenForm,
  openView, setOpenView,
  openAssign, setOpenAssign,
  openDelete, setOpenDelete,
  viewingBooking,
  assignForm = { driverId: "", driverName: "", vehicleType: "", amount: "" },
  setAssignForm,
  handleDeleteConfirmed,
  drivers = [],
  apiHandlers = {},
}) {
  const { assignDriver, addBooking } = apiHandlers;

  const filteredDrivers = useMemo(() => {
    if (!assignForm?.vehicleType) return [];
    return drivers.filter(d => d.vehicleType === assignForm.vehicleType);
  }, [assignForm?.vehicleType, drivers]);

  const handleAssign = () => {
    if (!viewingBooking || !assignDriver) return;
    assignDriver(viewingBooking._id, {
      driverId: assignForm?.driverId || null,
      amount: assignForm?.amount || null,
    });
  };

  const handleAddBooking = (e) => {
    e.preventDefault();
    if (!addBooking) return;

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    addBooking({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      pickup: payload.pickup,
      dropoff: payload.dropoff,
      date: payload.date,
      time: payload.time,
      passengers: parseInt(payload.passengers, 10) || 1,
      preferences: { notes: payload.notes || "" },
    });
  };

  return (
    <>
      {/* 🔎 View Booking */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Booking Details</DialogTitle></DialogHeader>
          {viewingBooking ? (
            <div className="space-y-4">
              <p><strong>Name:</strong> {viewingBooking.firstName} {viewingBooking.lastName}</p>
              <p><strong>Email:</strong> {viewingBooking.email}</p>
              <p><strong>Phone:</strong> {viewingBooking.countryCode} {viewingBooking.phone}</p>
              <p><strong>Pickup:</strong> {viewingBooking.pickup}</p>
              <p><strong>Dropoff:</strong> {viewingBooking.dropoff}</p>
              <p><strong>Date:</strong> {viewingBooking.date}</p>
              <p><strong>Time:</strong> {viewingBooking.time}</p>
              <p><strong>Passengers:</strong> {viewingBooking.passengers}</p>
              <p><strong>Status:</strong> {viewingBooking.status}</p>
              <p><strong>Notes:</strong> {viewingBooking.preferences?.notes || "None"}</p>
            </div>
          ) : "No booking selected"}
        </DialogContent>
      </Dialog>

      {/* 🚗 Assign Driver */}
      <Dialog open={openAssign} onOpenChange={setOpenAssign}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign Driver</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Vehicle</Label>
              <select
                value={assignForm?.vehicleType || ""}
                onChange={(e) =>
                  setAssignForm({ ...(assignForm || {}), vehicleType: e.target.value, driverId: "", driverName: "" })
                }
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Select vehicle</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Minibus">Minibus</option>
                <option value="Coach">Coach</option>
              </select>
            </div>

            <div>
              <Label>Driver</Label>
              <select
                value={assignForm?.driverId || ""}
                onChange={(e) => {
                  const d = filteredDrivers.find(x => x.id === e.target.value);
                  setAssignForm({ ...(assignForm || {}), driverId: d?.id || "", driverName: d?.name || "" });
                }}
                className="w-full border rounded px-2 py-1"
                disabled={!assignForm?.vehicleType}
              >
                <option value="">Select driver</option>
                {filteredDrivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={assignForm?.amount || ""}
                onChange={(e) => setAssignForm({ ...(assignForm || {}), amount: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button onClick={() => setOpenAssign(false)}>Cancel</Button>
              <Button onClick={handleAssign}>Assign</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ❌ Delete Booking */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Booking?</DialogTitle></DialogHeader>
          <p className="text-red-600">This booking will be permanently deleted.</p>
          <DialogFooter>
            <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✏️ Create / Edit Booking */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Booking</DialogTitle></DialogHeader>
          <form onSubmit={handleAddBooking} className="space-y-3">
            <div>
              <Label>First Name</Label>
              <Input name="firstName" required />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input name="lastName" required />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" required />
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="phone" required />
            </div>
            <div>
              <Label>Pickup</Label>
              <Input name="pickup" required />
            </div>
            <div>
              <Label>Dropoff</Label>
              <Input name="dropoff" required />
            </div>
            <div>
              <Label>Date</Label>
              <Input name="date" type="date" required />
            </div>
            <div>
              <Label>Time</Label>
              <Input name="time" type="time" required />
            </div>
            <div>
              <Label>Passengers</Label>
              <Input name="passengers" type="number" min="1" defaultValue="1" />
            </div>
            <div>
              <Label>Notes</Label>
              <Input name="notes" placeholder="Special instructions" />
            </div>

            <DialogFooter>
              <Button type="button" onClick={() => setOpenForm(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
