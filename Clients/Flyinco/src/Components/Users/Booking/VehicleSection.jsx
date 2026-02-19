import React from "react";
import { Label } from "@/Components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/Components/ui/select";
import { CheckCircle2 } from "lucide-react";

function VehicleCard({ item, selected, selectedModel, onSelect, onSelectModel }) {
  const Icon = item.icon;
  const isSelected = selected === item.value;

  return (
    <div
      className={[
        "rounded-2xl border p-4 transition bg-white/5 border-white/20",
        isSelected ? "ring-2 ring-white/70" : "ring-0",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => onSelect(item.value)}
        className="w-full text-left flex items-center gap-4"
      >
        <div className="p-3 rounded-xl bg-white/10">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-white font-medium">{item.label}</p>
            <span className="text-white/60 text-sm">• {item.caption}</span>
          </div>
        </div>
        {isSelected && <CheckCircle2 className="w-5 h-5 text-white" />}
      </button>

      {isSelected && (
        <div className="mt-3">
          <Label className="text-white/90">Specific Vehicle (optional)</Label>
          <Select value={selectedModel || "none"} onValueChange={onSelectModel}>
            <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="No preference" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-white/20">
              <SelectItem value="none">No preference</SelectItem>
              {item.models.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

export default function VehicleSection({
  sectionRef,
  data,
  errors,
  update,
  VEHICLES,
}) {
  return (
    <section ref={sectionRef}>
      <h3 className="text-white/80 font-medium mb-3">Vehicle Selection</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VEHICLES.map((v) => (
          <VehicleCard
            key={v.value}
            item={v}
            selected={data.vehicle}
            selectedModel={data.vehicle === v.value ? data.vehicleModel : "none"}
            onSelect={(val) => update("vehicle", val)}
            onSelectModel={(model) => update("vehicleModel", model)}
          />
        ))}
      </div>
      {errors.vehicle && <p className="text-sm text-red-400 mt-3">{errors.vehicle}</p>}
    </section>
  );
}
