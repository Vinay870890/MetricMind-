# MetricMind X

**Enterprise AI-Powered Semantic Business Intelligence Platform**

> Ask business questions in plain English — get explainable analytics, automated insights, and interactive dashboards. No SQL required.

---

## Table of Contents

- [Overview](#overview)
- [Why MetricMind X](#why-metricmind-x)
- [Project Highlights](#project-highlights)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Core Modules](#core-modules)
- [API Endpoints](#api-endpoints)
- [Workflow](#workflow)
- [Future Scope](#future-scope)
- [Author](#author)

---

## Overview

MetricMind X is an AI-powered Business Intelligence platform that enables users to ask business questions in natural language and receive explainable analytics, automated insights, and interactive dashboards.

Unlike traditional AI systems that directly generate SQL, MetricMind X uses a **governed semantic layer**, **validation pipeline**, **analytics engine**, **visualization layer**, and **agent workflow** to ensure reliable and secure business intelligence.

## Why MetricMind X

Most business users face the same recurring problems when working with data:

- Lack of SQL knowledge
- Complex, hard-to-learn dashboard tools
- Heavy dependency on data analysts
- Slow, manual reporting processes
- Difficulty understanding raw data structures

Many AI tools try to solve this by generating raw SQL directly from natural language — which introduces security risks and inconsistent results. MetricMind X instead routes every query through a **governed semantic layer**, keeping answers accurate, explainable, and safe.

---

## Project Highlights

- **Natural Language Analytics** — Ask business questions in plain English
- **Semantic Business Understanding** — Governed semantic layer for accurate context
- **Intelligent Query Routing** — Automatically routes queries to the right engine
- **Automated Data Profiling** — Understands data structure and characteristics
- **Data Quality Assessment** — Flags inconsistencies and reliability issues
- **Business Insight Generation** — Surfaces key insights automatically
- **Interactive Dashboard Generation** — Builds dashboards on the fly
- **Dashboard Storage & Retrieval** — Save and revisit dashboards anytime
- **Dashboard Search & Filtering** — Quickly find the dashboard you need
- **AI-Powered Analytics Workflow** — End-to-end agentic pipeline
- **Explainable Results** — Every answer comes with reasoning, not a black box
- **Modern Enterprise UI** — Clean, responsive, production-grade interface

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

## Future Scope

- User authentication & role-based access control
- Multi-dataset analytics
- Real-time dashboards
- Predictive analytics & AI forecasting
- PDF and Excel report export
- Scheduled reporting
- KPI monitoring

---

## Author

**Vinay Balhara**
B.Tech CSE (AI & ML), IIMT University Meerut

---

<p align="center">Built with a governed, explainable AI pipeline — not raw SQL generation.</p>
