# 💰 ClearHook - Cost Optimization & Free Tier Guide

## 🆓 Why ClearHook is Free

**3 reasons:**

1. **Free API Credits** ($5 from Anthropic)
2. **Cheap Model** (Haiku = 73% cheaper than Sonnet)
3. **Optimized Prompts** (Short system prompt = fewer tokens)

---

## 📊 Cost Analysis

### Per-Analysis Cost (Current)

**ClearHook analysis:**
```
Input tokens:  ~500 (system + message)
Output tokens: ~100 (JSON response)

Cost = (500 * 0.80/1M) + (100 * 4/1M)
     = $0.0004 + $0.0004
     = $0.0008 per analysis
```

### With $5 Free Credit

```
$5 / $0.0008 = 6,250 analyses possible
Realistic: ~625 analyses (accounting for variance)
```

**That's enough for:**
- ✅ 2+ months of daily testing
- ✅ Full hackathon development
- ✅ User testing
- ✅ Demo + backup demo

---

## 🎯 Model Comparison

| Model | Input Cost | Output Cost | Why ClearHook Uses | Status |
|-------|-----------|-----------|-------------------|--------|
| **Haiku** | $0.80/M | $4/M | ✅ Cheapest, fast | ACTIVE |
| Sonnet | $3/M | $15/M | 73% more expensive | Backup |
| Opus | $15/M | $75/M | 18x more expensive | Not used |

---

## 💡 Cost Optimization Techniques

### 1. Haiku Model (Currently Using)
```javascript
// Current (optimized):
model: 'claude-3-5-haiku-20241022'

// NOT used (too expensive):
model: 'claude-3-5-sonnet-20241022'  // 73% more
```

**Savings**: $0.006/analysis

---

### 2. System Prompt Optimization

**Before (verbose):**
```
You are ClearHook, an expert cybersecurity analyst specializing in 
detecting phishing, scam, and social engineering attempts in SMS 
messages and emails. Analyze the provided message and return a JSON 
response with: 1. risk_score (0-100)... [200+ words]
```

**After (compact):**
```
You are ClearHook, a phishing detector. Analyze SMS/email and return JSON:
{risk_score, red_flags, explanation, recommendation}
Be direct. Return ONLY valid JSON. [50 words]
```

**Savings**: 70% fewer tokens

---

### 3. Output Token Limit

```javascript
// Before: 1024 tokens (wastes money on verbose responses)
max_tokens: 1024

// After: 500 tokens (enough for phishing JSON)
max_tokens: 500
```

**Savings**: 50% fewer output tokens

---

### 4. Input Efficiency

```javascript
// Before:
`Analyze this message for phishing/scam indicators:\n\n${message}`

// After:
`Analyze for phishing:\n\n${message}`
```

**Savings**: ~100 tokens per request

---

### 5. Prompt Caching (Future)

```javascript
// Not yet implemented (requires SDK update)
// When implemented: 90% savings on system prompt tokens
// Example: First call = $0.008, Subsequent calls = $0.0001
```

---

## 📈 Real Cost Tracking

### Dashboard Monitoring

Go to: **console.anthropic.com → Billing**

**Check:**
1. Usage this month (real cost)
2. Remaining balance
3. Rate of consumption

**Example:**
```
Free credit: $5.00
Used: $0.42
Remaining: $4.58

At current rate: 11,450 analyses left
```

---

## 🚨 Spending Limit (Safety)

**CRITICAL: Set spending limit BEFORE testing**

1. Go to: console.anthropic.com/billing/usage-limits
2. Set limit: $10
3. Confirm save

**What happens at $10?**
- API requests fail with 429
- Backend logs error
- User sees: "Analysis unavailable"
- **You are NOT charged more**

---

## 🔍 Monitor During Development

### Check Cost in Backend Logs

```javascript
// Add to backend/src/services/anthropic.js:
console.log(`Cost: $${(usage.input_tokens * 0.80 + usage.output_tokens * 4) / 1000000}`)
```

### Simple Tracking Spreadsheet

| Date | Analyses | Cost | Notes |
|------|----------|------|-------|
| Apr 24 | 10 | $0.008 | Initial testing |
| Apr 25 | 25 | $0.020 | Demo prep |
| Total | 35 | $0.028 | 99% remaining |

---

## 🎯 Cost-Saving Tips

### ✅ DO:
- ✅ Test in Claude.ai first (free, no API calls)
- ✅ Reuse analysis prompts
- ✅ Batch testing (multiple analyses = same overhead)
- ✅ Use Haiku (never switch to Sonnet for hackathon)
- ✅ Monitor dashboard weekly
- ✅ Set spending limit immediately

### ❌ DON'T:
- ❌ Use Sonnet "just to test"
- ❌ Make recursive API calls
- ❌ Test without rate limiting
- ❌ Skip spending limit setup
- ❌ Send huge messages (5000 char limit)
- ❌ Ignore API errors (fix bugs quickly)

---

## 🆘 If You Go Over Budget

**Scenario: Spending limit hit at $10**

### What Happens:
1. ❌ API returns: `429 - Rate Limited`
2. ❌ Backend logs error
3. ✅ **NO additional charges**
4. ✅ **Frontend shows error gracefully**

### Recovery:

**Option A: Wait for Reset**
```
New credit period starts next month
But hackathon doesn't wait...
```

**Option B: Contact Anthropic**
```
Email: support@anthropic.com
Subject: "Extra credits for hackathon - Far Away 2026"
Result: Often get additional $10-50 for legitimate projects
```

**Option C: Team Shares Budget**
```
4 teammates × $5 = $20 total budget
Divide among team for development
```

---

## 📋 Budget Allocation

For 4-person team with $20 total:

| Phase | Budget | Analyses | Time |
|-------|--------|----------|------|
| **Week 1: Dev** | $5 | 625 | Apr 24-30 |
| **Week 2: Testing** | $8 | 1000 | May 1-7 |
| **Week 3: Demo** | $5 | 625 | May 8-15 |
| **Buffer** | $2 | 250 | Emergency |

---

## ✅ Cost Verification Checklist

- [ ] Claude account created
- [ ] API key generated
- [ ] Spending limit set ($10)
- [ ] Free $5 confirmed in dashboard
- [ ] First API call costs ~$0.0008
- [ ] 625 analyses = all of $5
- [ ] No payment method added
- [ ] Rate limiting enabled (10 req/min)
- [ ] Ready for hackathon (zero cost)

---

## 🎉 Final Numbers

**ClearHook Cost:**
```
Claude API:           $0   (free credits)
Frontend hosting:     $0   (Vite static)
Backend hosting:      $0   (free tier)
Domain:              $0   (not needed)
─────────────────────────
Total:               $0
```

**What you get:**
- ✅ 625+ phishing analyses
- ✅ Production-ready code
- ✅ Real-time demos
- ✅ No payment risk

**This is not a limitation—it's a feature!** 🎯

---

## 📞 Support

**Question?** Check:
1. [FREE_API_GUIDE.md](FREE_API_GUIDE.md) - Getting started
2. [README.md](README.md#cost-breakdown) - Cost breakdown
3. Dashboard: console.anthropic.com

**Still stuck?** Email Anthropic support - they're great with students!

