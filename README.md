# ClearHook - Real-time Phishing Message Analyzer

🆓 **ZERO COST HACKATHON PROJECT** - Google Gemini API + $300 free/month

## 🎯 Quick Links

| | |
|---|---|
| **🚀 START HERE** | **[GEMINI_SETUP.md](GEMINI_SETUP.md)** - 5 min Gemini setup |
| **📖 Navigation** | **[START_HERE.md](START_HERE.md)** - 10 min to running |
| **🔧 Detailed** | **[docs/SETUP.md](docs/SETUP.md)** - Complete guide |
| **🎬 Demo** | **[docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md)** - 60-second pitch |

---

## 📚 All Documentation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **[GEMINI_SETUP.md](GEMINI_SETUP.md)** | 🎯 Google Gemini API setup (START HERE!) | 5 min |
| **[START_HERE.md](START_HERE.md)** | 📖 Navigation guide | 5 min |
| **[ZERO_COST_SETUP.md](ZERO_COST_SETUP.md)** | 🚀 Quick 10-min setup | 10 min |
| **[FREE_API_GUIDE.md](FREE_API_GUIDE.md)** | 🆓 Alternative: Claude setup | 5 min |
| **[COST_OPTIMIZATION.md](COST_OPTIMIZATION.md)** | 💰 Budget tracking & optimization | 5 min |
| **[QUICKSTART.md](QUICKSTART.md)** | ⚡ Fast 5-minute setup | 5 min |
| **[VALIDATION.md](VALIDATION.md)** | ✅ Pre-launch system check | 3 min |
| **[FILE_REFERENCE.md](FILE_REFERENCE.md)** | 📁 Complete file structure | 5 min |
| **[docs/SETUP.md](docs/SETUP.md)** | 🔧 Detailed installation | 15 min |
| **[docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md)** | 🎬 60-second demo script | 10 min |
| **[docs/PITCH.md](docs/PITCH.md)** | 💼 Elevator pitch versions | 5 min |

---

**→ NEW USER? Start: [GEMINI_SETUP.md](GEMINI_SETUP.md)**  
**→ EXPERIENCED? Use: [ZERO_COST_SETUP.md](ZERO_COST_SETUP.md)**  
**→ QUESTIONS? Check: [START_HERE.md](START_HERE.md)**
| **[docs/FEATURES.md](docs/FEATURES.md)** | ✨ Feature breakdown |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- **FREE Google Gemini API Key** ($300/month free!)

**→ See [GEMINI_SETUP.md](GEMINI_SETUP.md) for Gemini API key setup (3 min)**

### Setup (5 minutes)

**1. Get Google Gemini API Key:**
- Go to: https://makersuite.google.com/app/apikey
- Sign in with Google
- Create API key
- Copy the key (AIzaSyD...)

**2. Backend Setup**
```bash
cd f:\ClearHook\backend
npm install
copy .env.example .env
# Edit .env: GEMINI_API_KEY=AIzaSyD...
npm run dev
```

**3. Install Frontend (new terminal)**
```bash
cd f:\ClearHook\frontend
npm install
npm run dev
```

**4. Open:** `http://localhost:5173`

**5. Test:** Paste phishing SMS → Click Analyze

---

**Or use startup script:**
```bash
cd f:\ClearHook
startup.bat  # (Windows)
```

For detailed setup: See [QUICKSTART.md](QUICKSTART.md)

---

## ✨ Key Features

- **Real-time Analysis**: Instant phishing detection with risk scoring (0-100%)
- **Explainable AI**: Clear breakdown of why a message is suspicious
- **Multi-format Support**: Analyzes SMS, emails, chat messages
- **Analysis History**: Track previous analyses in session
- **Production-ready**: Rate limiting, input validation, CORS security
- **Indian-focused**: Detects UPI scams, banking phishing, e-commerce frauds

## 🏆 Hackathon Winning Points

✅ **Specific problem**: Phishing is the #1 cyber threat in India (₹₹₹ losses annually)  
✅ **Working demo**: Live analysis in 5 seconds with explainable results  
✅ **Rapid prototyping**: Can be demoed in 60 seconds  
✅ **Real-world impact**: Directly solves a visible, urgent problem  
✅ **Judge-friendly**: No complex setup, immediate results visible  
✅ **Zero cost**: Uses free Claude API credits  

