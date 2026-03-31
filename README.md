# ⚡ FocusForge — Your 20-Day Discipline System

A full-stack productivity web application for students who are serious about getting placed. Built for the exact workflow of: DSA → LeetCode → Spring Boot → Academics → Health → Communication.

---

## 🚀 Live App (Standalone)

The `focusforge_app.html` file works **immediately** in any browser — no setup needed. Just open it.
- All data stored in localStorage
- Works offline
- Mobile-friendly

---

## 🗂️ Project Structure

```
focusforge/
├── focusforge_app.html          ← Standalone app
├── index.html                   ← Vercel entry point
├── api/                         ← Vercel serverless auth/data routes
├── lib/                         ← MongoDB + JWT helpers
├── models/                      ← Shared Mongoose models
├── README.md
├── .env.example
└── .gitignore
```

---

## ⚙️ Full Stack Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Git

### 1. Clone & Setup Backend

```bash
cd focusforge/backend
npm install

# Copy and fill .env
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/focusforge
JWT_SECRET=your_super_secret_key_at_least_32_chars
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

### 2. Setup Frontend (React)

```bash
cd focusforge/frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 🌐 API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login + JWT |
| GET | `/api/auth/me` | Get current user + saved data |
| PUT | `/api/auth/me` | Update profile fields |

### Data
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/data` | Get saved app data |
| PUT | `/api/data` | Update saved app data |

---

## 🚢 Deployment

### Full Project → Vercel + MongoDB Atlas
1. Set `MONGODB_URI` and `JWT_SECRET` in Vercel environment variables.
2. Deploy the repo directly to Vercel.
3. Vercel serves `index.html`, which loads the standalone app.
4. Serverless routes in `api/` handle auth and MongoDB-backed data.

### Required Vercel Environment Variables
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key_at_least_32_chars
```

### Database → MongoDB Atlas
1. Create free cluster at mongodb.com/atlas
2. Add IP `0.0.0.0/0` in Network Access
3. Copy connection string to `MONGODB_URI`

---

## 🎯 Features

| Feature | Status |
|---------|--------|
| JWT Authentication | ✅ |
| 20-Day Predefined Tasks | ✅ |
| Dashboard with Stats | ✅ |
| Daily Routine Timeline | ✅ |
| DSA Problem Tracker | ✅ |
| Spring Boot Roadmap | ✅ |
| Academics Tracker | ✅ |
| Health Tracker (Water/Sleep/Exercise) | ✅ |
| Communication Log | ✅ |
| Pomodoro Timer | ✅ |
| Distraction Control | ✅ |
| Streak System | ✅ |
| Analytics + Charts | ✅ |
| Calendar View | ✅ |
| Focus Mode | ✅ |
| Dark/Light Theme | ✅ |
| Export Report | ✅ |
| Mobile Responsive | ✅ |
| Daily Motivational Quotes | ✅ |

---

## 📱 Tech Stack

**Frontend:** Pure HTML + CSS + Vanilla JS + Chart.js  
**Backend:** Vercel serverless functions + JWT + bcryptjs + Mongoose  
**Database:** MongoDB Atlas + Mongoose  
**Deployment:** Vercel + MongoDB Atlas  

---

## 🔐 Security

- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens expire in 30 days
- Rate limiting: 100 requests per 15 minutes
- Helmet.js for HTTP security headers
- CORS configured for specific origin only

---

## 🧠 20-Day Task Plan

Every day has 6 tasks across categories:
- **DSA** — New data structure / algorithm topic
- **LeetCode** — Specific problems to solve
- **Spring Boot** — Backend development skill
- **Academics** — DAA + other subjects
- **Health** — Water, exercise, sleep
- **Communication** — Daily speaking practice

Days progress: Arrays → Strings → Hashing → Linked Lists → Stacks → Trees → Graphs → DP → System Design → Mock Interviews

---

Built with 🔥 by FocusForge | Deploy. Grind. Get Placed.
