import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  FileDown,
  Filter,
  History,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  formatLongTimestamp,
  getRiskLabel,
  getRiskTier,
} from "../lib/analysisUtils";

const filterOptions = [
  { key: "all", label: "All" },
  { key: "safe", label: "Safe" },
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
  { key: "critical", label: "Critical" },
];

function HistoryPage({
  history,
  selectedHistoryItem,
  historyQuery,
  historyFilter,
  onHistoryQueryChange,
  onHistoryFilterChange,
  onSelectHistoryItem,
  onDeleteHistoryItem,
  onClearHistory,
  onExportCsv,
  onExportPdf,
  onLoadIntoAnalyzer,
}) {
  const filteredHistory = useMemo(() => {
    const query = historyQuery.trim().toLowerCase();

    return history.filter((item) => {
      const score = Number(item.result?.risk_score ?? 0);
      const riskLabel =
        score >= 80
          ? "critical"
          : score >= 60
            ? "high"
            : score >= 40
              ? "medium"
              : score > 0
                ? "low"
                : "safe";
      const matchesFilter =
        historyFilter === "all" || historyFilter === riskLabel;
      const matchesQuery =
        !query ||
        item.message.toLowerCase().includes(query) ||
        String(item.result?.risk_score ?? "").includes(query);

      return matchesFilter && matchesQuery;
    });
  }, [history, historyFilter, historyQuery]);

  const selected = selectedHistoryItem ?? filteredHistory[0] ?? null;

  const summary = useMemo(() => {
    return history.reduce(
      (acc, item) => {
        const score = Number(item.result?.risk_score ?? 0);
        acc.total += 1;
        if (score >= 80) acc.critical += 1;
        if (score >= 60) acc.high += 1;
        return acc;
      },
      { total: 0, critical: 0, high: 0 },
    );
  }, [history]);

  return (
    <section className="view-shell history-view">
      <div className="page-topbar">
        <div>
          <p className="page-kicker">History</p>
          <h2>Investigation timeline</h2>
          <p className="page-subtitle">
            Search, filter, inspect, export, and re-open scans without losing
            your workflow context.
          </p>
        </div>
        <div className="history-actions">
          <motion.button
            type="button"
            className="secondary-button"
            onClick={() => onExportCsv(filteredHistory)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={15} /> CSV
          </motion.button>
          <motion.button
            type="button"
            className="secondary-button"
            onClick={() => onExportPdf(filteredHistory)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileDown size={15} /> PDF
          </motion.button>
          <motion.button
            type="button"
            className="danger-button"
            onClick={onClearHistory}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 size={15} /> Clear
          </motion.button>
        </div>
      </div>

      <div className="history-toolbar">
        <label className="history-search-shell">
          <Search size={15} />
          <input
            value={historyQuery}
            onChange={(event) => onHistoryQueryChange(event.target.value)}
            placeholder="Search messages, scores, or results"
          />
        </label>

        <div className="history-filter-row">
          <Filter size={15} />
          {filterOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`filter-chip ${historyFilter === option.key ? "active" : ""}`}
              onClick={() => onHistoryFilterChange(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="history-layout">
        <div className="history-list-shell glass-card">
          <div className="card-heading">
            <div>
              <p className="card-kicker">Timeline</p>
              <h3>{summary.total} scans recorded</h3>
            </div>
            <History size={16} />
          </div>

          <div className="timeline-list">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => {
                const score = Number(item.result?.risk_score ?? 0);
                const tier = getRiskTier(score);
                const active = selected?.id === item.id;

                return (
                  <motion.div
                    key={item.id}
                    className={`timeline-row ${active ? "active" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectHistoryItem(item)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelectHistoryItem(item);
                      }
                    }}
                    whileHover={{ y: -1 }}
                  >
                    <div className={`timeline-score risk-${tier.tier}`}>
                      {score}%
                    </div>
                    <div className="timeline-copy">
                      <strong>{item.message}</strong>
                      <span>{formatLongTimestamp(item.timestamp)}</span>
                    </div>
                    <div className="timeline-meta">
                      <span className={`status-pill ${tier.tier}`}>
                        {getRiskLabel(score)}
                      </span>
                      <button
                        type="button"
                        className="icon-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteHistoryItem(item);
                        }}
                        aria-label="Delete history item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="empty-state compact">
                <ShieldCheck size={18} />
                <span>
                  No analysis history yet. Run a scan to populate the timeline.
                </span>
              </div>
            )}
          </div>
        </div>

        <motion.aside
          className="history-detail-shell glass-card"
          whileHover={{ y: -2 }}
        >
          <div className="card-heading">
            <div>
              <p className="card-kicker">Selected scan</p>
              <h3>
                {selected
                  ? getRiskLabel(Number(selected.result?.risk_score ?? 0))
                  : "No selection"}
              </h3>
            </div>
            <Sparkles size={16} />
          </div>

          {selected ? (
            <div className="history-detail">
              <p>{selected.result?.explanation}</p>
              <div className="detail-grid">
                <div>
                  <span>Time</span>
                  <strong>{formatLongTimestamp(selected.timestamp)}</strong>
                </div>
                <div>
                  <span>Score</span>
                  <strong>{selected.result?.risk_score ?? 0}%</strong>
                </div>
                <div>
                  <span>Flags</span>
                  <strong>{selected.result?.red_flags?.length ?? 0}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>
                    {getRiskLabel(Number(selected.result?.risk_score ?? 0))}
                  </strong>
                </div>
              </div>

              <div className="detail-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => onLoadIntoAnalyzer(selected)}
                >
                  Load into analyzer <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state compact">
              <ShieldCheck size={18} />
              <span>Select a row to inspect the scan details.</span>
            </div>
          )}
        </motion.aside>
      </div>
    </section>
  );
}

export default memo(HistoryPage);
