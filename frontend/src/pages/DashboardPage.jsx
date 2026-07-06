import { memo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Clock3,
  Flame,
  Layers3,
  MapPinned,
  Radar,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { formatLongTimestamp, formatCompactNumber } from "../lib/analysisUtils";

function DashboardPage({
  summary,
  recentActivity,
  analysis,
  loading,
  securityStatus,
  onQuickAnalyze,
}) {
  const statusTone = summary.threatsPrevented > 0 ? "critical" : "safe";

  return (
    <section className="view-shell dashboard-view">
      <div className="page-topbar">
        <div>
          <p className="page-kicker">Dashboard</p>
          <h2>Live security operations</h2>
          <p className="page-subtitle">
            Monitor phishing pressure, system health, and response posture in
            one place.
          </p>
        </div>
        <motion.button
          type="button"
          className="primary-button hero-cta"
          onClick={onQuickAnalyze}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Quick Analyze <ArrowRight size={16} />
        </motion.button>
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-stack">
          <motion.article
            className="glass-card hero-summary-card"
            whileHover={{ y: -3 }}
          >
            <div className="hero-summary-head">
              <div>
                <span className={`status-pill ${statusTone}`}>
                  <ShieldCheck size={14} /> Live protection active
                </span>
                <h3>Threat monitoring is online</h3>
                <p>
                  ClearHook is inspecting message patterns, suspicious
                  destinations, and sender behavior.
                </p>
              </div>
              <div className="hero-orb">
                <Shield size={24} />
              </div>
            </div>

            <div className="metric-strip">
              <div className="metric-tile">
                <span>Today&apos;s scans</span>
                <strong>{formatCompactNumber(summary.total)}</strong>
              </div>
              <div className="metric-tile danger">
                <span>Threats prevented</span>
                <strong>{formatCompactNumber(summary.threatsPrevented)}</strong>
              </div>
              <div className="metric-tile accent">
                <span>Average risk</span>
                <strong>{summary.averageRisk}%</strong>
              </div>
              <div className="metric-tile success">
                <span>Safe messages</span>
                <strong>{formatCompactNumber(summary.safeMessages)}</strong>
              </div>
            </div>

            <div className="hero-action-row">
              <button
                type="button"
                className="secondary-button"
                onClick={onQuickAnalyze}
              >
                Start scan <Sparkles size={15} />
              </button>
              <div className="hero-live-chip">
                <Radar size={14} />
                <span>{loading ? "Scanning..." : "System ready"}</span>
              </div>
            </div>
          </motion.article>

          <motion.article
            className="glass-card map-card"
            whileHover={{ y: -3 }}
          >
            <div className="card-heading">
              <div>
                <p className="card-kicker">Threat map</p>
                <h3>Attack surface overview</h3>
              </div>
              <MapPinned size={16} />
            </div>
            <div className="map-placeholder">
              <div className="map-grid" />
              <div className="map-node node-a" />
              <div className="map-node node-b" />
              <div className="map-node node-c" />
              <div className="map-node node-d" />
              <div className="map-copy">
                <Layers3 size={20} />
                <p>Placeholder threat map with active signal clusters</p>
              </div>
            </div>
          </motion.article>

          <div className="stat-grid">
            {[
              {
                label: "Live scans",
                value: summary.total,
                icon: Activity,
                tone: "accent",
              },
              {
                label: "Blocked threats",
                value: summary.threatsPrevented,
                icon: ShieldAlert,
                tone: "danger",
              },
              {
                label: "Stability",
                value: `${securityStatus.api}`,
                icon: Server,
                tone: "success",
              },
              {
                label: "Avg risk",
                value: `${summary.averageRisk}%`,
                icon: TrendingUp,
                tone: "neutral",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  className={`stat-card ${item.tone}`}
                  whileHover={{ y: -2 }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="dashboard-stack">
          <motion.article
            className="glass-card activity-card"
            whileHover={{ y: -3 }}
          >
            <div className="card-heading">
              <div>
                <p className="card-kicker">Recent activity</p>
                <h3>Signal stream</h3>
              </div>
              <Clock3 size={16} />
            </div>

            <div className="activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map((item) => {
                  const score = Number(item.result?.risk_score ?? 0);
                  const tone =
                    score >= 80
                      ? "critical"
                      : score >= 60
                        ? "high"
                        : score >= 40
                          ? "medium"
                          : "safe";
                  return (
                    <div key={item.id} className="activity-row">
                      <span className={`activity-score ${tone}`}>{score}%</span>
                      <div>
                        <strong>{item.message}</strong>
                        <span>{formatLongTimestamp(item.timestamp)}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state compact">
                  <Flame size={18} />
                  <span>
                    No scans yet. Run an analysis to populate the live stream.
                  </span>
                </div>
              )}
            </div>
          </motion.article>

          <motion.article
            className="glass-card health-card"
            whileHover={{ y: -3 }}
          >
            <div className="card-heading">
              <div>
                <p className="card-kicker">System health</p>
                <h3>Security posture</h3>
              </div>
              <ShieldCheck size={16} />
            </div>

            <div className="health-grid">
              {Object.entries(securityStatus).map(([label, value]) => (
                <div key={label} className="health-row">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="health-bars">
              {[82, 68, 94].map((value, index) => (
                <div key={index} className="health-bar-row">
                  <div className="health-bar-track">
                    <motion.span
                      className="health-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.6, delay: index * 0.08 }}
                    />
                  </div>
                  <span>{value}%</span>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            className="glass-card quick-note-card"
            whileHover={{ y: -3 }}
          >
            <div className="card-heading">
              <div>
                <p className="card-kicker">Action center</p>
                <h3>Focused workflow</h3>
              </div>
              <ArrowRight size={16} />
            </div>
            <p>
              Move directly to Analyze when you need a scan. The active view
              stays focused and animates smoothly.
            </p>
            <button
              type="button"
              className="secondary-button full"
              onClick={onQuickAnalyze}
            >
              Open analyzer <ArrowRight size={15} />
            </button>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

export default memo(DashboardPage);
