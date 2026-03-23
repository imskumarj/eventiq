"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  FileText,
  Database,
  Activity,
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["admin", "sponsor", "organizer"] },
  { label: "Events", icon: Calendar, path: "/events", roles: ["admin", "organizer"] },
  { label: "Sponsors", icon: Users, path: "/sponsors", roles: ["admin", "organizer"] },
  { label: "Analytics", icon: BarChart3, path: "/analytics", roles: ["admin"] },
  { label: "Reports", icon: FileText, path: "/reports", roles: ["admin", "sponsor", "organizer"] },
  { label: "Data Ingestion", icon: Database, path: "/data-ingestion", roles: ["admin"] },
  { label: "System Metrics", icon: Activity, path: "/system-metrics", roles: ["admin"] },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-y-0 left-0 h-screen flex flex-col bg-sidebar border-r border-sidebar-border z-30 overflow-hidden"
    >
      {/* 🔥 HEADER */}
      <div className="h-16 py-4 flex items-center justify-between px-4 border-b border-sidebar-border gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl gradient-accent flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4 text-white" color="white" />
          </div>

          {!collapsed && (
            <span className="text-lg font-semibold text-sidebar-primary-foreground">
              EventIQ
            </span>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-sidebar-accent hover:bg-sidebar-accent/50 transition"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 🔥 NAV */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "gradient-accent text-white shadow-sm !text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"
              )}
            >
              <div className={cn(isActive && "text-white")}>
                <Icon
                  className="w-5 h-5"
                  color={isActive ? "white" : undefined}
                />
              </div>

              {!collapsed && (
                <span style={{ color: isActive ? "white" : undefined }}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 🔥 USER */}
      <div className="p-3 border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-sidebar-accent transition">
          <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-white">
            <span style={{ color: "white" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          {!collapsed && (
            <>
              <div className="flex-1">
                <p className="text-xs font-medium text-sidebar-primary-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-black/50 capitalize" color="black/50">
                  {user?.role.toUpperCase()}
                </p>
              </div>

              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="hover:text-white text-sidebar-muted"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.aside>
  );
}