# ClearHook - Setup & Deployment Guide

## Local Development Setup

### 1. Prerequisites
```
Node.js 18+ (check: node --version)
npm 9+ (check: npm --version)
Claude API Key (free at console.anthropic.com)
Git (optional, for version control)
```

### 2. Clone Repository
```bash
cd f:/ClearHook
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from template
copy .env.example .env

# Edit .env with your API key
# ANTHROPIC_API_KEY=sk-ant-xxxxx (from console.anthropic.com)

# Start development server
npm run dev

# Expected output: ✅ ClearHook backend running on port 3001
```

### 4. Frontend Setup (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file from template
copy .env.example .env

# Start development server
npm run dev

# Expected output: ➜  VITE v4.4.0 ready in 123 ms
#                 ➜  Local: http://localhost:5173/
```

### 5. Test the Application

Open browser: `http://localhost:5173`

Paste sample phishing SMS:
```
"Dear Customer, Verify your SBI account: bit.ly/sbi-verify-urgent. Click now or lose access!"
```

Click "🔍 Analyze" → Should show results in 3-5 seconds

---

## Environment Variables

### Backend (.env)
```
ANTHROPIC_API_KEY=your_key_here          # Required: From console.anthropic.com
PORT=3001                                # Optional: Server port (default 3001)
NODE_ENV=development                     # Optional: development|production
ALLOWED_ORIGINS=http://localhost:5173    # Optional: CORS whitelist
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3001/api    # Backend API endpoint
```

---

## Getting Claude API Key

1. Go to: **console.anthropic.com**
2. Sign up (free account)
3. Click "API Keys" in sidebar
4. Create new key
5. Copy key to `backend/.env`
6. **IMPORTANT**: Set spending limit to $10 in Billing tab

---

## Troubleshooting

### Port Already in Use
```
Windows: netstat -ano | findstr :3001
Kill: taskkill /PID <PID> /F
```

### API Key Invalid
- Verify key format: `sk-ant-xxxxx`
- Check key is not in git commits
- Regenerate key if unsure

### CORS Errors
- Frontend must be on `http://localhost:5173`
- Backend must have `ALLOWED_ORIGINS` set correctly

### No Response from Backend
- Check backend is running: `http://localhost:3001/health`
- Should return: `{"status":"ok","service":"clearhook-backend"}`

---

## Deployment (Optional for Judges)

### Option 1: Vercel (Frontend)
```
1. Push frontend/ to GitHub
2. Go to vercel.com
3. Import GitHub repo
4. Add VITE_API_BASE_URL environment variable
5. Deploy (auto)
```

### Option 2: Railway (Backend)
```
1. Push backend/ to GitHub
2. Go to railway.app
3. Import GitHub repo
4. Add ANTHROPIC_API_KEY environment variable
5. Deploy (auto)
```

### Option 3: Docker (Both)
```bash
# From project root
docker-compose up

# Builds and runs both services in containers
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

---

## Development Workflow

### Adding New Features

1. **Backend API change**:
   - Edit `backend/src/routes/analyze.js`
   - Test with `curl -X POST http://localhost:3001/analyze`

2. **Frontend component change**:
   - Edit `frontend/src/components/*.jsx`
   - Hot reload automatic (Vite)

3. **Claude prompt tuning**:
   - Edit `backend/src/services/anthropic.js`
   - Test in Claude.ai first (saves API credits)
   - Deploy to backend

---

## Production Checklist

- [ ] API key in `.env` (not in git)
- [ ] Spending limit set on Anthropic
- [ ] ALLOWED_ORIGINS updated for production domain
- [ ] Frontend build tested: `npm run build`
- [ ] Backend logs reviewed for errors
- [ ] Rate limiting verified
- [ ] Input validation tested with edge cases
- [ ] HTTPS enabled on deployment

---

## Testing Samples

**High Risk (95%+):**
```
"Dear Customer, Verify your SBI account: bit.ly/sbi-verify-urgent"
```

**Medium Risk (50-70%):**
```
"Your Paytm wallet needs verification. Update profile: verify.paytm-secure.net"
```

**Low Risk (0-30%):**
```
"Hi, just checking if you're free for lunch today?"
```

---

## Useful Commands

```bash
# Backend
npm run dev          # Development with hot reload
npm run start        # Production mode

# Frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build

# Both
npm run build && npm run start
```

---

## Next: See DEMO_SCRIPT.md for 60-second pitch! 🎬

