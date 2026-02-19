import React from "react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/Components/ui/select";
import { Phone, Mail, User } from "lucide-react";

export default function PersonalDetails({
  sectionRef,
  data,
  errors,
  update,
  COUNTRY_CODES,
}) {
  const selectedCountry =
    COUNTRY_CODES.find((c) => c.value === data.countryCode) || COUNTRY_CODES[0];

  return (
    <section ref={sectionRef}>
      <div className="flex items-center justify-between">
        <h3 className="text-white/80 font-medium mb-3">Your Details</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-white/90 flex items-center gap-2">
            <User className="w-4 h-4" /> First Name
          </Label>
          <Input
            id="firstName"
            placeholder="e.g., John"
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
            value={data.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />
          {errors.firstName && <p className="text-sm text-red-400 mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <Label htmlFor="lastName" className="text-white/90 flex items-center gap-2">
            <User className="w-4 h-4" /> Last Name
          </Label>
          <Input
            id="lastName"
            placeholder="e.g., Doe"
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
            value={data.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />
          {errors.lastName && <p className="text-sm text-red-400 mt-1">{errors.lastName}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="text-white/90 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email
          </Label>
          <Input
            id="email"
            placeholder="name@company.com"
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
          />
          {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label className="text-white/90 flex items-center gap-2">
            <Phone className="w-4 h-4" /> Mobile Number
          </Label>
          <div className="flex gap-2 items-center">
            <Select
              value={data.countryCode}
              onValueChange={(v) => update("countryCode", v)}
            >
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                {/* Only one flag shown via SelectValue (mirrors selected SelectItem) */}
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border-white/20">
                {COUNTRY_CODES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <span className="mr-2">{c.flag}</span> {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="5X XXX XXXX"
              className="bg-white/10 border-white/20 text-white placeholder-white/50 flex-1"
              value={data.contactNumber}
              onChange={(e) => update("contactNumber", e.target.value)}
            />
          </div>
          {errors.contactNumber && (
            <p className="text-sm text-red-400 mt-1">{errors.contactNumber}</p>
          )}
        </div>
      </div>
    </section>
  );
}
