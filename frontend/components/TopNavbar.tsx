"use client";

import { useAuth } from "../contexts/AuthContext";
import { Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-6 mt-4">

      {/* 🔍 SEARCH */}
      <div className="flex items-center gap-3 flex-1">
        <div className="relative max-w-lg w-full">

          <div className="flex items-center gap-2 px-3 h-10 rounded-xl border border-border bg-card shadow-sm focus-within:ring-2 focus-within:ring-accent/30">
            
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />

            <input
              type="text"
              placeholder="Search events, sponsors, reports..."
              className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
            />
            
          </div>
        </div>
      </div>

      {/* 🔔 ACTIONS */}
      <div className="flex items-center gap-3">

        {/* Notifications */}
        {/* <button className="relative w-12 h-12 flex items-center justify-center rounded-xl hover:bg-muted transition">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-accent rounded-full" />
        </button> */}

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition">
              <div
                className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-xs font-bold shadow-sm"
                style={{ color: "white" }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="w-3 h-3 hidden sm:block text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl border border-border shadow-xl"
            style={{ backgroundColor: "white" }}
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>

            <DropdownMenuItem
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="text-destructive text-xs px-3 py-2"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}