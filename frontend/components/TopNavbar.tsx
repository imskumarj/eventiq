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
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search events, sponsors, reports..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />

          {searchOpen && (
            <div className="absolute top-12 left-0 right-0 bg-card rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">
                Press <kbd>⌘K</kbd> for quick search
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="relative w-10 h-10 flex items-center justify-center">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted">
              <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="w-3 h-3 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="text-destructive"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}