---

---

## 📁 Project Structure

```
clearhook/
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── components/       # InputForm, AnalysisPanel, HistoryPanel
│   │   ├── styles/           # CSS for each component
│   │   └── App.jsx           # Main app component
│   └── package.json
│
├── backend/                  # Express API server
│   ├── src/
│   │   ├── routes/          # POST /api/analyze
│   │   ├── services/        # Claude integration, validation
│   │   ├── middleware/      # Rate limiting, CORS
│   │   ├── server.js        # Express app
│   │   └── config.js        # Environment configuration
│   └── package.json
│
└── docs/                     # Documentation & demo scripts
```

---

## 🔧 API Endpoint

### POST `/analyze`

**Request:**
```bash
curl -X POST http://localhost:3001/analyze \
  -H "Content-Type: application/json" \
  -d '{"message":"Dear customer, verify your SBI account..."}'
```

**Response:**
```json
{
  "success": true,
  "risk_score": 92,
  "red_flags": [
    "Urgency language ('verify now')",
    "Shortened URL (bit.ly)",
    "Spoofed domain"
  ],
  "explanation": "This message uses classic phishing techniques...",
  "recommendation": "Do not click links. Contact your bank directly."
}
```

---

## 🎨 UI/UX Flow

1. **User pastes message** → Textarea input
2. **Click Analyze** → Sends to backend
3. **3-5 second wait** → Claude processes
4. **Risk badge appears** → Color-coded (red/orange/yellow/green)
5. **Full breakdown** → Red flags, explanation, action
6. **History tracked** → Can click previous analyses

---

## 💡 Demo Strategy for Judges

**60-second demo script:**

```
"This is ClearHook. When a phishing SMS hits your phone, 
you're uncertain. Is it real? Should I click?

ClearHook answers in seconds."

[Paste pre-loaded SBI phishing SMS]
[Click Analyze]
[Wait 3 seconds—intentional pause]
[Risk badge: 95% CRITICAL]
[Point to red flags]

"See? 5 red flags. Shortened URL. Urgency language. 
Spoofed domain. This is a scam."

[Point to recommendation]
"ClearHook tells you exactly what to do: 
Contact your bank directly, not the link."

"In India, ₹2 crore phishing losses annually. 
ClearHook stops that. One message at a time."
```

---

## 🛡️ Security & Performance

- ✅ Rate limiting: 10 requests/min per IP
- ✅ Input validation: 5-5000 character limit
- ✅ CORS configured for production
- ✅ No sensitive data logged
- ✅ API key protected via environment variables
- ✅ XSS protection via React's default escaping

---

## 📊 Cost Breakdown

| Component | Cost | Notes |
|-----------|------|-------|
| Google Gemini | FREE | $300/month free = 10,000+ analyses |
| Model | Flash | Fastest, optimized |
| Frontend hosting | Free | Vite static build |
| Backend hosting | Free | Heroku/Railway free tier |
| Domain | Optional | Not required for hackathon |
| **Total** | **$0** | Completely free with generous quota |

**Why ClearHook is 100% Free with Gemini:**
- ✅ Uses Gemini Flash (instant responses)
- ✅ $300/month free tier (way more than Claude's $5)
- ✅ No spending limit worries
- ✅ Google's infrastructure reliability
- ✅ Perfect for hackathon demos

---

## 🎯 Next Steps (Priority Order)

- [ ] Week 1: Set Claude API key, test 5 Indian phishing examples
- [ ] Week 2: Polish UI, collect more phishing samples
- [ ] Week 2: Rehearse 60-second demo until perfect
- [ ] Week 3: Apply for passport (Tatkal if needed)
- [ ] Week 3: Final testing, prepare backup videos

---

## 🏁 Deployment (Optional)

Deploy for judges to test:

**Backend**: Railway.app (connect GitHub repo)  
**Frontend**: Vercel (connect GitHub repo)

Both free tier. Takes 5 minutes.

---

## 📞 Support & Questions

For issues:
1. Check Claude console for API errors
2. Verify `.env` variables are set
3. Check backend logs for validation errors
4. Test with sample SMS first

---

## 📝 License

MIT - Free to use for hackathon

**Let's build something judges won't forget! 🚀**
