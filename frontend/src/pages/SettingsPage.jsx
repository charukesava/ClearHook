import { memo } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  MoonStar,
  SunMedium,
  ShieldCheck,
  Lock,
  Eye,
  Trash2,
  Database,
} from "lucide-react";

function SettingsPage({
  settings,
  theme,
  onToggleTheme,
  onSettingsChange,
  onResetHistory,
}) {
  const settingItems = [
    {
      key: "liveProtection",
      icon: ShieldCheck,
      title: "Live protection",
      description:
        "Keep scanning and risk scoring active while the dashboard runs.",
    },
    {
      key: "soundAlerts",
      icon: Bell,
      title: "Sound alerts",
      description:
        "Play a subtle alert when a scan returns a high or critical result.",
    },
    {
      key: "autoFocus",
      icon: Eye,
      title: "Auto focus analyzer",
      description:
        "Return users to the analyzer after imports or scan launches.",
    },
    {
      key: "telemetry",
      icon: Lock,
      title: "Anonymous telemetry",
      description:
        "Help improve the threat dashboard with anonymous usage insights.",
    },
    {
      key: "compactMode",
      icon: Database,
      title: "Compact mode",
      description:
        "Reduce spacing across the shell for a denser, higher information layout.",
    },
  ];

  return (
    <section className="view-shell settings-view">
      <div className="page-topbar">
        <div>
          <p className="page-kicker">Settings</p>
          <h2>Security and experience controls</h2>
          <p className="page-subtitle">
            Fine-tune alerting, appearance, and analyzer behavior without
            touching backend logic.
          </p>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={onToggleTheme}
        >
          {theme === "aurora" ? (
            <MoonStar size={15} />
          ) : (
            <SunMedium size={15} />
          )}{" "}
          Toggle theme
        </button>
      </div>

      <div className="settings-layout">
        <motion.article
          className="glass-card settings-card"
          whileHover={{ y: -2 }}
        >
          <div className="card-heading">
            <div>
              <p className="card-kicker">Experience</p>
              <h3>Preference switches</h3>
            </div>
            <Database size={16} />
          </div>

          <div className="settings-list">
            {settingItems.map((item) => {
              const Icon = item.icon;
              const checked = Boolean(settings[item.key]);
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`setting-row ${checked ? "active" : ""}`}
                  onClick={() => onSettingsChange(item.key, !checked)}
                >
                  <div className="setting-icon">
                    <Icon size={16} />
                  </div>
                  <div className="setting-copy">
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>
                  <span className="setting-switch">
                    {checked ? "On" : "Off"}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.article>

        <motion.article
          className="glass-card settings-card"
          whileHover={{ y: -2 }}
        >
          <div className="card-heading">
            <div>
              <p className="card-kicker">Behavior</p>
              <h3>Analyzer sensitivity</h3>
            </div>
            <ShieldCheck size={16} />
          </div>

          <div className="sensitivity-grid">
            {["balanced", "strict", "maximum"].map((mode) => (
              <button
                key={mode}
                type="button"
                className={`sensitivity-chip ${settings.sensitivity === mode ? "active" : ""}`}
                onClick={() => onSettingsChange("sensitivity", mode)}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="settings-note">
            <Lock size={15} />
            <p>
              Backend security already uses rate limiting, Helmet headers,
              strict CORS, and body size limits.
            </p>
          </div>

          <div className="settings-actions">
            <button
              type="button"
              className="danger-button"
              onClick={onResetHistory}
            >
              <Trash2 size={15} /> Reset history
            </button>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

export default memo(SettingsPage);
