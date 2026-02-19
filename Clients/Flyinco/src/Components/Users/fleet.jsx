// src/Components/Users/fleet.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { Users, Luggage, ChevronLeft, ChevronRight } from "lucide-react";
import yukon from "../../assets/Cars/yukon.jpeg"
import tahoe from "../../assets/Cars/Cheverolet tahoe.jpg"
import Taurus from "../../assets/Cars/Ford Taurus.jpg"
import Territory from "../../assets/Cars/Ford Territory.jpg"
import bus from "../../assets/Cars/Mercedees bus.jpg"
import S_class from "../../assets/Cars/Mercedees S class front.jpg"
import sprinter from "../../assets/Cars/Mercedees sprinter.jpg"
import vito from "../../assets/Cars/Mercedees Vito 9.jpg"
import Bmw from "../../assets/Cars/BMW 7.jpg"


const vehicles = [
  {
    id: "gmc-yukon",
    name: "GMC Yukon",
    description:
      "Full-size premium SUV with spacious seating and modern amenities. Perfect for group or family transfers.",
    passengers: 7,
    luggage: 6,
    imageBase: yukon,
    alt: "Front angle view of GMC Yukon parked outdoors",
  },
  {
    id: "chevrolet-tahoe",
    name: "Chevrolet Tahoe",
    description:
      "A versatile SUV with ample space, comfort, and reliable performance for city or long trips.",
    passengers: 7,
    luggage: 6,
    imageBase: tahoe,
    alt: "Chevrolet Tahoe in a scenic background",
  },
  {
    id: "ford-taurus",
    name: "Ford Taurus",
    description:
      "Business-class sedan offering a smooth ride, roomy interior, and advanced safety features.",
    passengers: 4,
    luggage: 3,
    imageBase: Taurus,
    alt: "Ford Taurus sedan in daylight",
  },
  {
    id: "ford-territory",
    name: "Ford Territory",
    description:
      "Mid-size SUV with comfort, space, and smart technology. Ideal for urban and intercity travel.",
    passengers: 4,
    luggage: 4,
    imageBase: Territory,
    alt: "Ford Territory SUV parked near modern buildings",
  },
  {
    id: "bmw-7-series",
    name: "BMW 7 Series",
    description:
      "Luxury sedan with executive-class features, elegant interiors, and refined performance.",
    passengers: 4,
    luggage: 3,
    imageBase: Bmw,
    alt: "BMW 7 Series luxury sedan at night",
  },
  {
    id: "mercedes-s-class",
    name: "Mercedes-Benz S-Class",
    description:
      "Flagship luxury sedan with cutting-edge technology, comfort, and unmatched prestige.",
    passengers: 4,
    luggage: 3,
    imageBase: S_class,
    alt: "Mercedes-Benz S-Class parked elegantly",
  },
  {
    id: "mercedes-vito",
    name: "Mercedes-Benz Vito",
    description:
      "Premium MPV offering spacious seating, smooth ride, and practical flexibility for group travel.",
    passengers: 7,
    luggage: 7,
    imageBase: vito,
    alt: "Mercedes Vito van parked on roadside",
  },
  {
    id: "mercedes-sprinter",
    name: "Mercedes-Benz Sprinter",
    description:
      "Luxury van with configurable seating layouts, ideal for business groups and long journeys.",
    passengers: 15,
    luggage: 10,
    imageBase: sprinter,
    alt: "Mercedes Sprinter van in open area",
  },
  {
    id: "mercedes-bus",
    name: "Mercedes Multi Axle Bus",
    description:
      "Executive-class coach with premium comfort, recliner seating, and large capacity for group transfers.",
    passengers: 48,
    luggage: 40,
    imageBase: bus,
    alt: "Mercedes multi-axle bus on highway",
  },
];

function heroSrcSet(base) {
  const qs = (w) => `${base}?q=80&w=${w}&auto=format&fit=crop`;
  return `${qs(768)} 768w, ${qs(1024)} 1024w, ${qs(1440)} 1440w, ${qs(1920)} 1920w`;
}

