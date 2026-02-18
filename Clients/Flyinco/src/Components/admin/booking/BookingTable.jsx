// src/components/admin/booking/BookingTable.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

import BookingRow from "./BookingRow";

export default function BookingTable({
  bookings,
  query,
  sortBy,
  statusFilter,
  page,
  totalPages,
  handlers,
}) {
  return (
    <Card className="shadow-sm">
      <CardContent>
        {/* toolbar */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-5xl mx-auto">
            {/* search */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border rounded-md px-3 py-1 flex-1 min-w-0">
              <Search size={16} className="text-muted-foreground" />
              <Input
                className="bg-transparent border-0 p-0 w-full min-w-0 text-sm"
                placeholder="Search name, email, phone, pickup or dropoff..."
                value={query}
                onChange={(e) => handlers.setQuery(e.target.value)}
              />
            </div>

            {/* sort by booking date */}
            <select
              value={sortBy}
              onChange={(e) => handlers.setSortBy(e.target.value)}
              className="w-48 text-sm rounded-md border px-3 py-2 bg-white/5"
            >
              <option value="created_desc"> Latest → Oldest</option>
              <option value="created_asc"> Oldest → Latest</option>
            </select>

            {/* filter by status */}
            <select
              value={statusFilter}
              onChange={(e) => handlers.setStatusFilter(e.target.value)}
              className="w-44 text-sm rounded-md border px-3 py-2 bg-white/5"
            >
              <option value="all">All Statuses</option>
              <option value="unassigned">Unassigned</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>
        </div>

        {/* table */}
        <div className="w-full overflow-hidden rounded-md border">
          {/* header */}
          <div
            className="grid items-center gap-4 px-4 py-3 text-sm font-medium text-muted-foreground bg-slate-50 dark:bg-slate-900"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 96px" }}
          >
            <div>Customer & Trip</div>
            <div className="hidden sm:block">Pickup → Dropoff</div>
            <div className="hidden md:block">Vehicle • Amount</div>
            <div>Date / Time</div>
            <div></div>
          </div>

          {/* rows */}
          <div className="divide-y">
            {bookings.length ? (
              bookings.map((b) => (
                <BookingRow key={b._id} booking={b} handlers={handlers} />
              ))
            ) : (
              <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                No bookings found
              </div>
            )}
          </div>
        </div>

        {/* pagination */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * 8 + (bookings.length ? 1 : 0)}–
            {(page - 1) * 8 + bookings.length} of {bookings.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handlers.setPage(page - 1)}
              disabled={page === 1}
            >
              Prev
            </Button>
            <div className="px-3 py-1 border rounded-md text-sm">
              {page} / {totalPages}
            </div>
            <Button
              size="sm"
              onClick={() => handlers.setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
