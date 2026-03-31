# ⚡ FocusForge — Your 20-Day Discipline System

A full-stack productivity web application for students who are serious about getting placed. Built for the exact workflow of: DSA → LeetCode → Spring Boot → Academics → Health → Communication.

---

## 🚀 Live App (Standalone)

The `focusforge_app.html` file works **immediately** in any browser — no setup needed. Just open it.
- All data stored in localStorage
- Works offline
- Mobile-friendly

## 🔐 Email OTP Auth

Signup now sends a 6-digit verification code to the email address you enter. Users must verify that code before they can log in.

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

### 1. Clone & Install

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the repo root using `.env.example` as a guide.

Edit `.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/focusforge
JWT_SECRET=your_super_secret_key_at_least_32_chars
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password
SMTP_FROM=FocusForge <your_email@example.com>
```

### 3. Run Locally

Open `focusforge_app.html` directly, or serve the repo root with any static server.

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
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password
SMTP_FROM=FocusForge <your_email@example.com>
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
