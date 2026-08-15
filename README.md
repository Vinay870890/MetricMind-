# MetricMind X

# Enterprise AI-Powered Semantic Business Intelligence Platform

MetricMind X is an AI-powered Business Intelligence platform that enables users to ask business questions in natural language and receive explainable analytics, automated insights, and interactive dashboards.

Unlike traditional AI systems that directly generate SQL, MetricMind X uses a governed semantic layer, validation pipeline, analytics engine, visualization layer, and agent workflow to ensure reliable and secure business intelligence.

---

## Project Highlights

- Natural Language Analytics
- Semantic Business Understanding
- Intelligent Query Routing
- Automated Data Profiling
- Data Quality Assessment
- Business Insight Generation
- Interactive Dashboard Generation
- Dashboard Storage & Retrieval
- Dashboard Search & Filtering
- AI-Powered Analytics Workflow
- Explainable Results
- Modern Enterprise UI

---

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Apache ECharts

### Backend

- FastAPI
- Python
- Pandas
- NumPy
- Pydantic

### AI Layer

- OpenAI
- LangChain
- LangGraph

### Database

- PostgreSQL
- SQLAlchemy
- Alembic

### Semantic Layer

- Cube.dev

---

# System Architecture

```text
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