export default function Fleet() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const selected = vehicles[selectedIndex];

  const stripRef = React.useRef(null);
  const thumbRefs = React.useRef([]);
  const didMount = React.useRef(false);

  const nextCar = () => setSelectedIndex((p) => (p + 1) % vehicles.length);
  const prevCar = () => setSelectedIndex((p) => (p === 0 ? vehicles.length - 1 : p - 1));

  React.useEffect(() => {
    const strip = stripRef.current;
    const el = thumbRefs.current[selectedIndex];
    if (!strip || !el) return;

    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    const targetLeft = el.offsetLeft - (strip.clientWidth - el.clientWidth) / 2;
    strip.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
  }, [selectedIndex]);

  return (
    <section id="fleet" className="w-full bg-black">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14">
        {/* Header */}
        <header className="mb-8 md:mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">Our Fleet</h1>
          <p className="mt-2 max-w-2xl mx-auto text-base md:text-lg text-white/70">
            Discover and book from our curated collection of luxury vehicles, crafted for comfort, style, and distinction.
          </p>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-2xl border border-slate-800">
          {/* LEFT: hero image */}
          <div className="lg:col-span-7 relative min-h-[320px] md:min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={selected.id}
                srcSet={heroSrcSet(selected.imageBase)}
                sizes="(min-width: 1024px) 56vw, 100vw"
                src={`${selected.imageBase}?q=80&w=1440&auto=format&fit=crop`}
                alt={selected.alt}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </AnimatePresence>
          </div>

          {/* RIGHT: details */}
          <div className="lg:col-span-5 flex flex-col bg-slate-900 p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id + "-info"}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col flex-1"
              >
                <h2 className="text-xl md:text-2xl font-semibold text-white">{selected.name}</h2>
                <p className="mt-3 text-white/80">{selected.description}</p>

                <Separator className="my-6 bg-white/10" />

                <div className="space-y-3">
                  <div className="text-sm font-medium text-white/90">Specification:</div>
                  <ul className="grid grid-cols-2 gap-3 text-white">
                    <Spec label="Passengers" value={selected.passengers} icon={<Users className="h-4 w-4" />} />
                    <Spec label="Luggage" value={selected.luggage} icon={<Luggage className="h-4 w-4" />} />
                  </ul>
                </div>

                <div className="mt-auto pt-6">
                  <Button
                    size="lg"
                    className="w-full bg-[#4b0082] text-white hover:bg-[#5c0aa0] rounded-2xl py-6 text-base"
                  >
                    Book Now
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Thumbnails + controls */}
        <div className="mt-6 md:mt-8">
          {/* Thumbnail strip */}
          <div
            ref={stripRef}
            className="flex gap-2 md:gap-3 overflow-hidden snap-x snap-mandatory pr-1"
          >
            {vehicles.map((v, idx) => {
              const active = idx === selectedIndex;
              return (
                <button
                  key={v.id}
                  ref={(el) => (thumbRefs.current[idx] = el)}
                  onClick={() => setSelectedIndex(idx)}
                  className={`group relative shrink-0 w-[200px] md:w-[240px] snap-start rounded-xl border transition ${active ? "border-white/70 ring-1 ring-white/50" : "border-slate-800 hover:border-slate-600"
                    }`}
                  aria-label={`Select ${v.name}`}
                >
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-xl">
                    <img
                      src={`${v.imageBase}?q=70&w=640&auto=format&fit=crop`}
                      alt={`Thumbnail of ${v.name}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 backdrop-blur-sm rounded-b-xl">
                    <div className="text-[13px] font-semibold text-white truncate">{v.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={prevCar}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label="Previous car"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextCar}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label="Next car"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Spec({ label, value, icon }) {
  return (
    <li className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-black/40 border-white/10 text-white">
        {icon}
      </span>
      <div>
        <div className="text-white/60 text-xs uppercase tracking-wide">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </li>
  );
}
