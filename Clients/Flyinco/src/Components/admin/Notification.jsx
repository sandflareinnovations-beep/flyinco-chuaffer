import React, { useMemo } from "react";
import { Bell, CheckCircle2, AlertTriangle, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotificationBell({
  items = [],
  onItemClick,
  onMarkAllRead,
  dir = document?.documentElement?.dir || "ltr",
}) {
  const unreadCount = useMemo(() => items.filter(n => !n.read).length, [items]);

  const TypeIcon = ({ type, className }) => {
    if (type === "warning") return <AlertTriangle className={className} />;
    if (type === "success") return <CheckCircle2 className={className} />;
    return <CalendarCheck className={className} />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 transition outline-none"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 leading-5 min-w-[18px] text-center">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      {/* Flip alignment for RTL */}
      <DropdownMenuContent
        side="bottom"
        align={dir === "rtl" ? "start" : "end"}
        sideOffset={8}
        className="w-80 rounded-xl"
      >
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          <button
            className="text-xs text-blue-600 hover:underline"
            onClick={() => onMarkAllRead?.()}
          >
            Mark all as read
          </button>
        </div>
        <DropdownMenuSeparator />

        {items.length === 0 ? (
          <div className="px-3 py-6 text-sm text-gray-500">No notifications</div>
        ) : (
          <ScrollArea className="max-h-80">
            <ul className="py-1">
              {items.map((n) => (
                <li key={n.id}>
                  <DropdownMenuItem
                    onClick={() => onItemClick?.(n)}
                    className={cn(
                      "cursor-pointer focus:bg-gray-50",
                      !n.read && "bg-gray-50"
                    )}
                  >
                    <div className="mr-3 rtl:ml-3 rtl:mr-0 mt-0.5">
                      <TypeIcon
                        type={n.type}
                        className={cn(
                          "w-4 h-4",
                          n.type === "warning"
                            ? "text-amber-600"
                            : n.type === "success"
                            ? "text-green-600"
                            : "text-gray-600"
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{n.title}</p>
                      {n.message && (
                        <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                      )}
                      {n.time && (
                        <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
                      )}
                    </div>
                    {!n.read && (
                      <span className="ml-2 rtl:mr-2 rtl:ml-0 w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </DropdownMenuItem>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
