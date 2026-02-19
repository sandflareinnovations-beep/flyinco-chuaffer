import React from "react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Popover, PopoverTrigger, PopoverContent } from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar"; // OriginUI-styled calendar
import {
  Plane,
  MapPin,
  Plus,
  X,
  Users,
  BaggageClaim,
  Minus,
  Info,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";

export default function TripDetails({
  sectionRef,
  data,
  errors,
  update,
  SERVICES,
}) {
  const isAirport = data.service === "airport";

  // Ensure stops is always an array for rendering
  const stops = Array.isArray(data.stops) ? data.stops : [];

  const addStop = () => {
    const next = [...stops, ""];
    update("stops", next);
  };

  const updateStop = (index, value) => {
    const next = [...stops];
    next[index] = value;
    update("stops", next);
  };

  const removeStop = (index) => {
    const next = stops.filter((_, i) => i !== index);
    update("stops", next);
  };

  // --- Helpers (JS only) ---
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  // Date helpers
  const toISODate = (d) =>
    d instanceof Date && !isNaN(d) ? d.toISOString().slice(0, 10) : "";
  const fromISODate = (s) => {
    if (!s) return undefined;
    const [y, m, d] = s.split("-").map(Number);
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
  };
  const prettyDate = (s) => {
    const d = fromISODate(s);
    return d
      ? d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      : "Pick a date";
  };

  // Time helper: 15-min slots
  const timeOptions = React.useMemo(
    () =>
      Array.from({ length: 24 * 4 }, (_, i) => {
        const h = String(Math.floor(i / 4)).padStart(2, "0");
        const m = String((i % 4) * 15).padStart(2, "0");
        return `${h}:${m}`;
      }),
    []
  );
  // Dark theme styles for OriginUI/DayPicker (white text, subtle hovers)
  const calendarClassNames = {
    months: "flex flex-col sm:flex-row gap-4 p-3",
    month: "space-y-3",
    caption: "flex justify-center items-center relative text-white",
    caption_label: "text-sm font-medium text-white",
    nav: "space-x-1 flex items-center",
    nav_button:
      "h-7 w-7 rounded-md hover:bg-white/10 text-white disabled:opacity-40 disabled:hover:bg-transparent",
    nav_button_previous: "absolute left-1",
    nav_button_next: "absolute right-1",
    table: "w-full border-collapse",
    head_row: "flex",
    head_cell: "w-9 text-[0.75rem] font-normal text-white/60",
    row: "flex w-full mt-1.5",
    cell:
      "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
    day:
      "h-9 w-9 rounded-md text-white hover:bg-white/10 focus-visible:outline-none aria-selected:opacity-100",
    day_selected:
      "bg-white text-black hover:bg-white focus:bg-white",
    day_today:
      "ring-1 ring-white/40",
    day_outside:
      "text-white/30 aria-selected:bg-white/10 aria-selected:text-white",
    day_disabled: "text-white/30",
    day_range_middle: "bg-white/10",
    day_range_start: "bg-white text-black",
    day_range_end: "bg-white text-black",
  };


  // Passengers stepper
  const parsedPassengers = Number.isFinite(Number(data.passengers))
    ? Number(data.passengers)
    : 1;
  const setPassengers = (next) => {
    const val = clamp(Number(next) || 1, 1, 99);
    update("passengers", String(val));
  };
  const decPassengers = () => setPassengers(parsedPassengers - 1);
  const incPassengers = () => setPassengers(parsedPassengers + 1);

  // Luggage stepper
  const parsedLuggage = Number.isFinite(Number(data.luggage))
    ? Number(data.luggage)
    : 0;
  const setLuggage = (next) => {
    const val = clamp(Number(next) || 0, 0, 99);
    update("luggage", String(val));
  };
  const decLuggage = () => setLuggage(parsedLuggage - 1);
  const incLuggage = () => setLuggage(parsedLuggage + 1);

  return (
    <section ref={sectionRef}>
      <div className="flex items-center justify-between">
        <h3 className="text-white/80 font-medium mb-3">Trip Details</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Service */}
        <div>
          <Label className="text-white/90">Service</Label>
          <Select value={data.service} onValueChange={(v) => update("service", v)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Choose a service" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-white/20">
              {SERVICES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.service && (
            <p className="text-sm text-red-400 mt-1">{errors.service}</p>
          )}
        </div>

        {/* Airport arrival/departure toggle (only for airport) */}
        {isAirport && (
          <div>
            <Label className="text-white/90 flex items-center gap-2">
              <Plane className="w-4 h-4" /> Airport Trip
            </Label>
            <RadioGroup
              className="mt-2 grid grid-cols-2 gap-3"
              value={data.tripType}
              onValueChange={(v) => update("tripType", v)}
            >
              <div className="flex items-center space-x-2 border border-white/20 rounded-2xl p-3 bg-white/5">
                <RadioGroupItem value="arrival" id="arrival" />
                <Label htmlFor="arrival" className="text-white">
                  Arrival
                </Label>
              </div>
              <div className="flex items-center space-x-2 border border-white/20 rounded-2xl p-3 bg-white/5">
                <RadioGroupItem value="departure" id="departure" />
                <Label htmlFor="departure" className="text-white">
                  Departure
                </Label>
              </div>
            </RadioGroup>
            {errors.tripType && (
              <p className="text-sm text-red-400 mt-1">{errors.tripType}</p>
            )}
          </div>
        )}
      </div>

      {/* Bahrain airport departure reminder */}
      {isAirport && data.tripType === "departure" && (
        <div className="mt-4 rounded-2xl border border-white/20 bg-white/5 text-white p-4">
          <div className="flex gap-3">
            <div className="shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">
                Bahrain International Airport — Departure Tips
              </p>
              <ul className="list-disc pl-5 text-white/90 text-sm space-y-1">
                <li>
                  Arrive at the airport at least{" "}
                  <span className="font-semibold">3 hours</span> before your
                  flight.
                </li>
                <li>
                  Check-in typically{" "}
                  <span className="font-semibold">opens ~3 hours</span> before
                  scheduled departure.
                </li>
                <li>
                  Boarding gates usually{" "}
                  <span className="font-semibold">close ~20 minutes</span>{" "}
                  before departure.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Flight number (airport only) */}
      {isAirport && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="flightNumber" className="text-white/90">
              Flight Number
            </Label>
            <Input
              id="flightNumber"
              placeholder="e.g., EK203"
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
              value={data.flightNumber}
              onChange={(e) => update("flightNumber", e.target.value)}
            />
            {errors.flightNumber && (
              <p className="text-sm text-red-400 mt-1">{errors.flightNumber}</p>
            )}
          </div>
        </div>
      )}

      {/* Locations */}
      <div className="grid grid-cols-1 gap-4 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pickup" className="text-white/90 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Pickup Location
            </Label>
            <Input
              id="pickup"
              placeholder="Hotel / Residence / Landmark"
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
              value={data.pickupLocation}
              onChange={(e) => update("pickupLocation", e.target.value)}
            />
            {errors.pickupLocation && (
              <p className="text-sm text-red-400 mt-1">{errors.pickupLocation}</p>
            )}
          </div>
          <div>
            <Label htmlFor="drop" className="text-white/90 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Drop Location
            </Label>
            <Input
              id="drop"
              placeholder="Airport / Venue / Office"
              className="bg-white/10 border-white/20 text-white placeholder-white/50"
              value={data.dropLocation}
              onChange={(e) => update("dropLocation", e.target.value)}
            />
            {errors.dropLocation && (
              <p className="text-sm text-red-400 mt-1">{errors.dropLocation}</p>
            )}
          </div>
        </div>

        {/* Stops */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-white/90 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Stops (optional)
            </Label>
            <button
              type="button"
              onClick={addStop}
              className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm border border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4" /> Add stop
            </button>
          </div>

          {stops.length > 0 && (
            <div className="mt-2 space-y-2">
              {stops.map((stop, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    placeholder={`Stop ${i + 1} (optional)`}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 flex-1"
                    value={stop}
                    onChange={(e) => updateStop(i, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeStop(i)}
                    aria-label="Remove stop"
                    className="inline-flex items-center justify-center rounded-xl p-2 border border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.stops && (
            <p className="text-sm text-red-400 mt-1">{errors.stops}</p>
          )}
        </div>
      </div>

      {/* Timing (modern pickers with right-aligned icons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {/* Pickup Date */}
        <div>
          <Label className="text-white/90">Date of Pickup</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/10"
              >
                <span className="truncate text-left">
                  {prettyDate(data.pickupDate)}
                </span>
                <CalendarIcon className="w-4 h-4 shrink-0 opacity-80" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 bg-gray-900 border-white/20 text-white"
              align="start"
            >
              <Calendar
                mode="single"
                selected={fromISODate(data.pickupDate)}
                onSelect={(d) => update("pickupDate", toISODate(d))}
                initialFocus
                className="bg-transparent"
                classNames={{
                  months: "flex flex-col sm:flex-row gap-4 p-3",
                  month: "space-y-3",
                  caption: "flex justify-center items-center relative text-white",
                  caption_label: "text-sm font-medium text-white",
                  nav: "space-x-1 flex items-center",
                  nav_button:
                    "h-7 w-7 rounded-md hover:bg-white/10 text-white disabled:opacity-40 disabled:hover:bg-transparent",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse",
                  head_row: "flex",
                  head_cell: "w-9 text-[0.75rem] font-normal text-white/60",
                  row: "flex w-full mt-1.5",
                  cell:
                    "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                  day:
                    "h-9 w-9 rounded-md text-white hover:bg-white/10 focus-visible:outline-none aria-selected:opacity-100",
                  day_selected:
                    "bg-white text-black hover:bg-white focus:bg-white",
                  day_today: "ring-1 ring-white/40",
                  day_outside:
                    "text-white/30 aria-selected:bg-white/10 aria-selected:text-white",
                  day_disabled: "text-white/30",
                  day_range_middle: "bg-white/10",
                  day_range_start: "bg-white text-black",
                  day_range_end: "bg-white text-black",
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.pickupDate && (
            <p className="text-sm text-red-400 mt-1">{errors.pickupDate}</p>
          )}
        </div>


        {/* Pickup Time */}
        <div>
          <Label className="text-white/90">Time of Pickup</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/10"
              >
                <span className="truncate text-left">
                  {data.pickupTime || "Select time"}
                </span>
                <Clock className="w-4 h-4 shrink-0 opacity-80" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="bg-gray-900 border-white/20 text-white p-2 w-[240px]"
              align="start"
            >
              <div className="max-h-64 overflow-auto space-y-1">
                {timeOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update("pickupTime", t)}
                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-white/10 ${data.pickupTime === t ? "bg-white/10" : ""
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          {errors.pickupTime && (
            <p className="text-sm text-red-400 mt-1">{errors.pickupTime}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {/* Drop Date */}
        <div>
          <Label className="text-white/90">Date of Drop</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/10"
              >
                <span className="truncate text-left">
                  {prettyDate(data.dropDate)}
                </span>
                <CalendarIcon className="w-4 h-4 shrink-0 opacity-80" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 bg-gray-900 border-white/20 text-white"
              align="start"
            >
              <Calendar
                mode="single"
                selected={fromISODate(data.dropDate)}
                onSelect={(d) => update("dropDate", toISODate(d))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dropDate && (
            <p className="text-sm text-red-400 mt-1">{errors.dropDate}</p>
          )}
        </div>
      </div>

      {/* Pax & Luggage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {/* Passengers stepper (native spinners removed) */}
        <div>
          <Label htmlFor="passengers" className="text-white/90 flex items-center gap-2">
            <Users className="w-4 h-4" /> Number of Passengers
          </Label>

          <div className="mt-1 flex items-stretch rounded-2xl overflow-hidden border border-white/20 bg-white/5">
            <button
              type="button"
              onClick={decPassengers}
              aria-label="Decrease passengers"
              className="px-3 py-2 text-white hover:bg-white/10 focus:outline-none"
            >
              <Minus className="w-4 h-4" />
            </button>

            <Input
              id="passengers"
              type="number"
              min={1}
              max={99}
              inputMode="numeric"
              className="bg-transparent border-0 text-center text-white placeholder-white/50 focus-visible:ring-0
                         [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              value={parsedPassengers}
              onChange={(e) => setPassengers(e.target.value)}
            />

            <button
              type="button"
              onClick={incPassengers}
              aria-label="Increase passengers"
              className="px-3 py-2 text-white hover:bg-white/10 focus:outline-none"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {errors.passengers && (
            <p className="text-sm text-red-400 mt-1">{errors.passengers}</p>
          )}
        </div>

        {/* Luggage stepper (matches passengers; native spinners removed) */}
        <div>
          <Label htmlFor="luggage" className="text-white/90 flex items-center gap-2">
            <BaggageClaim className="w-4 h-4" /> Number of Luggage
          </Label>

          <div className="mt-1 flex items-stretch rounded-2xl overflow-hidden border border-white/20 bg-white/5">
            <button
              type="button"
              onClick={decLuggage}
              aria-label="Decrease luggage"
              className="px-3 py-2 text-white hover:bg-white/10 focus:outline-none"
            >
              <Minus className="w-4 h-4" />
            </button>

            <Input
              id="luggage"
              type="number"
              min={0}
              max={99}
              inputMode="numeric"
              className="bg-transparent border-0 text-center text-white placeholder-white/50 focus-visible:ring-0
                         [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              value={parsedLuggage}
              onChange={(e) => setLuggage(e.target.value)}
            />

            <button
              type="button"
              onClick={incLuggage}
              aria-label="Increase luggage"
              className="px-3 py-2 text-white hover:bg-white/10 focus:outline-none"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {errors.luggage && (
            <p className="text-sm text-red-400 mt-1">{errors.luggage}</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* Optional (global.css): hide number arrows in Firefox too
input[type="number"] { -moz-appearance: textfield; }
*/
