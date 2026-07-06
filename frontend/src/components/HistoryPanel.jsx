import { memo, useDeferredValue, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  CalendarRange,
  Clock3,
  History,
  Search,
  Trash2,
  TriangleAlert,
  ShieldCheck,
} from "lucide-react";
import {
  import { memo } from 'react'
  import { motion } from 'framer-motion'
  import { ArrowRight, History, Trash2, ShieldCheck } from 'lucide-react'
  import { formatLongTimestamp, getRiskLabel, getRiskTier } from '../lib/analysisUtils'
  import '../styles/HistoryPanel.css'
    return history.filter(
  function HistoryPanel({
    history,
    selectedHistoryItem,
    onSelectHistoryItem,
    onDeleteHistoryItem,
    onLoadIntoAnalyzer,
  }) {
    const selected = selectedHistoryItem ?? history[0] ?? null
          disabled={!history.length}
        >
      <div className="history-panel glass-card">
        <div className="panel-heading compact">
          <div>
            <p className="panel-kicker">Timeline</p>
            <h3>Session scans</h3>
          </div>
          <button type="button" className="secondary-button compact" onClick={() => onLoadIntoAnalyzer?.(selected)} disabled={!selected}>
            Load scan <ArrowRight size={14} />
          </button>
        </div>

        <div className="history-list timeline-list">
          {history.length > 0 ? history.map((item) => {
            const score = Number(item.result?.risk_score ?? 0)
            const tier = getRiskTier(score)
            const active = selected?.id === item.id

            return (
              <motion.div key={item.id} className={`timeline-row ${active ? 'active' : ''}`} role="button" tabIndex={0} onClick={() => onSelectHistoryItem?.(item)} whileHover={{ y: -1 }}>
                <div className={`timeline-score risk-${tier.tier}`}>{score}%</div>
                <div className="timeline-copy">
                  <strong>{item.message}</strong>
                  <span>{formatLongTimestamp(item.timestamp)}</span>
                </div>
                <div className="timeline-meta">
                  <span className={`status-pill ${tier.tier}`}>{getRiskLabel(score)}</span>
                  <button type="button" className="icon-button" onClick={(event) => { event.stopPropagation(); onDeleteHistoryItem?.(item) }} aria-label="Delete history item">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            )
          }) : (
            <div className="empty-state compact">
              <ShieldCheck size={18} />
              <span>No history yet. Analyze a message to build your timeline.</span>
            </div>
          )}
        </div>

        <div className="history-detail-card">
          {selected ? (
            <>
              <p className="panel-kicker">Selected scan</p>
              <h4>{getRiskLabel(Number(selected.result?.risk_score ?? 0))}</h4>
              <p>{selected.result?.explanation}</p>
              <div className="history-detail-row">
                <span>Score</span>
                <strong>{selected.result?.risk_score ?? 0}%</strong>
              </div>
            </>
          ) : (
            <div className="empty-state compact">
              <ShieldCheck size={18} />
              <span>Select a scan to inspect its details.</span>
            </div>
          )}
        </div>
      </div>
    )
                No history yet. Analyze a message to build your timeline.
              </span>
  export default memo(HistoryPanel)
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(HistoryPanel);
