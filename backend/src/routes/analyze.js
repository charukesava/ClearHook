import express from 'express'
import { validateInput, sanitizeInput } from '../services/validator.js'
import { analyzeMessage } from '../services/anthropic.js'

const router = express.Router()

// POST /analyze endpoint
router.post('/analyze', async (req, res) => {
  try {
    const { message } = req.body

    // Validate input
    const validation = validateInput(message)
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      })
    }

    // Sanitize input
    const sanitized = sanitizeInput(message)

    // Analyze message
    const result = await analyzeMessage(sanitized)

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Analysis failed'
      })
    }

    return res.json({
      success: true,
      ...result.data
    })
  } catch (error) {
    console.error('Analyze endpoint error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
