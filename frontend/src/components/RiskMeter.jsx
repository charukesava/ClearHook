import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Shield, Sparkles } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'
import { getRiskAccent, getRiskLabel, getRiskTier } from '../lib/analysisUtils'
import '../styles/RiskMeter.css'

function RiskMeter({ analysis, loading }) {
  const score = Number(analysis?.risk_score ?? 0)
  const tier = getRiskTier(score)
  const accent = getRiskAccent(score)
  const label = getRiskLabel(score)

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const title = useMemo(() => {
    if (loading) return 'Scanning message'
    if (!analysis) return 'Awaiting analysis'
    return `${label} risk detected`
  }, [analysis, label, loading])

  if (loading) {
    return (
      <div className="risk-meter-card loading-state">
        <div className="risk-meter-glow" />
        <div className="risk-meter-header">
          <span className="section-kicker">Threat Analysis</span>
          <h3>{title}</h3>
        </div>
        <div className="risk-meter-loader">
          <motion.div className="loader-ring" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }} />
          <div className="loader-copy">
            <Shield size={18} />
            <span>Analyzing headers, links, and language patterns</span>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="risk-meter-card empty-state">
        <div className="risk-meter-header">
          <span className="section-kicker">Threat Analysis</span>
          <h3>{title}</h3>
        </div>
        <p>Paste a suspicious SMS, email, or chat message to generate a live risk score.</p>
        <div className="risk-meter-placeholder">
          <Shield size={38} />
        </div>
      </div>
    )
  }

  return (
    <div className="risk-meter-card">
      <div className="risk-meter-glow" style={{ background: `radial-gradient(circle at 50% 50%, ${accent}30 0%, transparent 70%)` }} />
      <div className="risk-meter-header">
        <span className="section-kicker">Threat Analysis</span>
        <div className="risk-meter-title-row">
          <h3>{title}</h3>
          <span className={`risk-pill risk-${tier.tier}`}>{tier.label}</span>
        </div>
      </div>

      <div className="risk-meter-body">
        <div className="risk-ring-wrap" style={{ '--accent-color': accent }}>
          <svg viewBox="0 0 140 140" className="risk-ring" aria-hidden="true">
            <defs>
              <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6D28D9" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <circle cx="70" cy="70" r={radius} className="risk-ring-track" />
            <motion.circle
              cx="70"
              cy="70"
              r={radius}
              className="risk-ring-progress"
              stroke="url(#riskGradient)"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.15, ease: 'easeOut' }}
            />
          </svg>
          <div className="risk-ring-copy">
            <AnimatedCounter value={score} suffix="%" className="risk-score" />
            <span className="risk-subtitle">{label} confidence</span>
          </div>
        </div>

        <div className="risk-summary">
          <div className="risk-summary-row">
            <Sparkles size={15} />
            <div>
              <strong>Score</strong>
              <span>{score}% likelihood of phishing traits</span>
            </div>
          </div>
          <div className="risk-summary-row">
            <Shield size={15} />
            <div>
              <strong>Risk level</strong>
              <span>{label} based on pattern matching and suspicious language</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(RiskMeter)