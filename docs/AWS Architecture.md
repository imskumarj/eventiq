# ☁ EventIQ – AWS Cloud Architecture

## Production-Grade Deployment Architecture

This document explains the complete AWS infrastructure design used to deploy **EventIQ – Intelligent Event Analytics Platform** in a scalable, secure, and production-ready manner.

The architecture separates compute, storage, database, and monitoring layers while following best practices for security, scalability, and performance.

---

# 🏗 High-Level Architecture Overview

![Image](https://d2908q01vomqb2.cloudfront.net/fc074d501302eb2b93e2554793fcaf50b3bf7291/2024/05/15/fig1-comfyui-stable-diffusion-1024x580.png)

![Image](https://d2908q01vomqb2.cloudfront.net/5b384ce32d8cdef02bc3a139d4cac0a22bb029e8/2022/07/15/CF-S3-active-active-geo-proximity-architecture.png)

![Image](https://miro.medium.com/1%2AS1p2vdJCgEqdB9gM4gI6iA.gif)

![Image](https://miro.medium.com/v2/resize%3Afit%3A1400/1%2Am0GmprNvQHe5CvgOI0T8JQ.png)

## 🔁 Request Flow

```
User (Browser)
    ↓
CloudFront (CDN Layer)
    ↓
S3 (Frontend - Static Assets)
    ↓
CloudFront (API CDN Behavior)
    ↓
EC2 (Node Backend - Private)
    ↓
RDS PostgreSQL (Private Subnet)
    ↓
CloudWatch (Monitoring & Logs)
```

---

# 🎯 Architecture Goals

* Global content delivery (low latency)
* Backend isolation from public internet
* Secure database access
* Scalable and monitorable infrastructure
* Production-ready separation of concerns

---

# 🌍 Frontend Layer – S3 + CloudFront

## 📦 Amazon S3 (Static Hosting)

The frontend is deployed as a static build to:

* S3 bucket (private)
* Versioned static assets
* Optimized for performance
* No direct public access

### Why S3?

* Highly durable (99.999999999%)
* Low cost
* Serverless
* Automatic scaling

---

## 🚀 Amazon CloudFront (CDN)

CloudFront sits in front of:

* S3 (for static frontend)
* EC2 backend (API routing behavior)

### CloudFront Responsibilities

* Global caching
* HTTPS termination
* Compression
* Edge optimization
* API routing rules

### Behaviors Configured

| Path Pattern | Target      |
| ------------ | ----------- |
| `/`          | S3 bucket   |
| `/api/*`     | EC2 backend |
| `/assets/*`  | S3 cached   |

---

## 🔐 S3 Security Configuration

* Bucket private
* Access only via CloudFront Origin Access Control (OAC)
* No public read access
* HTTPS only policy enforced

---

# 🖥 Backend Layer – EC2 Behind CDN

## ⚙ Amazon EC2 (Application Server)

The Node.js backend runs on:

* Ubuntu 22.04
* PM2 process manager
* Nginx reverse proxy
* Security group restricted

### Why EC2?

* Full control over runtime
* Persistent server
* Custom configuration
* Easy scaling (vertical or via ASG)

---

## 🔁 Backend Request Flow

```
Client → CloudFront → EC2 (Nginx) → Node.js → PostgreSQL
```

CloudFront forwards `/api/*` traffic to EC2.

---

## 🔒 EC2 Security Configuration

### Security Group Rules

Inbound:

* 80/443 (from CloudFront only)
* SSH (restricted IP)

Outbound:

* 5432 to RDS
* HTTPS for updates

### Private Hardening

* Backend port not exposed publicly
* Application behind reverse proxy
* Environment variables secured

---

# 🗄 Database Layer – Amazon RDS (PostgreSQL)

## 🏦 RDS Configuration

* PostgreSQL engine
* Private subnet
* Automated backups enabled
* Storage autoscaling enabled
* Multi-AZ (optional for production)

---

## 🔐 RDS Security

* No public access
* Accepts traffic only from EC2 security group
* Encrypted storage
* SSL connections enforced

---

## 🧠 Why RDS Instead of Self-Managed?

* Automated backups
* Maintenance handled by AWS
* Better reliability
* Easier scaling
* Managed failover support

---

# 📊 Monitoring & Observability

## 📈 Amazon CloudWatch

### Logs Monitored

* EC2 application logs
* Nginx logs
* API errors
* Authentication failures

### Metrics Tracked

* CPU usage
* Memory utilization
* Disk IO
* Network traffic
* DB connections

### Alerts Configured

* High CPU threshold
* DB connection spike
* API error rate spike
* Server downtime

---

# 🛡 Network Architecture

## VPC Design

* Custom VPC
* Public subnet:

  * EC2 (optional public IP or behind ALB)
* Private subnet:

  * RDS database
* Internet Gateway attached
* NAT Gateway (if needed for private instances)

---

# 🔐 Security Architecture

## Defense in Depth

1. CloudFront (edge protection)
2. HTTPS enforced
3. S3 private access
4. EC2 restricted security group
5. RDS private subnet
6. Role-based IAM policies

---

## IAM Roles

* EC2 IAM role (CloudWatch access)
* Deployment IAM role
* Restricted S3 access
* Principle of least privilege

---

# ⚡ Scalability Strategy

## Frontend

* Automatically scalable via S3 + CloudFront

## Backend

Future scaling options:

* Auto Scaling Group
* Application Load Balancer
* Horizontal scaling
* Read replica for RDS

---

# 📦 Deployment Strategy

## Frontend Deployment

```
Build → Upload to S3 → Invalidate CloudFront Cache
```

## Backend Deployment

```
Push code → SSH EC2 → Pull → Restart PM2
```

---

# 🚀 CI/CD (Optional Enhancement)

Future improvements:

* GitHub Actions
* Automated S3 sync
* EC2 deployment automation
* Docker containerization

---

# 🔎 Performance Optimization

* Gzip compression
* Cache-control headers
* Indexed database queries
* Efficient pagination
* Optimized API payloads

---

# 📉 Failure Handling

| Component     | Failure Strategy |
| ------------- | ---------------- |
| EC2 crash     | Restart via PM2  |
| DB overload   | Vertical scaling |
| High traffic  | CDN absorbs load |
| Static assets | Served via edge  |

---

# 🧮 Estimated Infrastructure Cost (Small Scale)

* EC2 (t3.micro)
* RDS (db.t3.micro)
* S3 storage
* CloudFront bandwidth

Cost-efficient for portfolio/demo scale.

---

# 🏆 Why This Architecture is Production-Ready

* Clear separation of layers
* Backend isolated from public traffic
* Secure database deployment
* Global CDN acceleration
* Monitoring & alerting built-in
* Designed for scalability

---

# 🎯 What This Architecture Demonstrates

This infrastructure shows:

✔ Cloud-native thinking
✔ Security-first deployment
✔ CDN optimization
✔ Managed database best practices
✔ Production monitoring awareness
✔ Scalability planning

---

# 👤 Maintainer

Sudhansu Kumar
Cloud & Analytics Engineer
