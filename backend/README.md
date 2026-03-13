# EventIQ Backend

Backend API for **EventIQ**, an Event Analytics and Sponsor ROI Platform.

The backend is built with:

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication

---

# Features

- User authentication (JWT)
- Role-based access control
- Event management
- Sponsor tracking
- ROI analytics
- Report generation
- CSV data ingestion
- Secure API with rate limiting

---

# Project Structure
src
│
├── config
│ ├── db.js
│ └── env.js
│
├── controllers
├── routes
├── services
├── models
├── middlewares
├── utils
│
├── app.js
└── server.js

---

# Environment Setup

Create a `.env` file in the root directory.

Example:
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/eventiq"
JWT_SECRET="supersecretjwtkey"

---

# Running the Server

Development mode
```
npm run dev
```

Production mode
```
npm start
```

---

# Database Setup

Run Prisma migrations
```
npx prisma migrate dev --name init
```

Open Prisma Studio
```
npx prisma studio
```

---

# API Base URL

http://localhost:5000/api


---

# Example Endpoints

## Authentication

POST /api/auth/login  
POST /api/auth/register

## Events

GET /api/events  
POST /api/events

## Sponsors

GET /api/sponsors  
POST /api/sponsors

## Analytics

GET /api/analytics

---

# Security Features

- Helmet security headers
- Rate limiting
- JWT authentication
- Role-based access control
- Password hashing (bcrypt)

---

# Future Improvements

- Redis caching
- AWS S3 CSV uploads
- Background job processing
- Real-time dashboards

---

# Author
Sudhansu Kumar