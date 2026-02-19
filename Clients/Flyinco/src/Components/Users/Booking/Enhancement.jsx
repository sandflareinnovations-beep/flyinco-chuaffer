import React from "react";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Checkbox } from "@/Components/ui/checkbox";

export default function Enhancements({
  sectionRef,
  data,
  update,
  toggleAddon,
  ADDONS,
}) {
  return (
    <section ref={sectionRef}>
      <h3 className="text-white/80 font-medium mb-3">Enhancements</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ADDONS.map((a) => (
          <label
            key={a.value}
            className="flex items-center gap-2 border border-white/20 rounded-2xl p-3 cursor-pointer bg-white/5"
          >
            <Checkbox
              checked={data.addons.includes(a.value)}
              onCheckedChange={() => toggleAddon(a.value)}
            />
            <span className="text-white">{a.label}</span>
          </label>
        ))}
      </div>

      <div className="mt-4">
        <Label htmlFor="notes" className="text-white/90">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Timing preferences, child seats (ages), language preference, special assistance..."
          className="min-h-[110px] bg-white/10 border-white/20 text-white placeholder-white/50"
          value={data.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </div>
    </section>
  );
}
