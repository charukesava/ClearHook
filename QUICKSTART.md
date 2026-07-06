# 🚀 ClearHook Quick Start (5 Minutes)

## 💰 Free API Setup - $300/month Google Gemini (Better than Claude!)

**ClearHook now uses Google Gemini - Much better than the original Claude setup!**

| Feature | Gemini (New!) | Claude (Old) |
|---------|--------------|------------|
| Free Credit | $300/month | $5 |
| Speed | ⚡ 1-3s | 3-5s |
| Analyses | 10,000+ | 625 |
| Setup | Simple | Complex |

## Step 1: Get Free Gemini API Key (2 min)
```
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google (create account if needed)
3. Click "Create API key"
4. Copy the key (looks like: AIzaSyD...)
5. Save it somewhere safe
```

## Step 2: Backend Setup (2 min)

```bash
cd f:\ClearHook\backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env and add your Gemini API key:
# GEMINI_API_KEY=AIzaSyD...

# Start backend
npm run dev
```

**Expected Output:**
```
✅ ClearHook backend running on port 3001
📍 Environment: development
🎯 AI Engine: Google Gemini Flash
```

## Step 3: Frontend Setup (1 min)

**In a NEW terminal:**

```bash
cd f:\ClearHook\frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

**Expected Output:**
```
➜  Local: http://localhost:5173/
```

## Step 4: Test It 🎉

1. Open: **http://localhost:5173**
2. Paste this sample phishing SMS:
```
Dear Customer, Verify your SBI account: bit.ly/sbi-verify-urgent. Click now or lose access!
```
3. Click **"🔍 Analyze"**
4. Wait 3-5 seconds for results

---

## ✅ Verify It's Working

- [ ] Backend running on 3001
- [ ] Frontend running on 5173
- [ ] No red errors in console
- [ ] Can paste text and click Analyze
- [ ] Gets response within 5 seconds

---

## ❌ Troubleshooting

**"Cannot find module"?**
```bash
# Delete node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

**"EADDRINUSE: address already in use :::3001"?**
```bash
# Port 3001 is taken. Kill it:
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

**"API key invalid"?**
- Check `.env` file has correct key
- Key should start with `sk-ant-`
- Regenerate if unsure at console.anthropic.com

**"No response from backend"?**
- Check http://localhost:3001/health
- Should return: `{"status":"ok","service":"ClearHook Backend"}`

---

## 🎯 Next: See Actual Demo Script

Read [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) for the 60-second pitch!

