import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, BarChart3, FileText,
  Database, Activity, Zap, ChevronLeft, LogOut, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard', roles: ['admin', 'sponsor', 'organizer'] },
  { label: 'Events', icon: <Calendar className="w-5 h-5" />, path: '/events', roles: ['admin', 'organizer'] },
  { label: 'My Events', icon: <Calendar className="w-5 h-5" />, path: '/events', roles: ['sponsor'] },
  { label: 'Sponsors', icon: <Users className="w-5 h-5" />, path: '/sponsors', roles: ['admin', 'organizer'] },
  { label: 'Analytics Engine', icon: <BarChart3 className="w-5 h-5" />, path: '/analytics', roles: ['admin'] },
  { label: 'ROI Analytics', icon: <TrendingUp className="w-5 h-5" />, path: '/analytics', roles: ['sponsor'] },
  { label: 'Reports', icon: <FileText className="w-5 h-5" />, path: '/reports', roles: ['admin', 'sponsor', 'organizer'] },
  { label: 'Data Ingestion', icon: <Database className="w-5 h-5" />, path: '/data-ingestion', roles: ['admin'] },
  { label: 'System Metrics', icon: <Activity className="w-5 h-5" />, path: '/system-metrics', roles: ['admin'] },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const filteredItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="h-screen sticky top-0 flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden z-30"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="text-lg font-bold text-sidebar-primary-foreground">EventIQ</span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center mx-auto">
            <Zap className="w-4 h-4 text-accent-foreground" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-md flex items-center justify-center text-sidebar-muted hover:text-sidebar-primary-foreground hover:bg-sidebar-accent transition-colors"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className={cn(isActive && "text-sidebar-primary")}>{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="whitespace-nowrap overflow-hidden">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-accent-foreground flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-primary-foreground truncate">{user?.name}</p>
                <p className="text-xs text-sidebar-muted capitalize">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button onClick={() => { logout(); navigate('/login'); }} className="text-sidebar-muted hover:text-sidebar-primary-foreground transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
