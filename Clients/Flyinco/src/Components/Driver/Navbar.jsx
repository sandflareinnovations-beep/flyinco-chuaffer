import React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Bell, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Navbar() {
  return (
    <header className="w-full backdrop-blur-md bg-gray-900/70 border-b border-gray-800 text-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Mobile Hamburger + Brand */}
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="text-white hover:bg-gray-800 p-2"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-gray-900 text-white w-64 border-r border-gray-800"
            >
              <div className="p-4 font-bold text-lg border-b border-gray-700">
                Chauffeur Service
              </div>
              <nav className="flex flex-col p-4 gap-3">
                <Button variant="ghost" className="justify-start text-white">
                  🏠 Home
                </Button>
                <Button variant="ghost" className="justify-start text-white">
                  🚘 Trips
                </Button>
                <Button variant="ghost" className="justify-start text-white">
                  🔔 Notifications
                </Button>
                <Button variant="ghost" className="justify-start text-white">
                  👤 Profile
                </Button>
              </nav>
            </SheetContent>
          </Sheet>

          <span className="font-bold text-lg">Chauffeur Service</span>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Offline</span>
            <Switch defaultChecked />
            <span className="text-sm text-green-400">Online</span>
          </div>
          <Button
            variant="ghost"
            className="relative text-gray-300 hover:text-white"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <User className="w-7 h-7 text-gray-300" />
        </div>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden sm:flex items-center justify-center gap-8 py-2 bg-gray-900/60 border-t border-gray-800 backdrop-blur">
        <Button variant="ghost" className="text-gray-300 hover:text-white">
          Home
        </Button>
        <Button variant="ghost" className="text-gray-300 hover:text-white">
          Trips
        </Button>
        <Button variant="ghost" className="text-gray-300 hover:text-white">
          Notifications
        </Button>
        <Button variant="ghost" className="text-gray-300 hover:text-white">
          Profile
        </Button>
      </div>
    </header>
  );
}
