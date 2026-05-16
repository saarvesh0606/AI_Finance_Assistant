# QuanTara – AI Financial Intelligence Platform (Async SaaS Architecture)

![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)
![Flask](https://img.shields.io/badge/Flask-Backend-black.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue.svg)
![Redis](https://img.shields.io/badge/Redis-Queue-red.svg)
![RQ](https://img.shields.io/badge/RQ-Worker-green.svg)
![Status](https://img.shields.io/badge/Status-Stable%20v1.0-success.svg)
![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)

An **AI-powered financial intelligence platform** built using a **true asynchronous job architecture**, combining stock analytics, news sentiment analysis, corporate financial intelligence, and document AI into a scalable SaaS-ready system.

This repository represents a **stable, async-first V1 backend**, focused on production-grade architecture, job persistence, and clean system design.

---

## 🔍 What This System Does (V1)

- Executes financial analysis via **background workers**
- Stores jobs persistently in PostgreSQL
- Uses Redis as a task queue
- Runs AI processing via Gemini API
- Polls job status from frontend
- Returns structured financial intelligence results
- Prevents API blocking using async job flow

> **Important:**  
> All heavy computation runs through Redis + RQ workers.  
> The API layer remains lightweight and non-blocking.

---

## ✅ Current Status (V1 – Stable Async Architecture)

- [x] Flask backend API
- [x] SQLAlchemy 2.0 job model
- [x] PostgreSQL job persistence
- [x] Redis-backed job queue
- [x] RQ background worker processing
- [x] Async frontend polling system
- [x] Gemini AI integration
- [x] Alpha Vantage integration
- [x] NewsAPI integration
- [x] Docker-based Redis setup
- [ ] Technical indicators backend (RSI/SMA) *(V2)*
- [ ] Forecast modeling engine *(V2)*
- [ ] Authentication & multi-user support *(V2)*

---

## 📁 Project Structure

```
QuanTara_Project/
├── app.py                 # Flask API server
├── worker.py              # RQ worker process
├── tasks.py               # Async task definitions
├── services.py            # External API integrations
├── db.py                  # SQLAlchemy Job model
├── queueing.py            # Redis connection & queue setup
│
├── index.html             # Frontend UI
├── script.js              # Async polling + rendering logic
├── styles.css             # UI styling
│
├── requirements.txt
├── render.yaml
└── README.md
```

---

## 📦 Core Modules

### 📊 Corporate Financial Analyzer
- Upload financial documents
- KPI extraction
- Executive summary generation
- Risk & opportunity detection

### 📈 Stock Intelligence Engine
- Real-time stock retrieval
- AI-generated technical analysis
- Latest price metrics

### 📰 News Sentiment Intelligence
- Live news ingestion
- AI-based sentiment scoring
- Market impact interpretation

### 🏭 Industry Intelligence
- Sector trend analysis
- Competitive positioning insights
- AI-driven macro overview

### 🔬 What-If Scenario Modeling
- Revenue stress simulations
- Impact forecasting
- AI response synthesis

### 📄 Document Intelligence
- Institutional-grade summarization
- Executive-level insight extraction

---

## ⚙️ Setup

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd QuanTara_Project
```

---

### 2️⃣ Create Virtual Environment

```bash
python -m venv .venv
```

Activate:

**Windows**
```bash
.venv\Scripts\activate
```

**macOS/Linux**
```bash
source .venv/bin/activate
```

---

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🐳 Redis Setup (Required)

QuanTara requires Redis for async job processing.

### Start Redis (Docker Recommended)

```bash
docker run -d -p 6379:6379 --name quantara-redis redis
```

If container already exists:

```bash
docker start quantara-redis
```

Verify:

```bash
docker ps
```

---

## ▶️ Running the System

Start services in the correct order:

### 1️⃣ Start Redis

```bash
docker start quantara-redis
```

### 2️⃣ Start Worker

```bash
python worker.py
```

Expected output:

```
Listening on default...
```

### 3️⃣ Start Flask API

```bash
python app.py
```

Open in browser:

```
http://127.0.0.1:5000
```

---

## 🔄 Async Job API

### Create Job

```
POST /jobs
```

Example payload:

```json
{
  "type": "stock-analysis",
  "ticker": "AAPL",
  "period": "1mo",
  "interval": "1d"
}
```

---

### Check Job Status

```
GET /jobs/<job_id>
```

Example response:

```json
{
  "status": "succeeded",
  "result": {
    "analysis": "...",
    "metrics": {
      "latest_price": 264.72
    }
  }
}
```

---

## 🔒 Frozen Defaults (V1)

| Parameter | Value |
|------------|--------|
| Queue Backend | Redis |
| Worker Engine | RQ |
| Job Persistence | PostgreSQL |
| API Mode | Async Only |
| Frontend Poll Interval | 1–2 seconds |

All heavy computation is delegated to workers.  
The API layer never performs long-running blocking operations.

---

## 🧠 Core Design Principles

- Async-first architecture
- Decoupled frontend and backend
- Persistent job tracking
- Worker isolation for scalability
- Cloud-deployment ready
- Docker-compatible infrastructure

---

## ⚠️ Limitations (V1)

- No technical indicator calculations (RSI, MACD)
- No portfolio analytics
- No authentication layer
- Free-tier API rate limits apply
- Single-tenant architecture

---

## 🚧 Roadmap (V2)

Planned improvements:

- RSI / MACD / SMA backend computation
- Forecast modeling engine
- Portfolio risk dashboard
- Multi-user authentication
- WebSocket real-time updates
- Monitoring & observability stack

---

## 🏷️ Version

**v1.0 – Stable Async SaaS Backend**

- Async job queue complete  
- Redis worker integration verified  
- PostgreSQL persistence enabled  
- AI integrations stable  
- Production-ready backend design  

---

## 👤 Author

**Sarvesh Jagtap**  


---

## 📄 License

MIT License
