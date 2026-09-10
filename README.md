# MetricMind X

**Enterprise AI-Powered Semantic Business Intelligence Platform**

![Status](https://img.shields.io/badge/Status-Completed-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Duration](https://img.shields.io/badge/Duration-29_Days-orange?style=for-the-badge)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)

> Ask business questions in plain English — get explainable analytics, automated insights, and interactive dashboards. No SQL required.

---

## Table of Contents

- [Overview](#overview)
- [Why MetricMind X](#why-metricmind-x)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Core Modules](#core-modules)
- [API Endpoints](#api-endpoints)
- [Workflow](#workflow)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Challenges & Solutions](#challenges--solutions)
- [Learning Outcomes](#learning-outcomes)
- [Future Scope](#future-scope)
- [Project Info](#project-info)
- [Author](#author)
- [Acknowledgments](#acknowledgments)
- [License](#license)
- [Connect](#connect)

---

## Overview

MetricMind X is an AI-powered Business Intelligence platform that enables users to ask business questions in natural language and receive explainable analytics, automated insights, and interactive dashboards.

Unlike traditional AI systems that directly generate SQL, MetricMind X uses a **governed semantic layer**, **validation pipeline**, **analytics engine**, **visualization layer**, and **agent workflow** to ensure every result is reliable, secure, and explainable — turning raw data into business decisions without writing a single query.

## Why MetricMind X

Most business users face the same recurring problems when working with data:

- Lack of SQL knowledge
- Complex, hard-to-learn dashboard tools
- Heavy dependency on data analysts
- Slow, manual reporting processes
- Difficulty understanding raw data structures

Many AI tools try to solve this by generating raw SQL directly from natural language — which introduces security risks and inconsistent results. MetricMind X instead routes every query through a **governed semantic layer**, keeping answers accurate, explainable, and safe by design — not as an afterthought.

---

## Key Features

| Feature | What It Does |
|---|---|
| 🗣️ Natural Language Analytics | Ask business questions in plain English |
| 🧠 Semantic Business Understanding | Governed semantic layer for accurate context |
| 🔀 Intelligent Query Routing | Automatically routes queries to the right engine |
| 📊 Automated Data Profiling | Understands data structure and characteristics |
| ✅ Data Quality Assessment | Flags inconsistencies and reliability issues |
| 💡 Business Insight Generation | Surfaces key insights automatically |
| 📈 Interactive Dashboard Generation | Builds dashboards on the fly |
| 💾 Dashboard Storage & Retrieval | Save and revisit dashboards anytime |
| 🔍 Dashboard Search & Filtering | Quickly find the dashboard you need |
| 🤖 AI-Powered Analytics Workflow | End-to-end agentic pipeline |
| 🔎 Explainable Results | Every answer comes with reasoning, not a black box |
| 🎨 Modern Enterprise UI | Clean, responsive, production-grade interface |

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS, Apache ECharts |
| **Backend** | FastAPI, Python, Pydantic |
| **Data Processing** | Pandas, NumPy |
| **AI Layer** | OpenAI, LangChain, LangGraph |
| **Database** | PostgreSQL, SQLAlchemy, Alembic |
| **Semantic Layer** | Cube.dev |
| **Version Control** | Git, GitHub |

---

## System Architecture

```
User Question
      │
      ▼
Planner Agent
      │
      ▼
Semantic Validator
      │
      ▼
Router Agent
      │
      ▼
Analytics Engine
      │
 ┌────┴────┐
 ▼         ▼
Insight   Visualization
Agent      Engine
 │             │
 └──────┬──────┘
        ▼
Dashboard Generator
        │
        ▼
Dashboard Storage
        │
        ▼
Next.js Frontend
```

---

## Core Modules

**Data Layer**
- Dataset upload with validation pipeline & metadata extraction
- Automated data profiling (row/column analysis, missing values, duplicates, data types)
- Data quality scoring, validation, and cleaning recommendations

**AI & Analytics Layer**
- Semantic Validation Engine — metric, dimension, and query verification (governance layer)
- Query Planning Engine — intent understanding, metric/dimension extraction
- Analytics Engine — aggregations, grouping, filtering, KPI calculations, ranking
- Insight Generator — trend analysis, automated business summaries

**Dashboard Layer**
- Dashboard Generator — KPI cards, metadata, structured summaries
- Dashboard Storage — save, load, list, and delete dashboards
- Dashboard Library — search, open, and manage saved dashboards

**Frontend**
- Home Page — query interface & dataset interaction
- Insights Page — AI-generated insights & KPI display
- Dashboard Page — dashboard visualization & details
- Dashboard Library — search and manage dashboards

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/dashboard/save` | Save a generated dashboard |
| `GET` | `/api/dashboard/list` | List all saved dashboards |
| `GET` | `/api/dashboard/{id}` | Retrieve a specific dashboard |
| `DELETE` | `/api/dashboard/{id}` | Delete a dashboard |

---

## Workflow

```
Dataset Upload
      │
      ▼
Validation
      │
      ▼
Profiling
      │
      ▼
Quality Assessment
      │
      ▼
User Query
      │
      ▼
Planning Agent
      │
      ▼
Semantic Validation
      │
      ▼
Analytics Engine
      │
      ▼
Insight Generation
      │
      ▼
Dashboard Generation
      │
      ▼
Dashboard Storage
```

---

## Screenshots

> Add screenshots or a short demo GIF of the Home, Insights, and Dashboard pages here — a quick visual preview is one of the strongest ways to make this README stand out to anyone browsing your repo.

```
docs/
 ├─ home-page.png
 ├─ insights-page.png
 └─ dashboard-page.png
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL
- An OpenAI API key

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/<your-username>/metricmind-x.git
cd metricmind-x
```

**2. Backend setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**3. Configure environment variables**

Create a `.env` file inside the backend directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/metricmind
OPENAI_API_KEY=your_openai_api_key
```

**4. Run database migrations**
```bash
alembic upgrade head
```

**5. Start the backend server**
```bash
uvicorn main:app --reload
```

**6. Frontend setup**
```bash
cd ../frontend
npm install
npm run dev
```

**7. Open the app**
```
http://localhost:3000
```

> Note: adjust folder names, scripts, and commands above to match your exact repository structure.

---

## Challenges & Solutions

| Challenge | How It Was Solved |
|---|---|
| **Data Validation** — inconsistent structures and missing values across datasets | Built a dedicated validation & profiling pipeline before any analysis runs |
| **Query Understanding** — correctly identifying intent from natural language | Introduced a Planner Agent + Semantic Validator to ground queries in governed business definitions |
| **Dashboard Persistence** — designing a reusable storage structure | Iterated on the dashboard schema until it supported save, load, search, and delete cleanly |
| **Frontend–Backend Integration** — smooth communication between FastAPI and Next.js | Standardized API contracts and response formats across all endpoints |

---

## Learning Outcomes

This project provided hands-on experience in:

- Full Stack Development
- FastAPI Development
- Next.js Development
- Database Design
- AI Application Development
- Semantic Data Modeling
- Business Intelligence Systems
- LangChain Integration
- LangGraph Workflows
- Software Architecture Design

---

## Future Scope

- User authentication & role-based access control
- Multi-dataset analytics
- Real-time dashboards
- Predictive analytics & AI forecasting
- PDF and Excel report export
- Scheduled reporting
- KPI monitoring

---

## Project Info

| Field | Details |
|---|---|
| **Project Type** | Full Stack AI Application |
| **Domain** | Artificial Intelligence, Business Intelligence, Data Analytics |
| **Duration** | 29 Days |
| **Program** | B.Tech CSE (AI & ML) |
| **Institution** | IIMT University Meerut |

---

## Author

**Vinay Balhara**
B.Tech CSE (AI & ML), IIMT University Meerut

---

## Acknowledgments

Thanks to the faculty and mentors at IIMT University Meerut for their guidance and support throughout the development of this project.

---

## License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute with attribution. *(Update this section if you'd prefer a different license.)*

---


---

<p align="center">Built with a governed, explainable AI pipeline — not raw SQL generation.</p>
