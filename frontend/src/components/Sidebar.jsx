import { memo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  ChevronDown,
  CircleUserRound,
  History,
  LayoutDashboard,
  MoonStar,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  SunMedium,
} from "lucide-react";
import "../styles/Sidebar.css";

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Analyze", icon: Search },
  { label: "History", icon: History },
  { label: "Statistics", icon: BarChart3 },
  { label: "Threat Intelligence", icon: ShieldAlert },
  { label: "Settings", icon: Settings },
];

function Sidebar({ activeItem, onNavigate, theme, onToggleTheme }) {
  return (
    <aside className="sidebar-shell">
      <div className="sidebar-brand">
        <div className="brand-mark">
          <Shield size={18} />
        </div>
        <div>
          <h1>ClearHook</h1>
          <p>Phishing Shield</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;

          return (
            <motion.button
              key={item.label}
              type="button"
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => onNavigate(item.label)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle visual theme"
        >
          {theme === "aurora" ? (
            <MoonStar size={16} />
          ) : (
            <SunMedium size={16} />
          )}
          <span>{theme === "aurora" ? "Aurora" : "Midnight"}</span>
        </button>

        <div className="profile-card">
          <div className="profile-avatar">
            <CircleUserRound size={18} />
          </div>
          <div className="profile-copy">
            <strong>Security Admin</strong>
            <span>Live Protection Active</span>
          </div>
          <button
            type="button"
            className="profile-action"
            aria-label="Notifications"
          >
            <Bell size={16} />
          </button>
          <ChevronDown size={14} className="profile-chevron" />
        </div>
      </div>
    </aside>
  );
}

export default memo(Sidebar);
