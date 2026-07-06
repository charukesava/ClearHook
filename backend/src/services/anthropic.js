import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

const SYSTEM_PROMPT = `You are ClearHook, a phishing detector. Analyze SMS/email and return ONLY this JSON format (no markdown, no extra text):
{
  "risk_score": 0-100,
  "red_flags": ["flag1", "flag2"],
  "explanation": "Why it's suspicious",
  "recommendation": "What to do"
}

Red flags: urgency language, fake URLs, spoofed domains, request for sensitive info, grammar errors, unusual offers, emotional manipulation.

Be direct. Return ONLY valid JSON, no markdown formatting.`

export async function analyzeMessage(message) {
  try {
    // Use Gemini Flash (fast + free tier optimized)
    // Free tier: Generous limits, great for hackathon
    const prompt = `${SYSTEM_PROMPT}\n\nAnalyze for phishing:\n\n${message}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini')
    }

    const analysis = JSON.parse(jsonMatch[0])
    return {
      success: true,
      data: {
        risk_score: Math.min(100, Math.max(0, analysis.risk_score || 0)),
        red_flags: Array.isArray(analysis.red_flags) ? analysis.red_flags : [],
        explanation: analysis.explanation || 'Unable to analyze',
        recommendation: analysis.recommendation || 'Exercise caution'
      }
    }
  } catch (error) {
    console.error('Gemini API Error:', error)
    return {
      success: false,
      error: error.message || 'Analysis failed'
    }
  }
}
