import React from "react";
import Navbar from "../../Components/Driver/Navbar";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Phone, Mail, Play, Map } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-8">
        {/* Summary Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Trips", value: 5, color: "from-blue-500 to-purple-600" },
            { label: "Completed", value: 3, color: "from-green-500 to-emerald-600" },
            { label: "Pending", value: 2, color: "from-yellow-500 to-orange-600" },
            { label: "Cancelled", value: 0, color: "from-red-500 to-pink-600" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`rounded-2xl shadow-lg bg-gradient-to-br ${stat.color} p-[1px]`}
            >
              <Card className="bg-gray-900 rounded-2xl h-full">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Upcoming Trips */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Upcoming Trips</h2>
          <div className="space-y-4">
            {[1, 2].map((trip) => (
              <Card
                key={trip}
                className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800"
              >
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold text-lg">Trip #{trip}</div>
                  <div className="text-sm text-gray-300">👤 Customer: John Doe</div>
                  <div className="text-sm text-gray-300">🟢 Pickup: Airport, 10:00 AM</div>
                  <div className="text-sm text-gray-300">🔴 Drop: Hotel Grand Palace</div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button size="sm" className="bg-blue-600 text-white">
                      <Phone className="w-4 h-4 mr-1" /> Call
                    </Button>
                    <Button size="sm" className="bg-yellow-600 text-white">
                      <Mail className="w-4 h-4 mr-1" /> Message
                    </Button>
                    <Button size="sm" className="bg-green-600 text-white">
                      <Play className="w-4 h-4 mr-1" /> Start
                    </Button>
                    <Button size="sm" className="bg-gray-700 text-white">
                      <Map className="w-4 h-4 mr-1" /> Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Notifications</h2>
          <Card className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800">
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                New booking assigned (2m ago)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Trip #123 marked as completed
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
