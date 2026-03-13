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
