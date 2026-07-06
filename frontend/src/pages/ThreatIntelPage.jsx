import { memo } from "react";
import { motion } from "framer-motion";
import { Bug, Globe, Link, Lock, Mail, Radar, ShieldAlert } from "lucide-react";
import { buildCategoryCounts } from "../lib/analysisUtils";

const intelCards = [
  {
    title: "URL cloaking",
    icon: Link,
    note: "Shortened links, redirects, and hidden destinations.",
  },
  {
    title: "Domain spoofing",
    icon: Globe,
    note: "Lookalike domains, subdomain tricks, and brand mimicry.",
  },
  {
    title: "Credential harvest",
    icon: Lock,
    note: "OTP, password, and banking detail requests.",
  },
  {
    title: "Template abuse",
    icon: Mail,
    note: "Mass-mail language patterns and bulk outreach lures.",
  },
  {
    title: "Payload mismatch",
    icon: Bug,
    note: "Unexpected attachments or weak file naming patterns.",
  },
  {
    title: "Social pressure",
    icon: ShieldAlert,
    note: "Urgency, fear, and reward language tuned for haste.",
  },
];

function ThreatIntelPage({
  history,
  analysis,
  intelFilter,
  onIntelFilterChange,
}) {
  const counts = buildCategoryCounts(history);

  const filteredCards = intelCards.filter((card) => {
    if (intelFilter === "all") return true;
    if (intelFilter === "urls") return card.title === "URL cloaking";
    if (intelFilter === "domains") return card.title === "Domain spoofing";
    if (intelFilter === "social") {
      return (
        card.title === "Social pressure" ||
        card.title === "Credential harvest" ||
        card.title === "Template abuse"
      );
    }

    return true;
  });

  const visibleSignals = analysis?.red_flags?.slice(0, 4) ?? [];

  return (
    <section className="view-shell intel-view">
      <div className="page-topbar">
        <div>
          <p className="page-kicker">Threat Intelligence</p>
          <h2>Live attack signatures</h2>
          <p className="page-subtitle">
            A constantly updating view of the most common phishing tactics
            detected in your session.
          </p>
        </div>
        <div className="range-switcher">
          {["all", "urls", "domains", "social"].map((filter) => (
            <button
              key={filter}
              type="button"
              className={`filter-chip ${intelFilter === filter ? "active" : ""}`}
              onClick={() => onIntelFilterChange(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="intel-layout">
        <motion.article
          className="glass-card intel-map-card"
          whileHover={{ y: -2 }}
        >
          <div className="card-heading">
            <div>
              <p className="card-kicker">Signal map</p>
              <h3>Threat geography placeholder</h3>
            </div>
            <Radar size={16} />
          </div>
          <div className="intel-map">
            <div className="map-grid" />
            <div className="intel-node node-a" />
            <div className="intel-node node-b" />
            <div className="intel-node node-c" />
            <div className="intel-node node-d" />
            <div className="map-copy">
              <ShieldAlert size={20} />
              <p>
                Phishing signals appear across URLs, domains, and social
                engineering flows.
              </p>
            </div>
          </div>
        </motion.article>

        <div className="intel-grid">
          {filteredCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.title}
                className="glass-card intel-card"
                whileHover={{ y: -2 }}
                transition={{ delay: index * 0.03 }}
              >
                <div className="card-heading">
                  <div>
                    <p className="card-kicker">Technique</p>
                    <h3>{card.title}</h3>
                  </div>
                  <Icon size={16} />
                </div>
                <p>{card.note}</p>
                <div className="intel-count-row">
                  <span>Session hits</span>
                  <strong>{counts[card.title] ?? 0}</strong>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.article
          className="glass-card intel-feed-card"
          whileHover={{ y: -2 }}
        >
          <div className="card-heading">
            <div>
              <p className="card-kicker">Latest intelligence</p>
              <h3>{analysis ? "Current scan insights" : "No scan yet"}</h3>
            </div>
            <Mail size={16} />
          </div>

          {analysis ? (
            <div className="intel-feed">
              {visibleSignals.length > 0 ? (
                visibleSignals.map((flag) => (
                  <div key={flag} className="intel-feed-row">
                    <span />
                    <p>{flag}</p>
                  </div>
                ))
              ) : (
                <div className="empty-state compact">
                  <ShieldAlert size={18} />
                  <span>No specific flags surfaced in this scan.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state compact">
              <ShieldAlert size={18} />
              <span>Run an analysis to populate live intelligence feeds.</span>
            </div>
          )}
        </motion.article>
      </div>
    </section>
  );
}

export default memo(ThreatIntelPage);
