# 🚀 EventIQ

## Intelligent Event Analytics Platform

> Measure What Matters, Prove Event ROI with Data.

EventIQ is a production-grade analytics platform designed to help event organizers and sponsors measure event performance, analyze sponsor ROI, and generate actionable insights using structured event data.

Built with a modern full-stack architecture and deployed on AWS cloud infrastructure, EventIQ demonstrates strong SQL design, backend architecture maturity, and cloud production readiness.

---

# 📌 Table of Contents

* Overview 
* Problem Statement
* Key Features
* System Architecture
* Tech Stack
* Database Schema Design
* Analytics Engine
* AWS Cloud Infrastructure
* Security Design
* Local Development Setup
* Production Deployment
* API Overview
* Future Enhancements
* What This Project Demonstrates

---

# 🎯 Overview

EventIQ is designed as an enterprise-ready analytics platform that transforms raw event and sponsorship data into measurable business intelligence.

The platform provides:

* Sponsor ROI analysis
* Event performance metrics
* Engagement insights
* Exportable business reports
* Administrative analytics engine

It is built to simulate a real-world SaaS analytics product.

---

# ❓ Problem Statement

Event organizers and sponsors often lack structured visibility into:

* Sponsorship performance
* Lead conversion efficiency
* Engagement metrics
* Revenue attribution
* Event growth trends

EventIQ solves this by providing a centralized analytics platform backed by structured relational data and business intelligence logic.

---

# ✨ Key Features

## 1️⃣ Event Data Ingestion

* CSV uploads
* Manual event entry
* Data validation & transformation
* Schema normalization

## 2️⃣ Sponsor ROI Analytics

* ROI calculation
* Cost per lead
* Engagement per dollar
* Sponsor comparison ranking

## 3️⃣ Interactive Dashboard

* KPI metrics
* Revenue trends
* Engagement visualization
* Sponsor performance charts

## 4️⃣ Exportable Reports

* CSV export
* Excel export
* PDF report generation

## 5️⃣ Admin Analytics Engine

* Cohort analysis
* Sponsor retention metrics
* Year-over-year growth analysis
* Advanced SQL aggregations

---

# 🏗 System Architecture

## High-Level Flow

```
Client (Browser)
      ↓
Frontend Application
      ↓
Node.js Backend API
      ↓
PostgreSQL (AWS RDS)
      ↓
CloudWatch Monitoring
```

---

# 🧰 Tech Stack

## Frontend

* React-based modern UI framework
* Chart.js / Recharts
* Axios for API communication
* Role-based rendering

## Backend

* Node.js
* Express.js
* RESTful API architecture
* JWT authentication
* Modular service structure

## Database

* PostgreSQL
* Fully normalized schema (3NF)
* Indexed for performance
* Analytical queries & aggregations

## Cloud

* AWS EC2 (Application Hosting)
* AWS RDS (PostgreSQL)
* AWS CloudWatch (Monitoring & Logs)

---

# 🗄 Database Schema Design

The schema is designed to demonstrate relational modeling strength and SQL maturity.

### Core Entities

### Users

* id (UUID)
* name
* email
* role (admin, sponsor, organizer)
* created_at

### Events

* id (UUID)
* name
* date
* location
* total_attendees
* revenue
* created_by

### Sponsors

* id (UUID)
* event_id (FK)
* company_name
* sponsorship_amount
* booth_visits
* leads_generated

### Event Metrics

* id (UUID)
* event_id (FK)
* engagement_score
* avg_session_time
* satisfaction_rating

### Reports

* id (UUID)
* generated_by
* report_type
* format
* created_at

---

## Example Analytical Query

```sql
SELECT sponsor_id,
       SUM(sponsorship_amount) AS total_investment,
       SUM(leads_generated) AS total_leads,
       (SUM(leads_generated) * 100 - SUM(sponsorship_amount)) 
       / SUM(sponsorship_amount) AS roi_percentage
FROM sponsors
GROUP BY sponsor_id
ORDER BY roi_percentage DESC;
```

---

# 📊 Analytics Engine

The analytics engine calculates:

* ROI = (Estimated Lead Value − Sponsorship Amount) / Sponsorship Amount
* Cost per lead
* Engagement per dollar spent
* Sponsor retention rate
* Event revenue growth trends
* Sponsor ranking leaderboard

Advanced analytics include:

* Cohort analysis
* Revenue correlation
* Year-over-year growth comparison
* Sponsor lifetime value estimation

---

# ☁ AWS Cloud Infrastructure

## Compute

* EC2 instance hosting backend
* Nginx reverse proxy
* PM2 process manager

## Database

* RDS PostgreSQL
* Automated backups
* Private subnet configuration

## Monitoring

* CloudWatch logs
* CPU alarms
* DB connection monitoring
* API error tracking

---

# 🔐 Security Design

* JWT authentication
* Role-based access control
* Secure environment variables
* Database in private subnet
* EC2 security groups
* HTTPS configuration
* Input validation & sanitization

---

# 🖥 Local Development Setup

## Prerequisites

* Node.js v18+
* PostgreSQL
* npm or yarn

---

## Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/eventiq
JWT_SECRET=your_secret_key
```

Run migrations and start server:

```
npm run dev
```

---

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

Application runs at:

```
http://localhost:3000
```

---

# 🚀 Production Deployment (AWS)

## 1️⃣ Launch EC2

* Ubuntu 22.04
* Install Node.js
* Configure Nginx
* Setup PM2

## 2️⃣ Setup RDS

* PostgreSQL instance
* Allow EC2 security group
* Enable automated backups

## 3️⃣ Configure Environment

* Store environment variables securely
* Connect backend to RDS endpoint

## 4️⃣ Monitoring

* Enable CloudWatch logs
* Configure CPU & memory alarms

---

# 📡 API Overview

## Authentication

* POST /auth/register
* POST /auth/login

## Events

* GET /events
* POST /events
* PUT /events/:id
* DELETE /events/:id

## Sponsors

* GET /sponsors
* POST /sponsors

## Analytics

* GET /analytics/roi
* GET /analytics/revenue

## Reports

* GET /reports/export

---

# 📈 Performance Considerations

* Indexed foreign keys
* Query optimization
* Aggregation caching (future scope)
* Read replica scalability
* Efficient pagination

---

# 🧪 Testing Strategy

* API route testing
* Input validation tests
* Authentication tests
* SQL aggregation testing

---

# 🔮 Future Enhancements

* Dual deployment procedure for frontend and backend separately 
* Multi-tenant SaaS model
* Stripe integration for sponsor billing
* Redis caching layer
* AI-based event performance prediction
* Real-time dashboard via WebSockets
* Load balancer & autoscaling

---

# 🧠 What This Project Demonstrates

This project showcases:

### ✔ SQL Mastery

* Aggregations
* Grouping
* Analytical queries
* Performance indexing

### ✔ Backend Architecture

* Clean service layer separation
* Role-based access control
* Structured REST APIs

### ✔ Cloud Production Mindset

* Secure infrastructure
* Monitoring strategy
* Scalable design

### ✔ Business Analytics Thinking

* Revenue modeling
* ROI calculation logic
* Metric interpretation
* Data normalization

---

# 👤 Author

**Sudhansu Kumar**
Cloud & Analytics Enthusiast
AWS-focused Full Stack Developer

---

# 📜 License
MIT License
