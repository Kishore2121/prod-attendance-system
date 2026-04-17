# Employee Attendance Management System

A production-grade full-stack attendance management system with role-based access control.

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Angular 19 + Angular Material     |
| Backend    | Node.js + Express.js              |
| Database   | MongoDB Atlas                     |
| Auth       | JWT + bcrypt + RBAC               |

## Project Structure

```
prod-attendance-system/
├── backend/
│   ├── src/
│   │   ├── config/db.js            # MongoDB connection
│   │   ├── controllers/            # Route handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── attendance.controller.js
│   │   │   └── admin.controller.js
│   │   ├── middleware/             # Auth, validation, error handling
│   │   │   ├── auth.js
│   │   │   ├── validators.js
│   │   │   └── errorHandler.js
│   │   ├── models/                 # Mongoose schemas
│   │   │   ├── User.js
│   │   │   └── Attendance.js
│   │   ├── routes/                 # Express routes
│   │   │   ├── auth.routes.js
│   │   │   ├── employee.routes.js
│   │   │   ├── attendance.routes.js
│   │   │   └── admin.routes.js
│   │   └── server.js              # App entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/              # Services, guards, interceptors, models
│   │   │   ├── features/          # Feature components
│   │   │   │   ├── auth/          # Login, Register
│   │   │   │   ├── employee/      # Dashboard, History
│   │   │   │   └── admin/         # Dashboard, Employees, Attendance
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── environments/
│   │   └── styles.scss
│   ├── angular.json
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas account (free tier)
- Angular CLI: `npm install -g @angular/cli`

## Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd prod-attendance-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and update:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/attendance-system
JWT_SECRET=your-secure-random-string-min-32-chars
CORS_ORIGIN=http://localhost:4200
```

Start the server:

```bash
npm run dev    # Development with nodemon
npm start      # Production
```

Backend runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
ng serve
```

Frontend runs at `http://localhost:4200`

## API Documentation

### Authentication

| Method | Endpoint            | Description          | Auth |
|--------|---------------------|----------------------|------|
| POST   | /api/auth/register  | Register user        | No   |
| POST   | /api/auth/login     | Login user           | No   |
| GET    | /api/auth/me        | Get current user     | Yes  |

**Register Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Attendance (Employee)

| Method | Endpoint                    | Description              | Auth     |
|--------|-----------------------------|--------------------------|----------|
| POST   | /api/attendance/check-in    | Mark check-in            | Employee |
| PUT    | /api/attendance/check-out   | Mark check-out           | Employee |
| GET    | /api/attendance/today       | Today's record           | Employee |
| GET    | /api/attendance/my          | Attendance history       | Employee |
| GET    | /api/attendance/percentage  | Attendance percentage    | Employee |

**Query params for /my:** `month`, `year`, `page`, `limit`
**Query params for /percentage:** `month`, `year`

### Admin

| Method | Endpoint                          | Description            | Auth  |
|--------|-----------------------------------|------------------------|-------|
| GET    | /api/admin/employees              | List all employees     | Admin |
| GET    | /api/admin/attendance             | All attendance records | Admin |
| PUT    | /api/admin/attendance/:id/status  | Approve/reject         | Admin |
| GET    | /api/admin/dashboard              | Dashboard analytics    | Admin |
| GET    | /api/admin/export/attendance      | Export CSV             | Admin |

**Update Status Request:**
```json
{ "status": "approved" }
```

**Attendance query params:** `page`, `status`, `date`, `employeeId`, `startDate`, `endDate`

## Business Rules

- **Attendance percentage** = (Approved days ÷ Working days in month) × 100
- Only **approved** records count toward percentage
- Employees below **60%** are flagged on admin dashboard
- One check-in per employee per day (enforced by compound index)
- Check-out is optional
- New attendance entries default to **pending** status

## Security Features

- Passwords hashed with bcrypt (12 rounds)
- JWT-based stateless authentication
- Role-based access control middleware
- Helmet HTTP security headers
- Rate limiting (100 requests / 15 min)
- Input validation with express-validator
- CORS configured for frontend origin only
- MongoDB injection prevention via Mongoose

---

## Deployment Guide

### MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (M0 Sandbox)
3. Create a database user with password
4. Whitelist `0.0.0.0/0` for IP access (or specific IPs)
5. Get the connection string and update `.env`

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com), create a **Web Service**
3. Connect your GitHub repo, set root directory: `backend`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add environment variables:
   - `MONGODB_URI` = your Atlas connection string
   - `JWT_SECRET` = secure random string
   - `JWT_EXPIRES_IN` = 7d
   - `CORS_ORIGIN` = your frontend URL (e.g., https://your-app.vercel.app)
   - `NODE_ENV` = production

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com), import your GitHub repo
2. Set root directory: `frontend`
3. **Build Command:** `ng build --configuration production`
4. **Output Directory:** `dist/attendance-system/browser`
5. Before deploying, update `src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-backend.onrender.com/api',
   };
   ```

### Vercel Routing Fix

Create `frontend/vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## License

MIT
