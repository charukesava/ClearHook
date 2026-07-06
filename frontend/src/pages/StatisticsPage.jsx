import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, BarChart3, CircleGauge, TrendingUp } from "lucide-react";
import { buildTrendPoints } from "../lib/analysisUtils";

function StatisticsPage({
  history,
  summary,
  trendPoints,
  categoryCounts,
  statsRange,
  onRangeChange,
}) {
  const rangeSampleSize = statsRange === "week" ? 7 : 14;
  const rangeTrendPoints = useMemo(
    () => buildTrendPoints(history, rangeSampleSize),
    [history, rangeSampleSize],
  );
  const displayedTrendPoints = trendPoints.length
    ? rangeTrendPoints.length
      ? rangeTrendPoints
      : trendPoints
    : rangeTrendPoints;
  const maxTrend = Math.max(
    ...displayedTrendPoints.map((point) => point.score),
    100,
  );
  const categoryEntries = Object.entries(categoryCounts);

  const detectionAccuracy = useMemo(() => {
    if (!summary.total) return 0;
    return Math.max(72, 100 - Math.round(summary.averageRisk / 2));
  }, [summary.averageRisk, summary.total]);

  return (
    <section className="view-shell statistics-view">
      <div className="page-topbar">
        <div>
          <p className="page-kicker">Statistics</p>
          <h2>Behavioral analytics</h2>
          <p className="page-subtitle">
            View risk trends, threat categories, and report-ready summaries
            without leaving the dashboard.
          </p>
        </div>
        <div className="range-switcher">
          {["week", "month"].map((range) => (
            <button
              key={range}
              type="button"
              className={`filter-chip ${statsRange === range ? "active" : ""}`}
              onClick={() => onRangeChange(range)}
            >
              {range === "week" ? "Weekly" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="statistics-grid">
        <motion.article
          className="glass-card chart-card"
          whileHover={{ y: -2 }}
        >
          <div className="card-heading">
            <div>
              <p className="card-kicker">Risk trends</p>
              <h3>Scan pattern over time</h3>
            </div>
            <TrendingUp size={16} />
          </div>

          <div className="trend-chart">
            {displayedTrendPoints.length > 0 ? (
              displayedTrendPoints.map((point) => (
                <div
                  key={`${point.index}-${point.label}`}
                  className="trend-point"
                >
                  <div className="trend-line-track">
                    <motion.span
                      className="trend-line-fill"
                      initial={{ height: 0 }}
                      animate={{
                        height: `${Math.max((point.score / maxTrend) * 100, 12)}%`,
                      }}
                      transition={{ duration: 0.5, delay: point.index * 0.05 }}
                    />
                  </div>
                  <strong>{point.score}%</strong>
                  <span>{point.label}</span>
                </div>
              ))
            ) : (
              <div className="empty-state compact">
                <Activity size={18} />
                <span>Trend data will appear after a few scans.</span>
              </div>
            )}
          </div>
        </motion.article>

        <motion.article
          className="glass-card chart-card"
          whileHover={{ y: -2 }}
        >
          <div className="card-heading">
            <div>
              <p className="card-kicker">Threat categories</p>
              <h3>
                {statsRange === "week"
                  ? "Detected signal mix"
                  : "Expanded signal mix"}
              </h3>
            </div>
            <BarChart3 size={16} />
          </div>

          <div className="bar-chart">
            {categoryEntries.map(([label, value]) => (
              <div key={label} className="bar-row">
                <span>{label}</span>
                <div className="bar-track">
                  <motion.div
                    className="bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(value * 22, 100)}%` }}
                    transition={{ duration: 0.55 }}
                  />
                </div>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article
          className="glass-card gauge-card"
          whileHover={{ y: -2 }}
        >
          <div className="card-heading">
            <div>
              <p className="card-kicker">Detection accuracy</p>
              <h3>Model confidence estimate</h3>
            </div>
            <CircleGauge size={16} />
          </div>

          <div className="gauge-wrap">
            <svg
              viewBox="0 0 140 140"
              className="gauge-ring"
              aria-hidden="true"
            >
              <circle cx="70" cy="70" r="54" className="gauge-track" />
              <motion.circle
                cx="70"
                cy="70"
                r="54"
                className="gauge-fill"
                initial={{ strokeDashoffset: 339 }}
                animate={{
                  strokeDashoffset: 339 - (detectionAccuracy / 100) * 339,
                }}
                transition={{ duration: 0.9 }}
              />
            </svg>
            <div className="gauge-copy">
              <strong>{detectionAccuracy}%</strong>
              <span>Estimated accuracy</span>
            </div>
          </div>
        </motion.article>

        <motion.article
          className="glass-card report-card"
          whileHover={{ y: -2 }}
        >
          <div className="card-heading">
            <div>
              <p className="card-kicker">Reports</p>
              <h3>Weekly and monthly summaries</h3>
            </div>
            <Activity size={16} />
          </div>

          <div className="report-grid">
            <div className="report-tile">
              <span>Weekly risk</span>
              <strong>{summary.averageRisk}%</strong>
            </div>
            <div className="report-tile">
              <span>Monthly threats</span>
              <strong>{summary.threatsPrevented}</strong>
            </div>
            <div className="report-tile">
              <span>Safe rate</span>
              <strong>
                {summary.total
                  ? Math.round((summary.safeMessages / summary.total) * 100)
                  : 0}
                %
              </strong>
            </div>
            <div className="report-tile">
              <span>Scans</span>
              <strong>{history.length}</strong>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

export default memo(StatisticsPage);
