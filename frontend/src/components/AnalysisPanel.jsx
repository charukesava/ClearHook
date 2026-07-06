import { memo, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronDown,
  FileWarning,
  Globe,
  Lightbulb,
  Lock,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TriangleAlert,
  Bug,
  Eye,
  ChevronRight,
  Shield,
  Clock3,
  BrainCircuit,
} from "lucide-react";
import RiskMeter from "./RiskMeter";
import {
  buildRecommendations,
  buildThreatDetail,
  getRiskTier,
  groupRedFlags,
  summarizeAnalysis,
} from "../lib/analysisUtils";
import "../styles/AnalysisPanel.css";

const iconMap = {
  URLs: Globe,
  Domains: ShieldAlert,
  "Sensitive Information": Lock,
  Grammar: Bug,
  "Social Engineering": AlertTriangle,
};

function AnalysisPanel({ analysis, loading, message }) {
  const [openSections, setOpenSections] = useState(
    () => new Set(["Social Engineering"]),
  );
  const [visibleCount, setVisibleCount] = useState(0);
  const [scanIndex, setScanIndex] = useState(0);

  const groupedFlags = useMemo(
    () => groupRedFlags(analysis?.red_flags ?? []),
    [analysis?.red_flags],
  );
  const recommendations = useMemo(
    () => buildRecommendations(analysis),
    [analysis],
  );
  const score = Number(analysis?.risk_score ?? 0);
  const tier = getRiskTier(score);
  const summary = summarizeAnalysis(analysis);
  const scanSteps = [
    "Checking URLs...",
    "Checking Domains...",
    "Checking Sender...",
    "Running AI...",
    "Generating Report...",
    "Calculating Risk...",
  ];

  useEffect(() => {
    if (!loading) {
      setScanIndex(0);
      return undefined;
    }

    setScanIndex(0);
    const interval = window.setInterval(() => {
      setScanIndex((current) => Math.min(current + 1, scanSteps.length - 1));
    }, 650);

    return () => window.clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (!analysis || analysis.success === false || loading) {
      setVisibleCount(0);
      return undefined;
    }

    const cards = 6;
    setVisibleCount(1);
    const timers = Array.from({ length: cards - 1 }, (_, index) =>
      window.setTimeout(
        () => setVisibleCount((current) => Math.max(current, index + 2)),
        180 + index * 160,
      ),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [analysis, loading]);

  const toggleSection = (name) => {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  if (analysis?.success === false) {
    return (
      <div className="analysis-panel">
        <motion.div
          className="analysis-empty error-state glass-card"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TriangleAlert size={24} />
          <h3>Analysis unavailable</h3>
          <p>{analysis.error}</p>
        </motion.div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="analysis-panel">
        <motion.div
          className="analysis-empty glass-card"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ShieldCheck size={24} />
          <h3>Threat analysis will appear here</h3>
          <p>
            Run a scan to see the circular risk meter, red flags, explanation,
            and recommendations.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="analysis-panel">
      <motion.article
        className="analysis-card scan-card glass-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="panel-heading compact">
          <div>
            <p className="panel-kicker">AI scan</p>
            <h3>Professional scanning sequence</h3>
          </div>
          <Clock3 size={16} className="panel-mini-icon" />
        </div>

        {loading ? (
          <div className="scan-sequence">
            {scanSteps.map((step, index) => (
              <div
                key={step}
                className={`scan-step ${index <= scanIndex ? "active" : ""}`}
              >
                <span className="scan-dot" />
                <span>{step}</span>
              </div>
            ))}
            <div className="scan-progress">
              <motion.div
                className="scan-progress-fill"
                initial={{ width: 0 }}
                animate={{
                  width: `${((scanIndex + 1) / scanSteps.length) * 100}%`,
                }}
                transition={{ duration: 0.35 }}
              />
            </div>
          </div>
        ) : (
          <div className="scan-sequence complete">
            <div className="scan-step active">
              <span className="scan-dot" />
              <span>{summary}</span>
            </div>
          </div>
        )}
      </motion.article>

      <AnimatePresence initial={false}>
        {visibleCount >= 1 ? (
          <motion.div
            className="analysis-card explanation-card glass-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <div className="panel-heading compact">
              <div>
                <p className="panel-kicker">Risk score</p>
                <h3>Circular confidence meter</h3>
              </div>
              <span className={`risk-pill risk-${tier.tier}`}>
                {tier.label}
              </span>
            </div>
            <RiskMeter analysis={analysis} loading={loading} />
          </motion.div>
        ) : null}

        {visibleCount >= 2 ? (
          <motion.div
            className="analysis-card explanation-card glass-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <div className="panel-heading compact">
              <div>
                <p className="panel-kicker">Threat summary</p>
                <h3>What the model sees</h3>
              </div>
              <Shield size={16} className="panel-mini-icon" />
            </div>
            <div className="summary-copy">
              <p>{summary}</p>
              <div className="summary-meta">
                <span>Score {score}%</span>
                <span>{analysis.red_flags?.length ?? 0} flags</span>
                <span>{message?.length ?? 0} chars</span>
              </div>
            </div>
          </motion.div>
        ) : null}

        {visibleCount >= 3 ? (
          <motion.div
            className="analysis-card accordion-card glass-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <div className="panel-heading compact">
              <div>
                <p className="panel-kicker">Red flags</p>
                <h3>Threat details</h3>
              </div>
              <span className="counter-chip">
                {analysis.red_flags?.length ?? 0} signals
              </span>
            </div>

            <div className="accordion-stack">
              {groupedFlags.map((group) => {
                const Icon = iconMap[group.key] ?? FileWarning;
                const expanded = openSections.has(group.key);

                return (
                  <div
                    key={group.key}
                    className={`accordion-item ${expanded ? "expanded" : ""}`}
                  >
                    <button
                      type="button"
                      className="accordion-trigger"
                      onClick={() => toggleSection(group.key)}
                      aria-expanded={expanded}
                    >
                      <div className="accordion-title">
                        <span className="accordion-icon">
                          <Icon size={15} />
                        </span>
                        <div>
                          <strong>{group.label}</strong>
                          <span>{group.items.length} detected</span>
                        </div>
                      </div>
                      <ChevronDown size={15} className="accordion-chevron" />
                    </button>
                    <AnimatePresence initial={false}>
                      {expanded ? (
                        <motion.div
                          className="accordion-body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.24, ease: "easeOut" }}
                        >
                          {group.items.map((flag) => {
                            const detail = buildThreatDetail(flag);
                            return (
                              <motion.div
                                key={flag}
                                className="threat-detail-card"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <button
                                  type="button"
                                  className="threat-detail-trigger"
                                  onClick={() => toggleSection(flag)}
                                >
                                  <div>
                                    <strong>{flag}</strong>
                                    <span>{detail.severity}</span>
                                  </div>
                                  <ChevronRight size={15} />
                                </button>
                                {openSections.has(flag) ? (
                                  <div className="threat-detail-body">
                                    <p>{detail.description}</p>
                                    <div className="detail-bullets">
                                      <div>
                                        <span>Examples</span>
                                        <strong>
                                          {detail.examples.join(" · ")}
                                        </strong>
                                      </div>
                                      <div>
                                        <span>Suggested action</span>
                                        <strong>
                                          {detail.suggestedAction}
                                        </strong>
                                      </div>
                                    </div>
                                  </div>
                                ) : null}
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : null}

        {visibleCount >= 4 ? (
          <motion.div
            className="analysis-card recommendation-card glass-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <div className="panel-heading compact">
              <div>
                <p className="panel-kicker">Recommendations</p>
                <h3>Next best actions</h3>
              </div>
              <TimerReset size={16} className="panel-mini-icon" />
            </div>

            <div className="recommendation-timeline">
              {recommendations.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className={`timeline-item priority-${item.priority}`}
                >
                  <div className="timeline-icon">
                    <Lightbulb size={14} />
                  </div>
                  <div className="timeline-copy">
                    <div className="timeline-head">
                      <strong>{item.title}</strong>
                      <span>{item.priority}</span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="analysis-footer-note">
              <Mail size={14} />
              <span>{analysis.recommendation}</span>
            </div>
          </motion.div>
        ) : null}

        {visibleCount >= 5 ? (
          <motion.div
            className="analysis-card technical-card glass-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <div className="panel-heading compact">
              <div>
                <p className="panel-kicker">Technical details</p>
                <h3>Scan metadata</h3>
              </div>
              <BrainCircuit size={16} className="panel-mini-icon" />
            </div>

            <div className="technical-grid">
              {[
                ["Message length", `${message?.length ?? 0} characters`],
                ["Risk band", tier.label],
                ["Signal count", `${analysis.red_flags?.length ?? 0}`],
                ["Model response", "Gemini Flash"],
              ].map(([label, value]) => (
                <div key={label} className="technical-row">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default memo(AnalysisPanel);
