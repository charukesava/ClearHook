import { memo } from 'react'
import { motion } from 'framer-motion'
import '../styles/BackgroundEffects.css'

function BackgroundEffects() {
  return (
    <div className="background-effects" aria-hidden="true">
      <div className="mesh-gradient" />
      <div className="grid-overlay" />
      <motion.div className="orb orb-left" animate={{ x: [0, 14, 0], y: [0, -8, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="orb orb-right" animate={{ x: [0, -12, 0], y: [0, 10, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="orb orb-bottom" animate={{ x: [0, 10, 0], y: [0, -12, 0] }} transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="particle-field" />
    </div>
  )
}

export default memo(BackgroundEffects)